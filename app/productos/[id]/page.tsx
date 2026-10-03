import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowRightLeft, Droplets } from "lucide-react";
import { getProduct, getProducts, groupByFlavor } from "@/lib/api";
import { formatBs } from "@/components/decor";
import { SizeSelector } from "@/components/SizeSelector";
import { ProductCard } from "@/components/ProductCard";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export const revalidate = 60;

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({ id: product.id }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) return { title: "Yogur no encontrado" };
  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
    },
  };
}

async function RelatedProducts({ category, currentId }: { category: string; currentId: string }) {
  const products = await getProducts({ category });
  return groupByFlavor(products)
    .filter((pair) =>
      !Object.values(pair.sizes).some((product) => product?.id === currentId),
    )
    .slice(0, 3)
    .map((pair) => <ProductCard key={pair.name} pair={pair} />);
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) notFound();

  // Par del mismo sabor para el switcher de tamaño.
  const pair = groupByFlavor(await getProducts()).find((p) =>
    Object.values(p.sizes).some((item) => item?.id === product.id),
  );
  const otherSize =
    product.size === "pequeño" ? pair?.sizes.grande : pair?.sizes.pequeño;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/" />}>Inicio</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/productos" />}>
              Yogures
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{product.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Imagen */}
        <div className="relative">
          <div className="relative aspect-square overflow-hidden rounded-3xl bg-gradient-to-br from-accent via-cielo to-secondary ring-1 ring-border">
            <Image
              src={product.image}
              alt={`Yogur ${product.name}`}
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
              fill
            />
          </div>
        </div>

        {/* Detalle */}
        <div className="flex flex-col gap-6">
          <div>
            <Badge variant="secondary" className="mb-3">
              {product.category}
            </Badge>
            <h1 className="font-heading text-4xl font-bold text-foreground">
              {product.name}
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              {product.description}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="rounded-2xl bg-card px-5 py-3 ring-1 ring-border">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Por envase · {product.size}
              </p>
              <p className="font-heading text-2xl font-bold text-primary">
                {formatBs(product.price)}
              </p>
            </div>
            <Badge variant="outline" className="gap-1 py-2">
              <Droplets className="size-3.5 text-primary" />
              {product.liters} L por envase
            </Badge>
            {otherSize && (
              <Link
                href={`/productos/${otherSize.id}`}
                className="inline-flex items-center gap-1.5 rounded-full bg-secondary/60 px-4 py-2 text-sm font-semibold text-secondary-foreground transition-colors hover:bg-secondary"
              >
                <ArrowRightLeft className="size-4 text-primary" />
                También en {otherSize.size} · {formatBs(otherSize.price)}
              </Link>
            )}
          </div>

          <Separator />

          <SizeSelector product={product} />
        </div>
      </div>

      {/* Relacionados */}
      <section className="mt-20">
        <h2 className="mb-6 font-heading text-2xl font-bold text-foreground">
          Te pueden gustar también
        </h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <RelatedProducts category={product.category} currentId={product.id} />
        </div>
      </section>
    </div>
  );
}