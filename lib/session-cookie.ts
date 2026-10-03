import { SESSION_COOKIE } from "@/lib/session-constants";

const SECURE = process.env.NODE_ENV === "production" ? "; Secure" : "";

/** Guarda el access_token en la cookie `jwt` (la lee el SSR y la envía al backend). */
export function setSessionCookie(token: string): void {
  document.cookie = `${SESSION_COOKIE}=${token}; path=/; max-age=3600; SameSite=Lax${SECURE}`;
}

/** Elimina la cookie de sesión. */
export function clearSessionCookie(): void {
  document.cookie = `${SESSION_COOKIE}=; path=/; max-age=0`;
}