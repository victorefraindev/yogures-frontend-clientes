"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { setSessionCookie } from "@/lib/session-cookie";

/**
 * Auto-login: si ya existe una sesión de Supabase (localStorage) pero falta la
 * cookie `jwt` (por ejemplo al volver a la página tras la expiración), restaura
 * la cookie y redirige al perfil sin pasar por el formulario.
 */
export function AutoLogin({ next }: { next?: string }) {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    let cancelled = false;

    supabase.auth.getSession().then(({ data }) => {
      if (cancelled) return;
      if (!data.session) return;

      setSessionCookie(data.session.access_token);
      router.replace(next ?? "/perfil");
    });

    return () => {
      cancelled = true;
    };
  }, [router, next]);

  return null;
}