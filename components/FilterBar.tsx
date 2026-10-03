"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useTransition, useState } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";

export function FilterBar({ categories }: { categories: string[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState(searchParams.get("name") ?? "");
  const [category, setCategory] = useState(searchParams.get("category") ?? "");
  const [minPrice, setMinPrice] = useState(searchParams.get("min_price") ?? "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("max_price") ?? "");

  const chips = useMemo(
    () => [
      { label: "Todos", value: "all" },
      ...categories.map((c) => ({ label: c, value: c })),
    ],
    [categories],
  );

  const activeChip = category === "" ? "all" : category;

  const hasFilters = useMemo(
    () => Boolean(name || category || minPrice || maxPrice),
    [name, category, minPrice, maxPrice],
  );

  /** Navega con la categoría + los demás filtros que ya tipeó el usuario. */
  const selectCategory = useCallback(
    (value: string) => {
      setCategory(value === "all" ? "" : value);
      const params = new URLSearchParams();
      if (name) params.set("name", name);
      if (value !== "all") params.set("category", value);
      if (minPrice) params.set("min_price", minPrice);
      if (maxPrice) params.set("max_price", maxPrice);
      const qs = params.toString();
      startTransition(() => {
        router.push(qs ? `/productos?${qs}` : "/productos");
      });
    },
    [name, minPrice, maxPrice, router],
  );

  const applyFilters = useCallback(
    (e?: React.FormEvent) => {
      e?.preventDefault();
      const params = new URLSearchParams();
      if (name) params.set("name", name);
      if (category) params.set("category", category);
      if (minPrice) params.set("min_price", minPrice);
      if (maxPrice) params.set("max_price", maxPrice);
      const qs = params.toString();
      startTransition(() => {
        router.push(qs ? `/productos?${qs}` : "/productos");
      });
    },
    [name, category, minPrice, maxPrice, router],
  );

  function clearFilters() {
    setName("");
    setCategory("");
    setMinPrice("");
    setMaxPrice("");
    startTransition(() => router.push("/productos"));
  }

  return (
    <form
      onSubmit={applyFilters}
      className="rounded-2xl bg-card p-4 shadow-sm ring-1 ring-border"
    >
      {/* Chips de sabores */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold uppercase tracking-wider text-secondary-foreground">
          Sabores
        </span>
        <div className="flex flex-wrap gap-2">
          {chips.map((chip) => (
            <button
              key={chip.value}
              type="button"
              aria-pressed={activeChip === chip.value}
              onClick={() => selectCategory(chip.value)}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors",
                activeChip === chip.value
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-secondary/60 text-secondary-foreground hover:bg-secondary",
              )}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      <FieldGroup className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <Field className="lg:col-span-2">
          <FieldLabel htmlFor="buscar">Buscar</FieldLabel>
          <Input
            id="buscar"
            type="search"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej: fresa"
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="precio-min">Precio mín.</FieldLabel>
          <Input
            id="precio-min"
            type="number"
            min="0"
            step="0.01"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="0,00"
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="precio-max">Precio máx.</FieldLabel>
          <Input
            id="precio-max"
            type="number"
            min="0"
            step="0.01"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="10,00"
          />
        </Field>

        <div className="flex items-end lg:col-span-1">
          <Button type="submit" className="w-full">
            <Search data-icon="inline-start" />
            Aplicar
          </Button>
        </div>
      </FieldGroup>

      {hasFilters && (
        <div className="mt-3 flex items-center justify-between gap-2">
          <p className="text-sm text-muted-foreground">
            {isPending ? "Filtrando…" : "Categoría, nombre o precio aplicados"}
          </p>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={clearFilters}
          >
            Limpiar filtros
          </Button>
        </div>
      )}
    </form>
  );
}