"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  CalendarDays,
  ChevronRight,
  Droplets,
  ReceiptText,
} from "lucide-react";
import type { Order } from "@/lib/types";
import { formatBs, formatDate, formatDateTime } from "@/components/decor";
import { OrderStatusBadge } from "@/components/OrderStatusBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

function OrderDetailDialog({ order }: { order: Order }) {
  const itemCount = order.items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <DialogContent className="sm:max-w-lg">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 text-lg">
          <ReceiptText className="size-5 text-primary" />
          Pedido #{order.id.slice(0, 8)}
        </DialogTitle>
        <DialogDescription>
          Yogures comprados en esta orden.
        </DialogDescription>
      </DialogHeader>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <OrderStatusBadge status={order.orderStatus} />
        </div>
        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <CalendarDays className="size-4 text-primary" />
            {formatDateTime(order.orderDate)}
          </span>
          <span className="flex items-center gap-1">
            <Droplets className="size-4 text-primary" />
            {order.liters} L
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {order.items.map((item) => (
          <div
            key={`${item.productId}-${item.size}`}
            className="flex items-center gap-3 rounded-2xl bg-muted/40 p-3"
          >
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
              <Link
                href={`/productos/${item.productId}`}
                className="truncate font-semibold text-foreground hover:text-primary"
              >
                {item.name}
              </Link>
              <p className="text-xs text-muted-foreground">
                {item.size} · {item.liters} L · {formatBs(item.unitPrice)} c/u
              </p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <Badge variant="secondary">x{item.quantity}</Badge>
              <span className="text-sm font-semibold text-primary">
                {formatBs(item.unitPrice * item.quantity)}
              </span>
            </div>
          </div>
        ))}
      </div>

      <Separator />

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {itemCount} {itemCount === 1 ? "unidad" : "unidades"}
        </p>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Total pagado</p>
          <p className="font-heading text-2xl font-bold text-primary">
            {formatBs(order.price)}
          </p>
        </div>
      </div>
    </DialogContent>
  );
}

export function OrdersHistory({ orders }: { orders: Order[] }) {
  const [selected, setSelected] = useState<Order | null>(null);

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-10 text-center">
        <p className="text-muted-foreground">
          Todavía no hiciste ningún pedido.
        </p>
        <Button render={<Link href="/productos" />}>Ver yogures</Button>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {orders.map((order) => (
          <Card
            key={order.id}
            size="sm"
            className="cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-dollop hover:ring-primary/30"
          >
            <CardContent
              className="flex items-center gap-4"
              onClick={() => setSelected(order)}
            >
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-heading text-base font-bold text-foreground">
                    Pedido #{order.id.slice(0, 8)}
                  </p>
                  <OrderStatusBadge status={order.orderStatus} />
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <CalendarDays className="size-4 text-primary" />
                    {formatDateTime(order.orderDate)}
                  </span>
                  {order.deliveryDate && (
                    <span className="flex items-center gap-1">
                      <Droplets className="size-4 text-primary" />
                      Entrega: {formatDate(order.deliveryDate)}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <span className="font-heading text-lg font-bold text-primary">
                  {formatBs(order.price)}
                </span>
                <ChevronRight className="size-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog
        open={selected !== null}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      >
        {selected && <OrderDetailDialog order={selected} />}
      </Dialog>
    </>
  );
}