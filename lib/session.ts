import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE } from "@/lib/session-constants";

/**
 * Auth (server). La cookie `jwt` la setean los formularios de login/registro
 * (Supabase Auth) y la mantiene fresca el cliente (`onAuthStateChange`).
 */

/** Extrae el claim `sub` (id de usuario) de un JWT sin verificarlo. */
function decodeSub(token: string): string | null {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  try {
    const payload = JSON.parse(
      Buffer.from(parts[1], "base64url").toString("utf8"),
    ) as { sub?: unknown };
    return typeof payload.sub === "string" ? payload.sub : null;
  } catch {
    return null;
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const store = await cookies();
  return store.has(SESSION_COOKIE);
}

/**
 * Requiere sesión; si no hay cookie, redirige a /login conservando la ruta
 * original en `?next=` para volver a ella tras iniciar sesión.
 * No valida contra el backend: un token vencido se refresca en el cliente
 * (`supabase onAuthStateChange`) tras la hidratación, evitando re-logins.
 * El backend sigue protegiendo cada llamada real a la API.
 */
export async function requireAuth(next?: string): Promise<void> {
  const store = await cookies();
  const authed = store.has(SESSION_COOKIE);
  if (!authed) {
    return redirect(next ? `/login?next=${encodeURIComponent(next)}` : "/login");
  }
}

/** Devuelve el id del usuario (claim `sub` del JWT). */
export async function getCurrentUserId(): Promise<string> {
  const store = await cookies();
  const jwt = store.get(SESSION_COOKIE)?.value;
  if (jwt) {
    const sub = decodeSub(jwt);
    if (sub) return sub;
  }
  return "";
}