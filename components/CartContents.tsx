"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingCart, Sparkles } from "lucide-react";
import { useCart } from "@/lib/cart";
import type { ProductPair } from "@/lib/types";
import { formatBs } from "@/components/decor";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { InputGroup, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { Trash2 as TrashIcon } from "lucide-react";

function SuggestionCard({ pair }: { pair: ProductPair }) {
  const product = pair.sizes.pequeño ?? pair.sizes.grande;
  if (!product) return null;

  return (
    <Link
      href={`/productos/${product.id}`}
      className="group flex items-center gap-3 rounded-2xl bg-muted/40 p-3 transition-all hover:-translate-y-0.5 hover:bg-accent"
    >
      <div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-accent via-cielo to-secondary">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="56px"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-foreground">
          {product.name}
        </p>
        <p className="text-sm text-primary">
          {formatBs(product.price)}
        </p>
      </div>
    </Link>
  );
}

export function CartContents({ suggestions }: { suggestions: ProductPair[] }) {
  const { items, count, total, updateQuantity, removeItem, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="space-y-12">
        <Empty className="mx-auto max-w-md py-20">
          <EmptyMedia variant="icon">
            <ShoppingCart />
          </EmptyMedia>
          <EmptyContent>
            <EmptyTitle>Tu carrito está vacío</EmptyTitle>
            <EmptyDescription>
              Todavía no agregaste yogures. Explorá el catálogo y elegí tus
              favoritos.
            </EmptyDescription>
          </EmptyContent>
          <Button render={<Link href="/productos" />}>
            Ver yogures
          </Button>
        </Empty>
        {suggestions.length > 0 && (
          <section>
            <h2 className="mb-4 flex items-center gap-2 font-heading text-2xl font-bold text-foreground">
              <Sparkles className="size-5 text-primary" />
              Quizá también te guste
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {suggestions.map((pair) => (
                <SuggestionCard key={pair.name} pair={pair} />
              ))}
            </div>
          </section>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      {/* Ítems */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Revisá los yogures antes de pagar.
          </p>
          <AlertDialog>
            <AlertDialogTrigger
              render={
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive">
                  <TrashIcon data-icon="inline-start" />
                  Vaciar carrito
                </Button>
              }
            />
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogMedia>
                  <TrashIcon className="text-destructive" />
                </AlertDialogMedia>
                <AlertDialogTitle>¿Vaciar el carrito?</AlertDialogTitle>
                <AlertDialogDescription>
                  Se eliminarán todos los yogures que agregaste. Esta acción no
                  se puede deshacer.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  variant="destructive"
                  onClick={clearCart}
                >
                  Vaciar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {items.map((item) => (
          <Card key={`${item.productId}-${item.size}`} size="sm">
            <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-accent via-cielo to-secondary sm:size-20">
                <Image
                  src={item.imageSrc}
                  alt={item.name}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </div>

              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <Link
                  href={`/productos/${item.productId}`}
                  className="truncate font-heading text-base font-bold text-foreground hover:text-primary"
                >
                  {item.name}
                </Link>
                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
                    ×{item.quantity}
                  </span>
                  {item.size} · {item.liters} L
                </p>
                <p className="text-sm font-semibold text-primary">
                  {formatBs(item.unitPrice)}
                </p>
              </div>

              <div className="flex items-center justify-between gap-3 sm:justify-end">
                <InputGroup className="w-fit">
                  <InputGroupButton
                    onClick={() =>
                      updateQuantity(item.productId, item.size, item.quantity - 1)
                    }
                    aria-label="Disminuir cantidad"
                  >
                    <Minus />
                  </InputGroupButton>
                  <InputGroupInput
                    value={item.quantity}
                    inputMode="numeric"
                    readOnly
                    className="w-10 text-center"
                    aria-label="Cantidad"
                  />
                  <InputGroupButton
                    onClick={() =>
                      updateQuantity(item.productId, item.size, item.quantity + 1)
                    }
                    aria-label="Aumentar cantidad"
                  >
                    <Plus />
                  </InputGroupButton>
                </InputGroup>

                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-foreground sm:hidden">
                    {formatBs(item.unitPrice * item.quantity)}
                  </span>

                  <AlertDialog>
                    <AlertDialogTrigger
                      render={
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`Eliminar ${item.name}`}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 />
                        </Button>
                      }
                    />
                    <AlertDialogContent size="sm">
                      <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar este yogur?</AlertDialogTitle>
                        <AlertDialogDescription>
                          {item.name} ({item.size}) se quitará de tu carrito.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          variant="destructive"
                          onClick={() => removeItem(item.productId, item.size)}
                        >
                          Eliminar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>

              <div className="hidden w-24 text-right text-sm font-bold text-foreground sm:block">
                {formatBs(item.unitPrice * item.quantity)}
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Cross-sell */}
        {suggestions.length > 0 && (
          <section className="pt-6">
            <h2 className="mb-4 flex items-center gap-2 font-heading text-xl font-bold text-foreground">
              <Sparkles className="size-5 text-primary" />
              Quizá también te guste
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {suggestions.map((pair) => (
                <SuggestionCard key={pair.name} pair={pair} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Resumen */}
      <Card className="h-fit lg:sticky lg:top-20">
        <CardHeader>
          <CardTitle>Resumen del pedido</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>
              {count} {count === 1 ? "unidad" : "unidades"} · {items.length}{" "}
              {items.length === 1 ? "tipo" : "tipos"}
            </span>
            <span className="font-semibold text-foreground">
              {formatBs(total)}
            </span>
          </div>
          <Separator />
          <div className="flex justify-between">
            <span className="font-heading text-lg font-bold text-foreground">
              Total a pagar
            </span>
            <span className="font-heading text-lg font-bold text-primary">
              {formatBs(total)}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            El pago se realiza por pago móvil y debes enviar el comprobante al
            confirmar el pedido.
          </p>
        </CardContent>
        <CardFooter className="hidden flex-col gap-2 sm:flex">
          <Button size="lg" className="w-full" render={<Link href="/pago" />}>
            Ir a pagar
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="w-full"
            render={<Link href="/productos" />}
          >
            Seguir comprando
          </Button>
        </CardFooter>
      </Card>
    </div>

    {/* Barra de checkout fija en móvil */}
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 p-3 backdrop-blur sm:hidden">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-1">
        <div>
          <p className="text-xs text-muted-foreground">Total a pagar</p>
          <p className="font-heading text-lg font-bold text-primary">
            {formatBs(total)}
          </p>
        </div>
        <Button size="lg" className="flex-1 sm:flex-none" render={<Link href="/pago" />}>
          Ir a pagar
        </Button>
      </div>
    </div>
    </>
  );
}