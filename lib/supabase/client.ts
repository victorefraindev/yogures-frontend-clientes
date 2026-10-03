import { createBrowserClient } from "@supabase/ssr";
import { SESSION_COOKIE } from "@/lib/session-constants";

/**
 * Cliente Supabase del lado browser.
 *
 * Además de exponer el cliente, sincroniza el `access_token` de la sesión en
 * la cookie `jwt` (cookieAuth del backend). Como la sesión vive en localStorage,
 * al cargar la página Supabase la restaura y refresca el token automáticamente;
 * este listener mantiene la cookie al día para que las páginas protegidas no
 * expulsen al usuario cuando el token vence.
 */
export function createClient() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  supabase.auth.onAuthStateChange((event, session) => {
    if (session?.access_token) {
      document.cookie = `${SESSION_COOKIE}=${session.access_token}; path=/; max-age=3600; SameSite=Lax`;
    } else if (event === "SIGNED_OUT") {
      document.cookie = `${SESSION_COOKIE}=; path=/; max-age=0`;
    }
  });

  return supabase;
}