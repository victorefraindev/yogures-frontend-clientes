import type { Metadata } from "next";
import { getProducts, groupByFlavor } from "@/lib/api";
import { CartContents } from "@/components/CartContents";

export const metadata: Metadata = {
  title: "Tu carrito",
  description:
    "Revisa los yogures que elegiste, ajusta cantidades y calcula el total de tu pedido.",
};

export default async function CartPage() {
  const suggestions = groupByFlavor(await getProducts()).slice(0, 3);

  return (
    <div className="mx-auto max-w-6xl px-4 pt-12 pb-28 sm:px-6 sm:pb-12">
      <header className="mb-8">
        <h1 className="font-heading text-4xl font-bold text-foreground">
          Tu carrito
        </h1>
        <p className="mt-2 text-muted-foreground">
          Verificá que todo esté como querés antes de pagar.
        </p>
      </header>
      <CartContents suggestions={suggestions} />
    </div>
  );
}