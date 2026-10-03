import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Check, Clock, Leaf, Sparkles, Truck } from "lucide-react";
import { Drip, WaveDivider, formatBs } from "@/components/decor";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getProducts, groupByFlavor } from "@/lib/api";

const usps = [
  { icon: Leaf, label: "Fruta natural" },
  { icon: Clock, label: "Hecho a diario" },
  { icon: Truck, label: "Entrega programada" },
  { icon: Sparkles, label: "Sin conservantes" },
];

const steps = [
  {
    icon: Sparkles,
    title: "Elige tus favoritos",
    text: "Explora nuestro catálogo de yogures artesanales con frutas naturales.",
  },
  {
    icon: Clock,
    title: "Haz tu pedido",
    text: "Arma tu carrito, selecciona el tamaño y confirma en pocos pasos.",
  },
  {
    icon: Truck,
    title: "Recíbelo fresco",
    text: "Programa tu entrega y paga de forma segura con pago móvil.",
  },
];

export default async function LandingPage() {
  const products = await getProducts();
  const featured = groupByFlavor(products).slice(0, 3);
  const heroProduct =
    featured[0]?.sizes.pequeño ?? featured[0]?.sizes.grande;
  const heroImage = heroProduct?.image ?? "/yogurt-fresa.webp";
  const minPrice =
    products.length > 0 ? Math.min(...products.map((p) => p.price)) : 0;

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-crema via-cielo/60 to-background">
        <div className="pointer-events-none absolute -right-24 -top-24 text-primary/10">
          <Drip className="drip-float size-96" />
        </div>
        <div className="pointer-events-none absolute -bottom-32 -left-20 text-secondary-foreground/10">
          <Drip className="size-80 rotate-12" />
        </div>
        <div className="pointer-events-none absolute -top-10 right-1/3 text-azul/10">
          <Drip className="drip-float size-52 [animation-delay:2s]" />
        </div>

        <div className="mx-auto grid max-w-6xl items-center gap-14 px-4 pb-24 pt-16 sm:px-6 lg:grid-cols-2 lg:pt-24">
          <div className="relative z-10">
            <Badge variant="secondary" className="mb-5 px-3 py-1">
              <Leaf data-icon="inline-start" />
              100% artesanales
            </Badge>
            <h1 className="font-heading text-4xl font-bold leading-tight text-foreground sm:text-5xl lg:text-6xl">
              Yogures <span className="text-primary">cremosos</span> que saben a
              fruta de verdad
            </h1>
            <p className="mt-5 max-w-md text-lg text-muted-foreground">
              Preparados a diario con frutas naturales, sin conservantes y con
              la cremosidad justa para cada momento.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button
                size="lg"
                className="h-14 gap-2 px-8 text-lg font-bold shadow-dollop transition-transform hover:scale-[1.03]"
                render={<Link href="/productos" />}
              >
                Ver yogures
                <ArrowRight data-icon="inline-end" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-6 text-base font-semibold"
                render={<Link href="/#como-pedir" />}
              >
                Cómo pedir
              </Button>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-muted-foreground">
              {usps.map((usp) => (
                <li key={usp.label} className="flex items-center gap-1.5">
                  <Check className="size-4 text-primary" />
                  {usp.label}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative z-10 mx-auto w-full max-w-md">
            <div className="relative">
              <div className="absolute -inset-4 rounded-[3rem] bg-gradient-to-br from-primary/15 via-azul/15 to-secondary blur-2xl" />
              <div className="relative -rotate-2 rounded-[2.5rem] bg-background/70 p-4 shadow-dollop ring-1 ring-border backdrop-blur transition-transform duration-500 hover:rotate-0">
                <div className="relative aspect-square overflow-hidden rounded-[2rem] bg-gradient-to-br from-accent via-cielo to-secondary">
                  <Image
                    src={heroImage}
                    alt="Yogur de fresa"
                    priority
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>

                {products.length > 0 && (
                  <div className="absolute -left-6 top-10 rounded-2xl bg-card px-4 py-3 shadow-dollop ring-1 ring-border drip-float">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Desde
                    </p>
                    <p className="font-heading text-xl font-bold text-primary">
                      {formatBs(minPrice)}
                    </p>
                  </div>
                )}

                <div className="absolute -right-5 bottom-24 rounded-2xl bg-gradient-to-br from-morado to-azul-intenso px-4 py-3 text-white shadow-dollop">
                  <p className="text-xs font-semibold uppercase tracking-wide text-primary-foreground/80">
                    Envases
                  </p>
                  <p className="font-heading text-xl font-bold">0.5 y 1 L</p>
                </div>

                <div className="absolute -bottom-5 left-8 flex items-center gap-2 rounded-full bg-card px-4 py-2 shadow-dollop ring-1 ring-border">
                  <Drip className="size-5 text-primary" />
                  <span className="text-sm font-bold text-foreground">
                    Cremoso artesanal
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-primary/15">
          <WaveDivider className="h-12 w-full" />
        </div>
      </section>

      {/* Destacados */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-heading text-sm font-bold uppercase tracking-widest text-primary">
              Sabores de la casa
            </p>
            <h2 className="mt-2 font-heading text-3xl font-bold text-foreground sm:text-4xl">
              Los favoritos de la casa
            </h2>
            <p className="mt-2 text-muted-foreground">
              Los sabores que más se repiten en nuestras neveras.
            </p>
          </div>
          <Link
            href="/productos"
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
          >
            Ver todo
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((pair) => (
            <ProductCard key={pair.name} pair={pair} />
          ))}
        </div>
      </section>

      {/* Cómo pedir */}
      <section id="como-pedir" className="bg-crema">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="font-heading text-sm font-bold uppercase tracking-widest text-primary">
              Así de fácil
            </p>
            <h2 className="mt-2 font-heading text-3xl font-bold text-foreground sm:text-4xl">
              Pedir es más fácil que un tazón de yogur
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className="group relative rounded-3xl bg-card p-8 text-center shadow-sm ring-1 ring-border transition-all duration-300 hover:-translate-y-1 hover:shadow-dollop hover:ring-primary/30"
              >
                <div className="relative mx-auto flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-morado via-uva to-azul-intenso text-white shadow-dollop">
                  <step.icon className="size-7" />
                  <span className="absolute -right-2 -top-2 flex size-6 items-center justify-center rounded-full bg-primary font-heading text-sm font-bold text-primary-foreground ring-2 ring-card">
                    {index + 1}
                  </span>
                </div>
                <h3 className="mt-6 font-heading text-xl font-bold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-morado via-uva-oscura to-azul-oscura px-6 py-16 text-center shadow-dollop sm:px-12">
          <div className="pointer-events-none absolute -right-16 -top-16 text-white/10">
            <Drip className="drip-float size-56" />
          </div>
          <div className="pointer-events-none absolute -bottom-20 -left-12 text-white/5">
            <Drip className="size-64 rotate-12" />
          </div>
          <div className="relative">
            <h2 className="font-heading text-3xl font-bold text-white sm:text-4xl">
              ¿Listo para un yogur bien cremoso?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-lg text-white/85">
              Elegí tu sabor, prepará tu pedido y recibilo fresquito en tu casa.
            </p>
            <Button
              size="lg"
              variant="secondary"
              className="mt-8 h-14 gap-2 px-8 text-lg font-bold shadow-dollop transition-transform hover:scale-[1.03]"
              render={<Link href="/productos" />}
            >
              Explorar yogures
              <ArrowRight data-icon="inline-end" />
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}