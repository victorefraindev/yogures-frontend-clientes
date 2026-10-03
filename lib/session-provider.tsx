"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { createClient } from "@/lib/supabase/client";
import { SESSION_COOKIE } from "@/lib/session-constants";
import { setSessionCookie } from "@/lib/session-cookie";

/**
 * Estado de sesión reactivo del lado cliente.
 *
 * Restaura la cookie `jwt` desde la sesión de Supabase (localStorage) y expone
 * `isLoggedIn` para que el Header muestre "Ver perfil" / "Ingresar" sin esperar
 * un reload. `initial` viene del servidor (SSR) para evitar flash.
 */
const SessionContext = createContext<boolean>(false);

function hasSessionCookie(): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie
    .split(";")
    .some((c) => c.trim().startsWith(`${SESSION_COOKIE}=`));
}

export function SessionProvider({
  children,
  initial,
}: {
  children: ReactNode;
  initial: boolean;
}) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(initial);

  useEffect(() => {
    const supabase = createClient();
    let cancelled = false;

    supabase.auth.getSession().then(({ data }) => {
      if (cancelled) return;
      if (data.session) {
        setSessionCookie(data.session.access_token);
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(hasSessionCookie());
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <SessionContext.Provider value={isLoggedIn}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession(): boolean {
  return useContext(SessionContext);
}