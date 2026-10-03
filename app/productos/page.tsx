import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { PackageSearch, X } from "lucide-react";
import { getCategories, getProducts, groupByFlavor } from "@/lib/api";
import { Drip, WaveDivider, formatBs } from "@/components/decor";
import { FilterBar } from "@/components/FilterBar";
import { ProductCard } from "@/components/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Empty, EmptyContent, EmptyDescription, EmptyMedia, EmptyTitle } from "@/components/ui/empty";

export const metadata: Metadata = {
  title: "Nuestros yogures",
  description:
    "Explora todos nuestros yogures artesanales: frutales, naturales y especiales.",
};

// ISR: se revalida cada 60 segundos.
export const revalidate = 60;

interface CatalogPageProps {
  searchParams: Promise<{
    name?: string;
    category?: string;
    min_price?: string;
    max_price?: string;
  }>;
}

type CatalogParams = Awaited<CatalogPageProps["searchParams"]>;

function filtersFromParams(params: CatalogParams) {
  return {
    name: params.name,
    category: params.category,
    min_price: params.min_price ? Number(params.min_price) : undefined,
    max_price: params.max_price ? Number(params.max_price) : undefined,
  };
}

function ActiveFilterChips({ params }: { params: CatalogParams }) {
  const qs = (remove: keyof CatalogParams) => {
    const search = new URLSearchParams();
    if (remove !== "name" && params.name) search.set("name", params.name);
    if (remove !== "category" && params.category)
      search.set("category", params.category);
    if (remove !== "min_price" && params.min_price)
      search.set("min_price", params.min_price);
    if (remove !== "max_price" && params.max_price)
      search.set("max_price", params.max_price);
    const value = search.toString();
    return value ? `/productos?${value}` : "/productos";
  };

  const chips: { label: string; href: string }[] = [];
  if (params.name) chips.push({ label: `“${params.name}”`, href: qs("name") });
  if (params.category)
    chips.push({ label: params.category, href: qs("category") });
  if (params.min_price)
    chips.push({
      label: `Desde ${formatBs(Number(params.min_price))}`,
      href: qs("min_price"),
    });
  if (params.max_price)
    chips.push({
      label: `Hasta ${formatBs(Number(params.max_price))}`,
      href: qs("max_price"),
    });

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm font-medium text-muted-foreground">
        Filtros:
      </span>
      {chips.map((chip) => (
        <Link
          key={chip.label}
          href={chip.href}
          className="group inline-flex items-center gap-1.5 rounded-full bg-secondary/70 py-1 pl-3 pr-2 text-sm font-semibold text-secondary-foreground transition-colors hover:bg-secondary"
        >
          {chip.label}
          <X className="size-3.5 transition-transform group-hover:rotate-90" />
        </Link>
      ))}
      <Link
        href="/productos"
        className="text-sm font-semibold text-primary hover:underline"
      >
        Limpiar todo
      </Link>
    </div>
  );
}

async function ProductGrid({ searchParams }: { searchParams: CatalogParams }) {
  const products = await getProducts(filtersFromParams(searchParams));
  const pairs = groupByFlavor(products);

  if (pairs.length === 0) {
    return (
      <Empty>
        <EmptyMedia variant="icon">
          <PackageSearch />
        </EmptyMedia>
        <EmptyContent>
          <EmptyTitle>No encontramos yogures con esos filtros</EmptyTitle>
          <EmptyDescription>
            Probá con otro nombre, categoría o rango de precio. Limpia los
            filtros para ver todo el catálogo.
          </EmptyDescription>
        </EmptyContent>
      </Empty>
    );
  }

  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {pairs.map((pair) => (
        <ProductCard key={pair.name} pair={pair} />
      ))}
    </div>
  );
}

function ProductGridSkeleton() {
  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="aspect-square w-full rounded-2xl" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-6 w-2/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-9 w-full rounded-full" />
          <Skeleton className="h-9 w-full" />
        </div>
      ))}
    </div>
  );
}

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const params = await searchParams;
  const categories = await getCategories();
  const count = groupByFlavor(await getProducts(filtersFromParams(params))).length;

  return (
    <>
      {/* Hero compacto */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -right-20 -top-16 text-primary/10">
          <Drip className="drip-float size-64" />
        </div>
        <div className="mx-auto max-w-6xl px-4 pt-14 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="font-heading text-4xl font-bold text-foreground sm:text-5xl">
                Nuestros yogures
              </h1>
              <p className="mt-3 max-w-xl text-lg text-muted-foreground">
                Elegí tu tamaño y dejate tentar por la cremosidad artesanal de
                cada sabor.
              </p>
            </div>
            <div className="rounded-full bg-card px-4 py-2 text-sm font-semibold text-secondary-foreground shadow-sm ring-1 ring-border">
              {count} {count === 1 ? "yogur" : "yogures"}
            </div>
          </div>
        </div>
        <div className="mt-10 text-primary/15">
          <WaveDivider className="h-10 w-full" />
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <div className="mb-6">
          <FilterBar categories={categories} />
        </div>

        <div className="mb-8">
          <ActiveFilterChips params={params} />
        </div>

        <Suspense fallback={<ProductGridSkeleton />}>
          <ProductGrid searchParams={params} />
        </Suspense>
      </main>
    </>
  );
}