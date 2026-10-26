"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, LogIn } from "lucide-react";
import { loginDemo } from "@/lib/mock-store";
import { setSessionCookie } from "@/lib/session-cookie";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "@/components/ui/toast";

type Errors = Partial<Record<"email" | "password", string>>;

export function LoginForm({ next }: { next?: string }) {
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});
    setFormError(null);

    const form = new FormData(e.currentTarget);
    const payload = {
      email: String(form.get("email") ?? ""),
      password: String(form.get("password") ?? ""),
    };

    const validationErrors: Errors = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email))
      validationErrors.email = "Ingresá un correo válido";
    if (!payload.password) validationErrors.password = "Ingresá tu contraseña";
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    setIsPending(true);
    loginDemo(payload.email);
    setSessionCookie("demo-session");

    toast.add({
      type: "success",
      title: "¡Hola de nuevo!",
      description: "Sesión iniciada en el modo demo.",
    });

    // Recarga completa para que el layout del servidor lea la cookie nueva.
    window.location.assign(next ?? "/perfil");
  }

  return (
    <Card className="mx-auto max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LogIn className="size-5 text-primary" />
          Ingresá a tu cuenta
        </CardTitle>
        <CardDescription>
          Demo: cualquier correo y contraseña funcionan. Tus pedidos se guardan
          solo en este navegador.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form method="post" onSubmit={handleSubmit} noValidate>
          <FieldGroup>
            <Field data-invalid={!!errors.email}>
              <FieldLabel htmlFor="email">Correo electrónico</FieldLabel>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                aria-invalid={!!errors.email}
                defaultValue="demo@yogures.com"
                placeholder="demo@yogures.com"
              />
              {errors.email && <FieldError>{errors.email}</FieldError>}
            </Field>

            <Field data-invalid={!!errors.password}>
              <FieldLabel htmlFor="password">Contraseña</FieldLabel>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                aria-invalid={!!errors.password}
                defaultValue="demo1234"
                placeholder="••••••••"
              />
              {errors.password && <FieldError>{errors.password}</FieldError>}
            </Field>

            {formError && (
              <Alert variant="destructive">
                <AlertTitle>No pudimos iniciar sesión</AlertTitle>
                <AlertDescription>{formError}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" size="lg" className="w-full" disabled={isPending}>
              {isPending ? (
                <Loader2 className="animate-spin" data-icon="inline-start" />
              ) : (
                <LogIn data-icon="inline-start" />
              )}
              {isPending ? "Ingresando…" : "Ingresar"}
            </Button>
          </FieldGroup>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          ¿No tenés cuenta?{" "}
          <Link
            href={next ? `/registro?next=${encodeURIComponent(next)}` : "/registro"}
            className="font-semibold text-primary hover:underline"
          >
            Registrate gratis
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
