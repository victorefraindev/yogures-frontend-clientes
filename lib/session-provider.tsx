"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { getDemoSession } from "@/lib/mock-store";
import { SESSION_COOKIE } from "@/lib/session-constants";
import { setSessionCookie } from "@/lib/session-cookie";

/**
 * Estado de sesión reactivo del lado cliente (rama `demo`).
 *
 * Restaura la cookie `jwt` desde la sesión guardada en localStorage y expone
 * `isLoggedIn` para que el Header muestre "Ver perfil" / "Ingresar".
 * `initial` viene del servidor (SSR) para evitar flash.
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
    // Diferido para no llamar setState de forma síncrona dentro del effect.
    queueMicrotask(() => {
      if (getDemoSession()) {
        setSessionCookie("demo-session");
        setIsLoggedIn(true);
        return;
      }
      setIsLoggedIn(hasSessionCookie());
    });
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
