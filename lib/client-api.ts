import type {
  BackendNotification,
  ClientProfile,
  Notification,
  OrderItemPayload,
} from "@/lib/types";
import { createClient } from "@/lib/supabase/client";

/**
 * Mutaciones del lado cliente (navegador). Llaman al backend con la cookie
 * `jwt` (credentials: "include"). El comprobante de pago se sube primero a
 * Supabase Storage y después se registra su path en el backend.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export interface ApiResult<T = { message: string }> {
  ok: boolean;
  status: number;
  data?: T;
  error?: string;
}

async function apiFetch<T = { message: string }>(
  path: string,
  options: RequestInit,
): Promise<ApiResult<T>> {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      credentials: "include",
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers ?? {}),
      },
    });

    let data: unknown = null;
    try {
      data = await res.json();
    } catch {
      // cuerpo vacío
    }

    if (!res.ok) {
      const err =
        (data as { error?: string })?.error ??
        (data as { message?: string })?.message ??
        "Error de conexión con el servidor";
      return { ok: false, status: res.status, error: err };
    }

    return { ok: true, status: res.status, data: data as T };
  } catch {
    return {
      ok: false,
      status: 0,
      error: "No se pudo conectar con el servidor. Intenta más tarde.",
    };
  }
}

export interface CreateOrderPayload {
  direction: string;
  deliveryDate: string;
}

/** Crea la orden (POST /api/clientes/order). Devuelve el id en `order_id`/`message`. */
export async function createOrder(
  items: OrderItemPayload[],
  payload: CreateOrderPayload,
): Promise<ApiResult<{ message: string; order_id?: string }>> {
  if (!items.length) {
    return { ok: false, status: 400, error: "El carrito está vacío" };
  }
  return apiFetch("/api/clientes/order", {
    method: "POST",
    body: JSON.stringify({
      direction: payload.direction,
      delivery_date: payload.deliveryDate,
      items: items.map((i) => ({
        product_id: i.productId,
        quantity: i.quantity,
      })),
    }),
  });
}

/** Sube el comprobante a Storage y lo registra en la orden (POST /order/:id/paymentReceipt/). */
export async function uploadPaymentReceipt(
  file: File,
  orderId: string,
): Promise<ApiResult<{ path: string }>> {
  if (!file) {
    return {
      ok: false,
      status: 400,
      error: "Debes adjuntar un comprobante de pago",
    };
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = `${user?.id ?? "anonimo"}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;

  const { error } = await supabase.storage
    .from("payment_receipt")
    .upload(path, file, { upsert: false });

  if (error) {
    return { ok: false, status: 400, error: error.message };
  }

  return apiFetch(`/api/clientes/order/${orderId}/paymentReceipt/`, {
    method: "POST",
    body: JSON.stringify({ receiptImg: path }),
  });
}

/** Actualiza el perfil (PUT /api/clientes/auth/profile). */
export async function updateProfile(
  userId: string,
  payload: ClientProfile,
): Promise<ApiResult> {
  void userId;
  return apiFetch("/api/clientes/auth/profile", {
    method: "PUT",
    body: JSON.stringify({
      name: payload.name,
      lastname: payload.lastname,
      email: payload.email,
      phone: payload.phone,
    }),
  });
}

/** Notificaciones del usuario (GET /api/clientes/notifications). */
export async function getMyNotifications(): Promise<ApiResult<Notification[]>> {
  const res = await apiFetch<BackendNotification[]>(
    "/api/clientes/notifications",
    { method: "GET" },
  );
  if (!res.ok || !res.data) return res as unknown as ApiResult<Notification[]>;
  return {
    ...res,
    data: res.data.map((n) => ({
      id: n.id,
      description: n.description,
      status: n.status,
      createdAt: n.created_at,
    })),
  };
}

/** Marca todas las notificaciones del usuario como leídas (PUT /api/clientes/notifications). */
export async function markAllNotificationsRead(): Promise<ApiResult> {
  return apiFetch("/api/clientes/notifications", { method: "PUT" });
}