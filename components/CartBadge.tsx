"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { useCart } from "@/lib/cart";
import { formatBs } from "@/components/decor";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Separator } from "@/components/ui/separator";

export function CartBadge() {
  const router = useRouter();
  const { items, count, total, updateQuantity, removeItem } = useCart();
  const [open, setOpen] = useState(false);

  function goToCart() {
    setOpen(false);
    router.push("/carrito");
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md"
      >
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-lg">
            <ShoppingCart className="size-5 text-primary" />
            Tu carrito
          </SheetTitle>
          <SheetDescription>
            {count > 0
              ? `${count} ${count === 1 ? "unidad" : "unidades"} en tu pedido`
              : "Tu carrito está vacío"}
          </SheetDescription>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="px-4">
            <Empty>
              <EmptyMedia variant="icon">
                <ShoppingCart />
              </EmptyMedia>
              <EmptyContent>
                <EmptyTitle>No hay yogures todavía</EmptyTitle>
                <EmptyDescription>
                  Explorá el catálogo y agregá tus favoritos.
                </EmptyDescription>
              </EmptyContent>
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                render={<Link href="/productos" />}
              >
                Ver yogures
              </Button>
            </Empty>
          </div>
        ) : (
          <>
            <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-4">
              {items.map((item) => (
                <div
                  key={`${item.productId}-${item.size}`}
                  className="flex items-center gap-3 rounded-2xl bg-muted/40 p-3"
                >
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-accent via-cielo to-secondary">
                    <Image
                      src={item.imageSrc}
                      alt={item.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="flex items-center gap-1.5">
                      <span className="truncate font-semibold text-foreground">
                        {item.name}
                      </span>
                      <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
                        ×{item.quantity}
                      </span>
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {item.size} · {item.liters} L
                    </span>
                    <span className="text-sm font-semibold text-primary">
                      {formatBs(item.unitPrice * item.quantity)}
                    </span>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => removeItem(item.productId, item.size)}
                      aria-label={`Eliminar ${item.name}`}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 />
                    </Button>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="icon-xs"
                        onClick={() =>
                          updateQuantity(item.productId, item.size, item.quantity - 1)
                        }
                        aria-label="Disminuir cantidad"
                      >
                        <Minus />
                      </Button>
                      <span className="w-6 text-center text-sm font-semibold text-foreground">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon-xs"
                        onClick={() =>
                          updateQuantity(item.productId, item.size, item.quantity + 1)
                        }
                        aria-label="Aumentar cantidad"
                      >
                        <Plus />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <SheetFooter>
              <div className="flex w-full flex-col gap-3">
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="font-heading text-base font-bold text-foreground">
                    Total
                  </span>
                  <span className="font-heading text-xl font-bold text-primary">
                    {formatBs(total)}
                  </span>
                </div>
                <Button size="lg" className="w-full" onClick={goToCart}>
                  Ir a la página del carrito
                  <ArrowRight data-icon="inline-end" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full"
                  onClick={() => setOpen(false)}
                  render={<Link href="/productos" />}
                >
                  Seguir comprando
                </Button>
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>

      <SheetTrigger
        render={
          <Button
            variant="outline"
            className="relative"
            aria-label={`Abrir carrito, ${count} ${count === 1 ? "unidad" : "unidades"}`}
          />
        }
      >
        <ShoppingCart className="size-5 text-primary" />
        <span className="hidden sm:inline">Carrito</span>
        {count > 0 && (
          <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gradient-to-br from-morado to-azul-intenso px-1 text-xs font-bold text-white">
            {count}
          </span>
        )}
      </SheetTrigger>
    </Sheet>
  );
}