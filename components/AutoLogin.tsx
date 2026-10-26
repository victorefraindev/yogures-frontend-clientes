"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getDemoSession } from "@/lib/mock-store";
import { SESSION_COOKIE } from "@/lib/session-constants";
import { setSessionCookie } from "@/lib/session-cookie";

/**
 * Auto-login de la demo: si hay una sesión local guardada pero falta la cookie
 * `jwt` (por ejemplo al volver a la página), la restaura y redirige al perfil.
 */
export function AutoLogin({ next }: { next?: string }) {
  const router = useRouter();

  useEffect(() => {
    const hasCookie = document.cookie
      .split(";")
      .some((cookie) => cookie.trim().startsWith(`${SESSION_COOKIE}=`));

    if (!getDemoSession() && !hasCookie) return;

    setSessionCookie("demo-session");
    router.replace(next ?? "/perfil");
  }, [router, next]);

  return null;
}
