"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import type { Product } from "@/lib/types";
import { useCart } from "@/lib/cart";
import { formatBs } from "@/components/decor";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { toast } from "@/components/ui/toast";

interface SizeSelectorProps {
  product: Product;
}

export function SizeSelector({ product }: SizeSelectorProps) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem(product, product.size, quantity);
    setAdded(true);
    setQuantity(1);
    setTimeout(() => setAdded(false), 2200);

    toast.add({
      type: "success",
      title: "Agregado al carrito",
      description: `${product.name} (${product.size}) × ${quantity}`,
    });
  }

  return (
    <FieldGroup>
      <div className="flex flex-wrap items-center gap-2 rounded-2xl bg-secondary/60 px-4 py-3">
        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary">
          {product.size}
        </span>
        <span className="text-sm text-muted-foreground">
          Envase de {product.liters} L · {formatBs(product.price)} c/u
        </span>
      </div>

      <Field>
        <FieldLabel htmlFor="cantidad">Cantidad</FieldLabel>
        <InputGroup className="w-fit">
          <InputGroupButton
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            aria-label="Disminuir cantidad"
          >
            <Minus />
          </InputGroupButton>
          <InputGroupInput
            id="cantidad"
            inputMode="numeric"
            value={quantity}
            onChange={(e) => {
              const n = Number(e.target.value);
              setQuantity(Number.isFinite(n) && n > 0 ? Math.floor(n) : 1);
            }}
            className="w-12 text-center"
          />
          <InputGroupButton
            onClick={() => setQuantity((q) => q + 1)}
            aria-label="Aumentar cantidad"
          >
            <Plus />
          </InputGroupButton>
        </InputGroup>
      </Field>

      <Button size="lg" onClick={handleAdd} className="w-full">
        {added
          ? "¡Listo, se agregó! ✓"
          : `Agregar · ${formatBs(product.price * quantity)}`}
      </Button>
      <p className="text-xs text-muted-foreground">
        Total estimado para {quantity} {quantity === 1 ? "unidad" : "unidades"}{" "}
        de {product.size} por {formatBs(product.price)}.
      </p>
    </FieldGroup>
  );
}