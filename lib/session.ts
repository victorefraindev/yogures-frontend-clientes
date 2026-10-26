import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE } from "@/lib/session-constants";
import { DEMO_USER_ID } from "@/lib/mock-store";

/**
 * Auth de la rama `demo`.
 *
 * La cookie `jwt` es una marca de sesión local (no un JWT real). Alcanza para
 * proteger las páginas del storefront; no se valida contra ningún backend.
 */

export async function isAuthenticated(): Promise<boolean> {
  const store = await cookies();
  return store.has(SESSION_COOKIE);
}

/**
 * Requiere sesión; si no hay cookie, redirige a /login conservando la ruta
 * original en `?next=` para volver a ella tras iniciar sesión.
 */
export async function requireAuth(next?: string): Promise<void> {
  const store = await cookies();
  const authed = store.has(SESSION_COOKIE);
  if (!authed) {
    return redirect(next ? `/login?next=${encodeURIComponent(next)}` : "/login");
  }
}

/** Id fijo del usuario de demostración. */
export async function getCurrentUserId(): Promise<string> {
  const store = await cookies();
  return store.has(SESSION_COOKIE) ? DEMO_USER_ID : "";
}
