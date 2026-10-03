"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import type { ProductPair, ProductSize } from "@/lib/types";
import { useCart } from "@/lib/cart";
import { cn } from "@/lib/utils";
import { formatBs } from "@/components/decor";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";

const SIZES: { value: ProductSize; label: string }[] = [
  { value: "pequeño", label: "Pequeño" },
  { value: "grande", label: "Grande" },
];

export function QuickAdd({ pair }: { pair: ProductPair }) {
  const { addItem } = useCart();
  const [size, setSize] = useState<ProductSize>(
    pair.sizes.pequeño ? "pequeño" : "grande",
  );

  const selectedProduct = useMemo(
    () => pair.sizes[size] ?? pair.sizes.pequeño ?? pair.sizes.grande,
    [pair, size],
  );

  if (!selectedProduct) return null;

  function handleAdd() {
    const product = selectedProduct;
    if (!product) return;
    addItem(product, product.size);
    toast.add({
      type: "success",
      title: "Agregado al carrito",
      description: `${product.name} (${product.size})`,
    });
  }

  return (
    <div className="flex flex-col gap-2">
      <div
        role="group"
        aria-label="Tamaño"
        className="grid grid-cols-2 gap-1 rounded-full bg-secondary/70 p-1"
      >
        {SIZES.map(({ value, label }) => {
          const item = pair.sizes[value];
          const active = selectedProduct.size === value;
          return (
            <button
              key={value}
              type="button"
              aria-pressed={active}
              disabled={!item}
              onClick={() => setSize(value)}
              className={cn(
                "rounded-full py-1.5 text-sm font-semibold transition-colors",
                !item && "cursor-not-allowed opacity-40",
                active
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-secondary-foreground hover:bg-secondary",
              )}
            >
              {label}
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between px-1 text-xs text-muted-foreground">
        <span className="text-sm font-bold text-foreground">
          {formatBs(selectedProduct.price)}
        </span>
        <span>
          {selectedProduct.size} · {selectedProduct.liters} L por envase
        </span>
      </div>

      <Button size="sm" className="w-full" onClick={handleAdd}>
        <Plus data-icon="inline-start" />
        Agregar al carrito
      </Button>
    </div>
  );
}