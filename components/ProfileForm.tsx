"use client";

import { useState } from "react";
import { Loader2, Save } from "lucide-react";
import type { ClientProfile } from "@/lib/types";
import { updateProfile } from "@/lib/client-api";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "@/components/ui/toast";

interface ProfileFormProps {
  userId: string;
  profile: ClientProfile;
  onSaved?: (profile: ClientProfile) => void;
}

export function ProfileForm({ userId, profile, onSaved }: ProfileFormProps) {
  const [values, setValues] = useState<ClientProfile>(profile);
  const [errors, setErrors] = useState<Partial<Record<keyof ClientProfile, string>>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  function setField(field: keyof ClientProfile, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});
    setFormError(null);

    const next: Partial<Record<keyof ClientProfile, string>> = {};
    if (!values.name.trim()) next.name = "Ingresá tu nombre";
    if (!values.lastname.trim()) next.lastname = "Ingresá tu apellido";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
      next.email = "Ingresá un correo válido";
    if (!values.phone.trim()) next.phone = "Ingresá tu teléfono";
    if (Object.keys(next).length) {
      setErrors(next);
      return;
    }

    setIsPending(true);
    const result = await updateProfile(userId, values);
    setIsPending(false);

    if (!result.ok) {
      setFormError(
        result.error ?? "No se pudo actualizar el perfil. Intenta más tarde.",
      );
      return;
    }

    onSaved?.(values);
    toast.add({
      type: "success",
      title: "Perfil actualizado",
      description: "Tus datos se guardaron correctamente.",
    });
  }

  return (
    <form method="post" onSubmit={handleSubmit} noValidate>
      <FieldGroup>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field data-invalid={!!errors.name}>
            <FieldLabel htmlFor="name">Nombre</FieldLabel>
            <Input
              id="name"
              value={values.name}
              onChange={(e) => setField("name", e.target.value)}
              aria-invalid={!!errors.name}
            />
            {errors.name && <FieldError>{errors.name}</FieldError>}
          </Field>

          <Field data-invalid={!!errors.lastname}>
            <FieldLabel htmlFor="lastname">Apellido</FieldLabel>
            <Input
              id="lastname"
              value={values.lastname}
              onChange={(e) => setField("lastname", e.target.value)}
              aria-invalid={!!errors.lastname}
            />
            {errors.lastname && <FieldError>{errors.lastname}</FieldError>}
          </Field>
        </div>

        <Field data-invalid={!!errors.email}>
          <FieldLabel htmlFor="email">Correo electrónico</FieldLabel>
          <Input
            id="email"
            type="email"
            value={values.email}
            onChange={(e) => setField("email", e.target.value)}
            aria-invalid={!!errors.email}
          />
          {errors.email && <FieldError>{errors.email}</FieldError>}
        </Field>

        <Field data-invalid={!!errors.phone}>
          <FieldLabel htmlFor="phone">Teléfono</FieldLabel>
          <Input
            id="phone"
            type="tel"
            value={values.phone}
            onChange={(e) => setField("phone", e.target.value)}
            aria-invalid={!!errors.phone}
          />
          {errors.phone && <FieldError>{errors.phone}</FieldError>}
        </Field>

        {formError && (
          <Alert variant="destructive">
            <AlertTitle>No pudimos guardar los cambios</AlertTitle>
            <AlertDescription>{formError}</AlertDescription>
          </Alert>
        )}

        <Button type="submit" size="lg" className="w-fit" disabled={isPending}>
          {isPending ? (
            <Loader2 className="animate-spin" data-icon="inline-start" />
          ) : (
            <Save data-icon="inline-start" />
          )}
          {isPending ? "Guardando…" : "Guardar cambios"}
        </Button>
      </FieldGroup>
    </form>
  );
}