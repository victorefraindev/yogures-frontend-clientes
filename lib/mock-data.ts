import type { Product } from "@/lib/types";

/**
 * Catálogo de demostración (rama `demo`).
 *
 * No consulta el backend ni Supabase: estos productos viven en el bundle y
 * usan las imágenes locales de `public/`.
 */
export const DEMO_PRODUCTS: Product[] = [
  {
    id: "yogur-de-fresa-pequeno",
    name: "Yogur de Fresa Pequeño",
    price: 120,
    description:
      "Yogur artesanal de fresa natural, cremoso y fresco. Envase de 0.5 L.",
    category: "frutal",
    liters: 0.5,
    image: "/yogurt-fresa.webp",
    isAvailable: true,
    size: "pequeño",
    relatedId: "yogur-de-fresa-grande",
  },
  {
    id: "yogur-de-fresa-grande",
    name: "Yogur de Fresa Grande",
    price: 200,
    description:
      "Nuestro clásico de fresa en tamaño familiar. Ideal para compartir. Envase de 1 L.",
    category: "frutal",
    liters: 1,
    image: "/yogurt-fresa.webp",
    isAvailable: true,
    size: "grande",
    relatedId: "yogur-de-fresa-pequeno",
  },
  {
    id: "yogur-de-mora-pequeno",
    name: "Yogur de Mora Pequeño",
    price: 130,
    description:
      "Mora seleccionada y batida lentamente para un sabor profundo. Envase de 0.5 L.",
    category: "frutal",
    liters: 0.5,
    image: "/yogurt-mora.webp",
    isAvailable: true,
    size: "pequeño",
    relatedId: "yogur-de-mora-grande",
  },
  {
    id: "yogur-de-mora-grande",
    name: "Yogur de Mora Grande",
    price: 210,
    description:
      "Yogur de mora en presentación grande, con textura extra cremosa. Envase de 1 L.",
    category: "frutal",
    liters: 1,
    image: "/yogurt-mora.webp",
    isAvailable: true,
    size: "grande",
    relatedId: "yogur-de-mora-pequeno",
  },
  {
    id: "yogur-de-maracuya-pequeno",
    name: "Yogur de Maracuyá Pequeño",
    price: 140,
    description:
      "Maracuyá fresco con el equilibrio justo entre dulce y ácido. Envase de 0.5 L.",
    category: "especial",
    liters: 0.5,
    image: "/yogurt-maracuya.jpg",
    isAvailable: true,
    size: "pequeño",
    relatedId: "yogur-de-maracuya-grande",
  },
  {
    id: "yogur-de-maracuya-grande",
    name: "Yogur de Maracuyá Grande",
    price: 220,
    description:
      "El toque tropical de la casa en tamaño grande. Envase de 1 L.",
    category: "especial",
    liters: 1,
    image: "/yogurt-maracuya.jpg",
    isAvailable: true,
    size: "grande",
    relatedId: "yogur-de-maracuya-pequeno",
  },
];

export function findDemoProduct(id: string): Product | undefined {
  return DEMO_PRODUCTS.find((product) => product.id === id);
}
