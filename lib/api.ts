import { cache } from "react";
import { DEMO_PRODUCTS } from "@/lib/mock-data";
import type { Product, ProductFilters, ProductPair, ProductSize } from "@/lib/types";

/**
 * Capa de datos del catálogo para la rama `demo`.
 * Los productos son fixtures locales: no hay fetch al backend.
 */

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
    let result = DEMO_PRODUCTS.filter((product) => product.isAvailable);

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
