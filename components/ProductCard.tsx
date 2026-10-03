import Link from "next/link";
import Image from "next/image";
import type { ProductPair } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { formatBs } from "@/components/decor";
import { QuickAdd } from "@/components/QuickAdd";

export function ProductCard({ pair }: { pair: ProductPair }) {
  const defaultProduct = pair.sizes.pequeño ?? pair.sizes.grande;
  if (!defaultProduct) return null;

  const prices = [pair.sizes.pequeño?.price, pair.sizes.grande?.price].filter(
    (p): p is number => typeof p === "number",
  );
  const minPrice = Math.min(...prices);
  const sizeCount = prices.length;

  return (
    <Card className="group flex h-full flex-col gap-0 overflow-hidden rounded-2xl p-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-dollop hover:ring-primary/30 [--card-spacing:--spacing(5)]">
      <Link
        href={`/productos/${defaultProduct.id}`}
        className="flex flex-1 flex-col"
        aria-label={`Ver detalle de ${pair.name}`}
      >
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-accent via-cielo to-secondary">
          <Image
            src={pair.image}
            alt={`Yogur ${pair.name}`}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            fill
          />
          <span className="absolute left-3 top-3 rounded-full bg-background/85 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-foreground shadow-sm backdrop-blur">
            {pair.category}
          </span>
        </div>

        <CardContent className="flex flex-1 flex-col gap-1.5 px-(--card-spacing) py-5">
          <h3 className="font-heading text-lg font-bold leading-tight text-foreground group-hover:text-primary">
            {pair.name}
          </h3>
          <p className="text-sm leading-relaxed text-muted-foreground line-clamp-2">
            {pair.description}
          </p>

          <div className="mt-auto flex items-end justify-between gap-2 pt-2">
            <div>
              <p className="text-xs text-muted-foreground">Desde</p>
              <p className="font-heading text-xl font-bold text-primary">
                {formatBs(minPrice)}
              </p>
            </div>
            <span className="text-xs text-muted-foreground">
              {sizeCount} {sizeCount === 1 ? "tamaño" : "tamaños"}
            </span>
          </div>
        </CardContent>
      </Link>

      <div className="border-t border-border px-(--card-spacing) pb-5 pt-4">
        <QuickAdd pair={pair} />
      </div>
    </Card>
  );
}