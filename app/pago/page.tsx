import type { Metadata } from "next";
import { requireAuth } from "@/lib/session";
import { PaymentFlow } from "@/components/PaymentFlow";

export const metadata: Metadata = {
  title: "Pagar pedido",
  description:
    "Confirma tu pedido, envía el comprobante de pago móvil y listo.",
};

// SSR: página protegida, se renderiza por request.
export const dynamic = "force-dynamic";

export default async function PaymentPage() {
  await requireAuth("/pago");

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <header className="mb-8">
        <h1 className="font-heading text-4xl font-bold text-foreground">
          Paga tu pedido
        </h1>
        <p className="mt-2 text-muted-foreground">
          Revisá tu pedido, hacé el pago móvil y subí el comprobante.
        </p>
      </header>
      <PaymentFlow />
    </div>
  );
}