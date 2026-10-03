"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CartItem, Product, ProductSize } from "@/lib/types";

interface CartContextValue {
  items: CartItem[];
  count: number;
  total: number;
  addItem: (product: Product, size: ProductSize, quantity?: number) => void;
  updateQuantity: (productId: string, size: ProductSize, quantity: number) => void;
  removeItem: (productId: string, size: ProductSize) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "yogures-cremosos-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  // Estado inicial vacío en SSR e hidratación (evita mismatch de hidratación);
  // el carrito se restaura desde localStorage en un effect.
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Restaura el carrito guardado solo en el cliente, después de hidratar.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw) as CartItem[]);
    } catch {
      // se ignora.
    }
    setHydrated(true);
  }, []);

  // Persistencia en cada cambio (una vez restaurado el carrito).
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // se ignora.
    }
  }, [items, hydrated]);

  const addItem = useCallback(
    (product: Product, size: ProductSize, quantity = 1) => {
      setItems((prev) => {
        const existing = prev.find(
          (i) => i.productId === product.id && i.size === size,
        );
        if (existing) {
          return prev.map((i) =>
            i.productId === product.id && i.size === size
              ? { ...i, quantity: i.quantity + quantity }
              : i,
          );
        }
        const unitPrice = product.price;
        return [
          ...prev,
          {
            productId: product.id,
            name: product.name,
            size,
            quantity,
            unitPrice,
            liters: product.liters,
            imageSrc: product.image,
          },
        ];
      });
    },
    [],
  );

  const updateQuantity = useCallback(
    (productId: string, size: ProductSize, quantity: number) => {
      setItems((prev) =>
        prev
          .map((i) =>
            i.productId === productId && i.size === size
              ? { ...i, quantity: Math.max(1, quantity) }
              : i,
          )
          .filter((i) => i.quantity > 0),
      );
    },
    [],
  );

  const removeItem = useCallback((productId: string, size: ProductSize) => {
    setItems((prev) =>
      prev.filter((i) => !(i.productId === productId && i.size === size)),
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const { count, total } = useMemo(() => {
    return items.reduce(
      (acc, i) => {
        acc.count += i.quantity;
        acc.total += i.unitPrice * i.quantity;
        return acc;
      },
      { count: 0, total: 0 },
    );
  }, [items]);

  const value = useMemo(
    () => ({
      items,
      count,
      total,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
    }),
    [items, count, total, addItem, updateQuantity, removeItem, clearCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de <CartProvider>");
  return ctx;
}