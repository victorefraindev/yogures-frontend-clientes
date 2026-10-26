import type {
  ClientProfile,
  Notification,
  OrderItemPayload,
} from "@/lib/types";
import {
  attachDemoReceipt,
  createDemoOrder,
  getDemoNotifications,
  markDemoNotificationsRead,
  saveDemoProfile,
} from "@/lib/mock-store";

/**
 * Mutaciones de la rama `demo`. Todo se guarda en localStorage; no hay fetch
 * al backend ni subida de archivos a Supabase.
 */

export interface ApiResult<T = { message: string }> {
  ok: boolean;
  status: number;
  data?: T;
  error?: string;
}

export interface CreateOrderPayload {
  direction: string;
  deliveryDate: string;
}

/** Crea la orden en el estado local. Devuelve el id en `order_id`/`message`. */
export async function createOrder(
  items: OrderItemPayload[],
  payload: CreateOrderPayload,
): Promise<ApiResult<{ message: string; order_id?: string }>> {
  if (!items.length) {
    return { ok: false, status: 400, error: "El carrito está vacío" };
  }

  try {
    const order = createDemoOrder(items, payload);
    return {
      ok: true,
      status: 200,
      data: { message: order.id, order_id: order.id },
    };
  } catch (error) {
    return {
      ok: false,
      status: 400,
      error:
        error instanceof Error
          ? error.message
          : "No se pudo crear la orden de demostración.",
    };
  }
}

/** Simula el registro del comprobante (no se sube ningún archivo). */
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

  attachDemoReceipt(orderId, "/comprobante-demo");
  return { ok: true, status: 200, data: { path: "/comprobante-demo" } };
}

/** Actualiza el perfil local. */
export async function updateProfile(
  userId: string,
  payload: ClientProfile,
): Promise<ApiResult> {
  void userId;
  saveDemoProfile(payload);
  return {
    ok: true,
    status: 200,
    data: { message: "Perfil actualizado (demo)" },
  };
}

/** Notificaciones locales del usuario. */
export async function getMyNotifications(): Promise<ApiResult<Notification[]>> {
  return { ok: true, status: 200, data: getDemoNotifications() };
}

/** Marca todas las notificaciones como leídas. */
export async function markAllNotificationsRead(): Promise<ApiResult> {
  markDemoNotificationsRead();
  return {
    ok: true,
    status: 200,
    data: { message: "Notificaciones marcadas como leídas" },
  };
}
