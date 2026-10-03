/** Tamaños disponibles para un producto. */
export type ProductSize = "pequeño" | "grande";

/** Producto según `GET /api/products` + `image`/`isAvailable` del frontend. */
export interface Product {
  id: string;
  name: string;
  /** Precio (en bolívares). Cada tamaño es un producto aparte con su propio `price`. */
  price: number;
  description: string;
  category: string;
  liters: number;
  /** URL de la imagen (`productImg` del backend) o fallback local. */
  image: string;
  isAvailable: boolean;
  /** Tamaño intrínseco del producto (cada fila de la DB es un tamaño concreto). */
  size: ProductSize;
  /** Id del otro tamaño del mismo sabor (par). Vacío si no está enlazado. */
  relatedId?: string;
}

/** Par de tamaños de un mismo sabor (pequeño + grande). */
export interface ProductPair {
  /** Producto por tamaño; solo están presentes los que existen. */
  sizes: Partial<Record<ProductSize, Product>>;
  name: string;
  description: string;
  category: string;
  image: string;
}

/** Filtros del catálogo según `GET /api/products`. */
export interface ProductFilters {
  name?: string;
  category?: string;
  min_price?: number;
  max_price?: number;
}

/** Ítem del carrito (estado local, no viene de la API). */
export interface CartItem {
  productId: string;
  name: string;
  size: ProductSize;
  quantity: number;
  unitPrice: number;
  liters: number;
  imageSrc: string;
}

/** Payload de registro según `clients/registerClient.yml`. */
export interface RegisterPayload {
  name: string;
  lastname: string;
  email: string;
  "phone-number"?: string;
  password: string;
}

/** Payload de login según `clients/loginClient.yml`. */
export interface LoginPayload {
  email: string;
  password: string;
}

/** Ítem de orden según `orders/createOrder.yml`. El `size` lo calcula el backend. */
export interface OrderItemPayload {
  productId: string;
  quantity: number;
}

/** Perfil según `POST /api/clientes/auth/profile` (`phone`, sin dirección). */
export interface ClientProfile {
  name: string;
  lastname: string;
  email: string;
  phone: string;
}

/** Estado de una orden. */
export type OrderStatus =
  | "pendiente"
  | "comprobada"
  | "aprobada"
  | "entregada"
  | "rechazada";

/** Línea de detalle de una orden (qué yogures se compraron). */
export interface OrderItem {
  productId: string;
  name: string;
  size: ProductSize;
  quantity: number;
  unitPrice: number;
  liters: number;
  imageSrc: string;
}

/** Orden según el frontend (derivada de `Order` backend + `details`). */
export interface Order {
  id: string;
  price: number;
  orderStatus: OrderStatus;
  paymentReceiptImg?: string;
  deliveryDate?: string;
  liters: number;
  orderDate: string;
  items: OrderItem[];
}

/** Notificación del usuario (GET /api/clientes/notifications). */
export interface Notification {
  id: number;
  description: string;
  /** `true` = leída. */
  status: boolean;
  createdAt: string;
}

/* ---------- Tipos crudos del backend (contrato Go) ---------- */

export interface BackendProduct {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  liters: number;
  productImg: string;
  status: boolean;
  size: string;
  relatedId: string;
}

export interface BackendOrder {
  id: string;
  user_id: string;
  status: string;
  direction: string;
  receipt_img: string;
  delivery_date: string;
  created_at: string;
}

export interface BackendOrderDetail {
  product_id: string;
  order_id: string;
  price: number;
  liters: number;
  size: string;
  quantity: number;
}

export interface BackendProfile {
  id: string;
  name: string;
  lastname: string;
  email: string;
  phone: string;
  role: string;
}

export interface BackendNotification {
  id: number;
  description: string;
  user_id: string;
  status: boolean;
  created_at: string;
}