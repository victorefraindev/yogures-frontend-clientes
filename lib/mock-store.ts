import { findDemoProduct } from "@/lib/mock-data";
import type {
  ClientProfile,
  Notification,
  Order,
  OrderItem,
  OrderItemPayload,
} from "@/lib/types";

/**
 * Estado de la demo (rama `demo`): perfil, pedidos y notificaciones viven en
 * localStorage. No hay backend ni Supabase.
 */

const PROFILE_KEY = "yogures-demo-profile";
const ORDERS_KEY = "yogures-demo-orders";
const NOTIFICATIONS_KEY = "yogures-demo-notifications";
const SESSION_KEY = "yogures-demo-session";

export const DEMO_USER_ID = "demo-user";

export const DEMO_PROFILE: ClientProfile = {
  name: "Victoria",
  lastname: "Pérez",
  email: "demo@yogures.com",
  phone: "+58 412-1234567",
};

interface DemoSession {
  email: string;
}

function canUseStorage(): boolean {
  return typeof window !== "undefined";
}

function readJson<T>(key: string, fallback: T): T {
  if (!canUseStorage()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown): void {
  if (!canUseStorage()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Modo demo: si el navegador bloquea localStorage, la app sigue funcionando
    // con los datos en memoria de esta sesión.
  }
}

function itemOf(productId: string, quantity: number): OrderItem {
  const product = findDemoProduct(productId);
  if (!product) {
    throw new Error(`Producto de demo inexistente: ${productId}`);
  }
  return {
    productId: product.id,
    name: product.name,
    size: product.size,
    quantity,
    unitPrice: product.price,
    liters: product.liters,
    imageSrc: product.image,
  };
}

function totals(items: OrderItem[]): { price: number; liters: number } {
  return {
    price: items.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0),
    liters: items.reduce((acc, item) => acc + item.liters * item.quantity, 0),
  };
}

/**
 * Las fechas de entrega llegan del input como `YYYY-MM-DD`. Les agregamos
 * mediodía UTC para que al formatearlas en America/Caracas no caigan un día
 * antes.
 */
function deliveryAtNoon(value: string): string {
  return value.includes("T") ? value : `${value}T12:00:00.000Z`;
}

function seededOrders(): Order[] {
  const first = [
    itemOf("yogur-de-fresa-pequeno", 2),
    itemOf("yogur-de-mora-grande", 1),
  ];
  const second = [
    itemOf("yogur-de-maracuya-pequeno", 1),
    itemOf("yogur-de-fresa-grande", 1),
  ];

  return [
    {
      id: "demo-1001",
      ...totals(first),
      orderStatus: "entregada",
      deliveryDate: "2026-10-09T12:00:00.000Z",
      orderDate: "2026-10-05T14:30:00.000Z",
      items: first,
    },
    {
      id: "demo-1002",
      ...totals(second),
      orderStatus: "comprobada",
      deliveryDate: "2026-10-24T12:00:00.000Z",
      orderDate: "2026-10-20T11:05:00.000Z",
      paymentReceiptImg: "/comprobante-demo",
      items: second,
    },
  ];
}

function seededNotifications(): Notification[] {
  return [
    {
      id: 1,
      description: "Tu pedido #demo-1001 fue entregado. ¡Buen provecho!",
      status: true,
      createdAt: "2026-10-09T16:10:00.000Z",
    },
    {
      id: 2,
      description:
        "Recibimos el comprobante de tu pedido #demo-1002. Estamos verificándolo.",
      status: false,
      createdAt: "2026-10-20T11:10:00.000Z",
    },
  ];
}

export function getDemoProfile(): ClientProfile {
  const stored = readJson<ClientProfile | null>(PROFILE_KEY, null);
  if (stored) return stored;
  writeJson(PROFILE_KEY, DEMO_PROFILE);
  return { ...DEMO_PROFILE };
}

export function saveDemoProfile(profile: ClientProfile): void {
  writeJson(PROFILE_KEY, profile);
}

export function getDemoSession(): DemoSession | null {
  return readJson<DemoSession | null>(SESSION_KEY, null);
}

export function loginDemo(email: string): void {
  const profile = getDemoProfile();
  saveDemoProfile({ ...profile, email });
  writeJson(SESSION_KEY, { email } satisfies DemoSession);
}

export function registerDemo(profile: ClientProfile): void {
  saveDemoProfile(profile);
  writeJson(SESSION_KEY, { email: profile.email } satisfies DemoSession);
}

export function clearDemoSession(): void {
  if (!canUseStorage()) return;
  try {
    window.localStorage.removeItem(SESSION_KEY);
  } catch {
    // Nada que limpiar.
  }
}

export function getDemoOrders(): Order[] {
  const stored = readJson<Order[] | null>(ORDERS_KEY, null);
  if (stored) return stored;
  const seed = seededOrders();
  writeJson(ORDERS_KEY, seed);
  return seed;
}

export function createDemoOrder(
  items: OrderItemPayload[],
  payload: { direction: string; deliveryDate: string },
): Order {
  const orderItems = items.map((item) => itemOf(item.productId, item.quantity));
  const order: Order = {
    id: `demo-${Date.now()}`,
    ...totals(orderItems),
    orderStatus: "comprobada",
    deliveryDate: deliveryAtNoon(payload.deliveryDate),
    orderDate: new Date().toISOString(),
    items: orderItems,
  };

  const orders = getDemoOrders();
  writeJson(ORDERS_KEY, [order, ...orders]);
  return order;
}

export function attachDemoReceipt(orderId: string, receiptImg: string): void {
  const orders = getDemoOrders().map((order) =>
    order.id === orderId ? { ...order, paymentReceiptImg: receiptImg } : order,
  );
  writeJson(ORDERS_KEY, orders);
}

export function getDemoNotifications(): Notification[] {
  const stored = readJson<Notification[] | null>(NOTIFICATIONS_KEY, null);
  if (stored) return stored;
  const seed = seededNotifications();
  writeJson(NOTIFICATIONS_KEY, seed);
  return seed;
}

export function markDemoNotificationsRead(): void {
  const notifications = getDemoNotifications().map((notification) => ({
    ...notification,
    status: true,
  }));
  writeJson(NOTIFICATIONS_KEY, notifications);
}
