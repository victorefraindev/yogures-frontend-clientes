import type { Metadata } from "next";
import { Heart, ReceiptText, User } from "lucide-react";
import { getCurrentUserId, requireAuth } from "@/lib/session";
import { getOrders, getProfile } from "@/lib/api";
import { ProfileForm } from "@/components/ProfileForm";
import { LogoutButton } from "@/components/LogoutButton";
import { MostPurchased } from "@/components/MostPurchased";
import { OrdersHistory } from "@/components/OrdersHistory";
import { Drip } from "@/components/decor";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Mi perfil",
  description: "Tus datos, yogures favoritos y pedidos anteriores.",
};

// SSR: página protegida, se renderiza por request.
export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  await requireAuth("/perfil");
  const userId = await getCurrentUserId();

  const [profile, orders] = await Promise.all([
    getProfile(userId),
    getOrders(),
  ]);

  const fullName = `${profile.name} ${profile.lastname}`;
  const initials = fullName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      {/* Banner del perfil */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-crema via-lavanda to-secondary/70 px-6 py-10 ring-1 ring-border sm:px-10">
        <Drip className="pointer-events-none absolute -right-10 -top-8 size-44 text-primary/10" />
        <div className="relative flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
          <div className="relative shrink-0">
            <span className="flex size-24 items-center justify-center rounded-full bg-gradient-to-br from-morado to-uva font-heading text-4xl font-bold text-white shadow-dollop ring-4 ring-white/60">
              {initials}
            </span>
            <Drip className="absolute -bottom-5 left-1/2 size-7 -translate-x-1/2 text-primary" />
          </div>

          <div className="min-w-0 flex-1">
            <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
              {fullName}
            </h1>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <Badge variant="outline" className="gap-1 py-1.5">
                {profile.email}
              </Badge>
              {profile.phone && (
                <Badge variant="outline" className="gap-1 py-1.5">
                  {profile.phone}
                </Badge>
              )}
            </div>
          </div>

          <LogoutButton />
        </div>
      </section>

      {/* Sección 1: Datos del usuario */}
      <section className="mt-12">
        <div className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
            <User className="size-5" />
          </span>
          <div>
            <h2 className="font-heading text-2xl font-bold text-foreground">
              Editar información
            </h2>
            <p className="text-sm text-muted-foreground">
              Actualizá tu nombre, correo y teléfono.
            </p>
          </div>
        </div>

        <Card className="mt-6 max-w-2xl">
          <CardContent className="py-6">
            <ProfileForm userId={userId} profile={profile} />
          </CardContent>
        </Card>
      </section>

      {/* Sección 2: Mis pedidos y yogures */}
      <section className="mt-14">
        <div className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
            <ReceiptText className="size-5" />
          </span>
          <div>
            <h2 className="font-heading text-2xl font-bold text-foreground">
              Mis pedidos y yogures
            </h2>
            <p className="text-sm text-muted-foreground">
              Tus sabores favoritos y el historial completo.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[320px_1fr]">
          <div className="space-y-6">
            {/* Más comprados */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Heart className="size-4 text-primary" />
                  Yogures más comprados
                </CardTitle>
                <CardDescription>
                  Tus sabores favoritos según tus pedidos.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MostPurchased orders={orders} />
              </CardContent>
            </Card>
          </div>

          {/* Historial */}
          <div className="h-fit">
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="text-base">
                  Historial de pedidos
                </CardTitle>
                <CardDescription>
                  Hacé clic en un pedido para ver el detalle de los yogures.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <OrdersHistory orders={orders} />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}