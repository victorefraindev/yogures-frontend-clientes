import { cache } from "react";
import { cookies } from "next/headers";
import type {
  BackendOrder,
  BackendOrderDetail,
  BackendProduct,
  BackendProfile,
  ClientProfile,
  Order,
  OrderItem,
  OrderStatus,
  Product,
  ProductFilters,
  ProductPair,
  ProductSize,
} from "@/lib/types";

/**
 * Capa de datos (server). Llama a la API del backend (`/api/products`,
 * `/api/clientes/*`). Los endpoints protegidos requieren la cookie `jwt`, que
 * se reenvía desde `cookies()`.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

const FALLBACK_IMAGE = "/yogurt-fresa.webp";

/** GET con las cookies del request (necesario para rutas autenticadas). */
async function apiGet<T>(path: string, init?: RequestInit): Promise<T | null> {
  try {
    const store = await cookies();
    const res = await fetch(`${API_URL}${path}`, {
      ...init,
      headers: {
        ...(init?.headers ?? {}),
        Cookie: store.toString(),
      },
      cache: "no-store",
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

function toProduct(raw: BackendProduct): Product {
  return {
    id: raw.id,
    name: raw.name,
    price: raw.price,
    description: raw.description,
    category: raw.category,
    liters: raw.liters,
    image: raw.productImg || FALLBACK_IMAGE,
    isAvailable: raw.status,
    size: raw.size === "grande" ? "grande" : "pequeño",
    relatedId: raw.relatedId && raw.relatedId !== "null" ? raw.relatedId : undefined,
  };
}

/** Agrupa los productos en pares por sabor (pequeño + grande) usando `relatedId`. */
export function groupByFlavor(products: Product[]): ProductPair[] {
  const groups = new Map<string, Product[]>();

  for (const product of products) {
    if (product.relatedId) {
      // Clave simétrica para unir ambas direcciones del par.
      const key = [product.id, product.relatedId].sort().join("|");
      const group = groups.get(key) ?? [];
      group.push(product);
      groups.set(key, group);
    } else {
      groups.set(product.id, [product]);
    }
  }

  return [...groups.values()].map((group) => {
    const sizes = {} as Partial<Record<ProductSize, Product>>;
    for (const product of group) {
      sizes[product.size] = product;
    }
    const representative = group[0];
    return {
      sizes,
      name: representative.name,
      description: representative.description,
      category: representative.category,
      image: representative.image,
    };
  });
}

export const getProducts = cache(
  async (filters?: ProductFilters): Promise<Product[]> => {
    let raw: BackendProduct[] | null = null;
    try {
      const res = await fetch(`${API_URL}/api/products`, {
        next: { revalidate: 60 },
      });
      if (!res.ok) return [];
      // Go serializa una tabla vacía como `null`, no como `[]`.
      raw = (await res.json()) as BackendProduct[] | null;
    } catch {
      return [];
    }

    let result = (raw ?? []).filter((p) => p.status).map(toProduct);

    if (filters?.name) {
      const q = filters.name.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(q));
    }
    if (filters?.category) {
      result = result.filter((p) => p.category === filters.category);
    }
    if (filters?.min_price != null) {
      result = result.filter((p) => p.price >= filters.min_price!);
    }
    if (filters?.max_price != null) {
      result = result.filter((p) => p.price <= filters.max_price!);
    }

    return result;
  },
);

export const getProduct = cache(async (id: string): Promise<Product | null> => {
  const products = await getProducts();
  return products.find((p) => p.id === id) ?? null;
});

export const getCategories = cache(async (): Promise<string[]> => {
  const products = await getProducts();
  return [...new Set(products.map((p) => p.category))];
});

/** Pares recomendados (primeros 3 sabores del catálogo). */
export const getRecommendedProducts = cache(async (): Promise<ProductPair[]> => {
  const products = await getProducts();
  return groupByFlavor(products).slice(0, 3);
});

const KNOWN_STATUSES: OrderStatus[] = [
  "pendiente",
  "comprobada",
  "aprobada",
  "entregada",
  "rechazada",
];

function normalizeStatus(status: string): OrderStatus {
  return KNOWN_STATUSES.includes(status as OrderStatus)
    ? (status as OrderStatus)
    : "pendiente";
}

async function buildOrderItems(orderId: string, products: Product[]): Promise<OrderItem[]> {
  const details = await apiGet<BackendOrderDetail[]>(
    `/api/clientes/order/${orderId}/details`,
  );
  if (!details) return [];

  return details.map((d) => {
    const product = products.find((p) => p.id === d.product_id);
    return {
      productId: d.product_id,
      name: product?.name ?? "Yogur",
      size: product?.size ?? (d.size === "grande" ? "grande" : "pequeño"),
      quantity: d.quantity,
      unitPrice: d.quantity > 0 ? d.price / d.quantity : d.price,
      liters: d.liters,
      imageSrc: product?.image ?? FALLBACK_IMAGE,
    };
  });
}

function toOrder(
  raw: BackendOrder,
  items: OrderItem[],
): Order {
  const total = items.reduce((acc, i) => acc + i.unitPrice * i.quantity, 0);
  const liters = items.reduce((acc, i) => acc + i.liters * i.quantity, 0);
  return {
    id: raw.id,
    price: total,
    orderStatus: normalizeStatus(raw.status),
    paymentReceiptImg: raw.receipt_img || undefined,
    deliveryDate: raw.delivery_date || undefined,
    liters,
    orderDate: raw.created_at,
    items,
  };
}

/** Historial de pedidos (GET /api/clientes/order + detalles por pedido). */
export const getOrders = cache(async (): Promise<Order[]> => {
  const products = await getProducts();
  const raw = await apiGet<BackendOrder[]>("/api/clientes/order");
  if (!raw) return [];

  const orders: Order[] = [];
  for (const order of raw) {
    const items = await buildOrderItems(order.id, products);
    orders.push(toOrder(order, items));
  }
  return orders;
});

/** Perfil del usuario (POST /api/clientes/auth/profile). */
export const getProfile = cache(async (userId: string): Promise<ClientProfile> => {
  void userId;
  const raw = await apiGet<BackendProfile>("/api/clientes/auth/profile", {
    method: "POST",
  });
  return {
    name: raw?.name ?? "",
    lastname: raw?.lastname ?? "",
    email: raw?.email ?? "",
    phone: raw?.phone ?? "",
  };
});