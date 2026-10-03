import Image from "next/image";
import type { Order } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Drip } from "@/components/decor";

function getMostPurchased(orders: Order[], limit = 3) {
  const counts = new Map<string, { name: string; imageSrc: string; total: number }>();

  for (const order of orders) {
    for (const item of order.items) {
      const current = counts.get(item.productId) ?? {
        name: item.name,
        imageSrc: item.imageSrc,
        total: 0,
      };
      current.total += item.quantity;
      counts.set(item.productId, current);
    }
  }

  return [...counts.values()]
    .sort((a, b) => b.total - a.total)
    .slice(0, limit);
}

export function MostPurchased({ orders }: { orders: Order[] }) {
  const top = getMostPurchased(orders);

  if (top.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Todavía no hay compras para mostrar.
      </p>
    );
  }

  return (
    <ol className="space-y-4">
      {top.map((product, index) => {
        const rank = index + 1;
        const isFirst = rank === 1;
        return (
          <li key={product.name} className="flex items-center gap-3">
            <span
              className={cn(
                "flex size-10 shrink-0 items-center justify-center rounded-full font-heading text-lg font-bold",
                isFirst
                  ? "bg-chart-4/15 text-chart-4"
                  : "bg-primary/10 text-primary",
              )}
              aria-hidden="true"
            >
              {rank}
            </span>
            <div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-accent via-cielo to-secondary">
              <Image
                src={product.imageSrc}
                alt={product.name}
                fill
                sizes="56px"
                className="object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-foreground">
                {product.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {product.total} {product.total === 1 ? "unidad" : "unidades"} compradas
              </p>
            </div>
            {isFirst && (
              <Drip
                className="size-5 shrink-0 text-chart-4"
                aria-hidden="true"
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}