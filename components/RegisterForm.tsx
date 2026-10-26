"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, UserPlus } from "lucide-react";
import { registerDemo } from "@/lib/mock-store";
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

type Errors = Partial<Record<"name" | "lastname" | "email" | "phone-number" | "password", string>>;

export function RegisterForm({ next }: { next?: string }) {
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});
    setFormError(null);

    const form = new FormData(e.currentTarget);
    const payload = {
      name: String(form.get("name") ?? ""),
      lastname: String(form.get("lastname") ?? ""),
      email: String(form.get("email") ?? ""),
      "phone-number": String(form.get("phone-number") ?? ""),
      password: String(form.get("password") ?? ""),
    };

    const validationErrors: Errors = {};
    if (!payload.name.trim()) validationErrors.name = "Ingresá tu nombre";
    if (!payload.lastname.trim()) validationErrors.lastname = "Ingresá tu apellido";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email))
      validationErrors.email = "Ingresá un correo válido";
    if (payload.password.length < 6)
      validationErrors.password = "La contraseña debe tener al menos 6 caracteres";
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    setIsPending(true);
    registerDemo({
      name: payload.name,
      lastname: payload.lastname,
      email: payload.email,
      phone: payload["phone-number"],
    });
    setSessionCookie("demo-session");

    toast.add({
      type: "success",
      title: "Cuenta creada",
      description: "Bienvenido a Yogures Cremosos (demo).",
    });

    // Recarga completa para que el layout del servidor lea la cookie nueva.
    window.location.assign(next ?? "/perfil");
  }

  return (
    <Card className="mx-auto max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="size-5 text-primary" />
          Creá tu cuenta
        </CardTitle>
        <CardDescription>
          Demo: los datos quedan guardados solo en este navegador. No se crea
          ninguna cuenta real.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form method="post" onSubmit={handleSubmit} noValidate>
          <FieldGroup>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field data-invalid={!!errors.name}>
                <FieldLabel htmlFor="name">Nombre</FieldLabel>
                <Input
                  id="name"
                  name="name"
                  autoComplete="given-name"
                  aria-invalid={!!errors.name}
                  placeholder="Victoria"
                />
                {errors.name && <FieldError>{errors.name}</FieldError>}
              </Field>

              <Field data-invalid={!!errors.lastname}>
                <FieldLabel htmlFor="lastname">Apellido</FieldLabel>
                <Input
                  id="lastname"
                  name="lastname"
                  autoComplete="family-name"
                  aria-invalid={!!errors.lastname}
                  placeholder="Pérez"
                />
                {errors.lastname && <FieldError>{errors.lastname}</FieldError>}
              </Field>
            </div>

            <Field data-invalid={!!errors.email}>
              <FieldLabel htmlFor="email">Correo electrónico</FieldLabel>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                aria-invalid={!!errors.email}
                placeholder="demo@yogures.com"
              />
              {errors.email && <FieldError>{errors.email}</FieldError>}
            </Field>

            <Field data-invalid={!!errors["phone-number"]}>
              <FieldLabel htmlFor="phone-number">Teléfono</FieldLabel>
              <Input
                id="phone-number"
                name="phone-number"
                type="tel"
                autoComplete="tel"
                aria-invalid={!!errors["phone-number"]}
                placeholder="+58 412-1234567"
              />
              {errors["phone-number"] && (
                <FieldError>{errors["phone-number"]}</FieldError>
              )}
            </Field>

            <Field data-invalid={!!errors.password}>
              <FieldLabel htmlFor="password">Contraseña</FieldLabel>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                aria-invalid={!!errors.password}
                placeholder="Mínimo 6 caracteres"
              />
              {errors.password && <FieldError>{errors.password}</FieldError>}
            </Field>

            {formError && (
              <Alert variant="destructive">
                <AlertTitle>No pudimos crear la cuenta</AlertTitle>
                <AlertDescription>{formError}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" size="lg" className="w-full" disabled={isPending}>
              {isPending ? (
                <Loader2 className="animate-spin" data-icon="inline-start" />
              ) : (
                <UserPlus data-icon="inline-start" />
              )}
              {isPending ? "Registrando…" : "Registrarme"}
            </Button>
          </FieldGroup>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          ¿Ya tenés cuenta?{" "}
          <Link
            href={next ? `/login?next=${encodeURIComponent(next)}` : "/login"}
            className="font-semibold text-primary hover:underline"
          >
            Ingresá
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
