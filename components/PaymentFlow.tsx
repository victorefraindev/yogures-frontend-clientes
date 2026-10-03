"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  CreditCard,
  ImagePlus,
  Loader2,
  ShieldCheck,
  ShoppingCart,
} from "lucide-react";
import { useCart } from "@/lib/cart";
import { createOrder, uploadPaymentReceipt } from "@/lib/client-api";
import { formatBs } from "@/components/decor";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel, FieldDescription } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/toast";

type Step = "resumen" | "comprobante" | "listo";

export function PaymentFlow() {
  const { items, total, clearCart } = useCart();
  const [step, setStep] = useState<Step>(items.length ? "resumen" : "listo");
  const [submitting, setSubmitting] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [direction, setDirection] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryError, setDeliveryError] = useState<string | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setError(null);
  }

  async function handleSubmitReceipt() {
    setError(null);

    const itemsPayload = items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
    }));
    setSubmitting(true);

    const order = await createOrder(itemsPayload, { direction, deliveryDate });
    if (!order.ok) {
      setError(order.error ?? "No se pudo crear la orden.");
      setSubmitting(false);
      return;
    }

    const orderId = order.data?.order_id ?? order.data?.message;
    if (!orderId) {
      setError("No se pudo obtener el identificador de la orden.");
      setSubmitting(false);
      return;
    }

    if (file) {
      const receipt = await uploadPaymentReceipt(file, orderId);
      if (!receipt.ok) {
        setError(receipt.error ?? "No se pudo enviar el comprobante.");
        setSubmitting(false);
        return;
      }
    }

    toast.add({
      type: "success",
      title: "Pago recibido",
      description: "Te notificaremos cuando tu orden sea aceptada.",
    });
    clearCart();
    setSubmitting(false);
    setStep("listo");
  }

  const stepIndex = submitting
    ? 1
    : ["resumen", "comprobante", "listo"].indexOf(step as "resumen");

  const steps = [
    { key: "resumen", label: "Resumen" },
    { key: "comprobante", label: "Comprobante" },
    { key: "listo", label: "Confirmado" },
  ] as const;

  // Paso final: confirmación.
  if (step === "listo") {
    return (
      <Card className="mx-auto max-w-lg text-center">
        <CardContent className="flex flex-col items-center gap-4 pt-10 pb-10">
          <span className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <CheckCircle2 className="size-8" />
          </span>
          <h2 className="font-heading text-2xl font-bold text-foreground">
            ¡Pago recibido!
          </h2>
          <p className="text-muted-foreground">
            Tu pago fue recibido correctamente. Te notificaremos cuando tu
            orden sea aceptada. Podés seguir el estado en tu perfil.
          </p>
          <Button render={<Link href="/perfil" />}>Ver mis pedidos</Button>
        </CardContent>
      </Card>
    );
  }

  // Carrito vacío.
  if (items.length === 0 && step === "resumen") {
    return (
      <Card className="mx-auto max-w-lg text-center">
        <CardContent className="flex flex-col items-center gap-4 pt-10 pb-10">
          <span className="flex size-14 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
            <ShoppingCart className="size-8" />
          </span>
          <h2 className="font-heading text-2xl font-bold text-foreground">
            Tu carrito está vacío
          </h2>
          <p className="text-muted-foreground">
            Agregá yogures al carrito para poder pagar.
          </p>
          <Button render={<Link href="/productos" />}>Ver yogures</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      {/* Stepper */}
      <div className="lg:col-span-2">
        <ol className="flex items-center gap-2">
          {steps.map((s, i) => {
            const done = stepIndex > i;
            const active = stepIndex === i;
            return (
              <li key={s.key} className="flex flex-1 items-center gap-2">
                <span
                  className={`flex size-7 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                    done
                      ? "bg-primary text-primary-foreground"
                      : active
                        ? "bg-primary/15 text-primary ring-2 ring-primary/40"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {done ? "✓" : i + 1}
                </span>
                <span
                  className={`text-sm font-medium ${
                    active ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {s.label}
                </span>
                {i < steps.length - 1 && (
                  <span className="h-px flex-1 bg-border" aria-hidden="true" />
                )}
              </li>
            );
          })}
        </ol>
      </div>

      {/* Paso 1: Resumen */}
      {step === "resumen" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Resumen de tu pedido</CardTitle>
              <CardDescription>
                Verificá los yogures antes de pagar.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={`${item.productId}-${item.size}`} className="flex items-center gap-4">
                    <div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-accent via-cielo to-secondary">
                      <Image
                        src={item.imageSrc}
                        alt={item.name}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <span className="truncate font-semibold text-foreground">
                        {item.name}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {item.size} · x{item.quantity}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-foreground">
                      {formatBs(item.unitPrice * item.quantity)}
                    </span>
                  </div>
                ))}
                <Separator />
                <div className="flex justify-between">
                  <span className="font-heading text-lg font-bold text-foreground">
                    Total
                  </span>
                  <span className="font-heading text-lg font-bold text-primary">
                    {formatBs(total)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Datos de entrega</CardTitle>
              <CardDescription>
                Indicá la dirección y la fecha en que querés recibir tu pedido.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <Field data-invalid={!!deliveryError}>
                  <FieldLabel htmlFor="direccion">Dirección de entrega</FieldLabel>
                  <Input
                    id="direccion"
                    value={direction}
                    onChange={(e) => setDirection(e.target.value)}
                    placeholder="Av. Principal, Caracas"
                  />
                </Field>
                <Field data-invalid={!!deliveryError}>
                  <FieldLabel htmlFor="fecha-entrega">Fecha de entrega</FieldLabel>
                  <FieldDescription>
                    Elegí una fecha a partir de mañana.
                  </FieldDescription>
                  <Input
                    id="fecha-entrega"
                    type="date"
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                  />
                </Field>
                {deliveryError && (
                  <Alert variant="destructive">
                    <AlertTitle>Faltan datos de entrega</AlertTitle>
                    <AlertDescription>{deliveryError}</AlertDescription>
                  </Alert>
                )}
              </FieldGroup>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-3">
            <Button
              size="lg"
              className="w-full"
              onClick={() => {
                if (!direction.trim() || !deliveryDate) {
                  setDeliveryError(
                    "Completá la dirección y la fecha de entrega para continuar.",
                  );
                  return;
                }
                setDeliveryError(null);
                setStep("comprobante");
              }}
            >
              Ya pagué
              <ArrowRight data-icon="inline-end" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="w-full"
              render={<Link href="/carrito" />}
            >
              Volver al carrito
            </Button>
          </div>
        </div>
      )}

      {/* Paso 2: Comprobante */}
      {step === "comprobante" && (
        <>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Subí tu comprobante de pago</CardTitle>
                <CardDescription>
                  Envía la captura del pago móvil para confirmar tu orden.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="comprobante">
                      Captura del pago
                    </FieldLabel>
                    <FieldDescription>
                      Formato de imagen (PNG, JPG). Se envía junto con tu orden.
                    </FieldDescription>
                    <label
                      htmlFor="comprobante"
                      className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-input bg-muted/30 px-6 py-8 text-center transition-colors hover:border-primary/50 hover:bg-muted/50"
                    >
                      {preview ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={preview}
                          alt="Vista previa del comprobante"
                          className="max-h-48 rounded-xl object-contain"
                        />
                      ) : (
                        <>
                          <ImagePlus className="size-8 text-primary" />
                          <span className="text-sm font-medium text-foreground">
                            Clic para elegir la imagen
                          </span>
                        </>
                      )}
                      <input
                        id="comprobante"
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={handleFileChange}
                      />
                    </label>
                  </Field>
                </FieldGroup>
              </CardContent>
            </Card>

            {error && (
              <Alert variant="destructive">
                <AlertTitle>No pudimos enviar el comprobante</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex flex-col gap-3">
              <Button
                size="lg"
                className="w-full"
                onClick={handleSubmitReceipt}
                disabled={submitting || !file}
              >
                {submitting ? (
                  <>
                    <Loader2 className="animate-spin" data-icon="inline-start" />
                    Enviando comprobante…
                  </>
                ) : (
                  <>
                    <CreditCard data-icon="inline-start" />
                    Enviar comprobante
                  </>
                )}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="w-full"
                onClick={() => {
                  setError(null);
                  setStep("resumen");
                }}
              >
                Volver al resumen
              </Button>
            </div>
            <p className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
              <ShieldCheck className="size-4 text-primary" />
              Tus datos se usan solo para procesar la entrega.
            </p>
          </div>
        </>
      )}

      {/* Método de pago */}
      <Card className="h-fit lg:sticky lg:top-20">
        <CardHeader>
          <CardTitle>Pago móvil</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="rounded-2xl bg-muted/50 p-4">
            <p className="font-semibold text-foreground">Datos para el pago</p>
            <p className="mt-2 text-muted-foreground">
              Banco: <span className="font-medium text-foreground">Banco Nacional</span>
            </p>
            <p className="text-muted-foreground">
              Teléfono: <span className="font-medium text-foreground">0412-123-4567</span>
            </p>
            <p className="text-muted-foreground">
              Titular: <span className="font-medium text-foreground">Yogures Cremosos C.A.</span>
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            Monto a pagar:{" "}
            <span className="font-bold text-primary">{formatBs(total)}</span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}