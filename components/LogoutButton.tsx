"use client";

import { LogOut } from "lucide-react";
import { clearDemoSession } from "@/lib/mock-store";
import { clearSessionCookie } from "@/lib/session-cookie";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  function handleLogout() {
    clearDemoSession();
    clearSessionCookie();
    // Recarga completa para limpiar el estado de sesión del layout.
    window.location.replace("/");
  }

  return (
    <Button variant="outline" onClick={handleLogout}>
      <LogOut data-icon="inline-start" />
      Cerrar sesión
    </Button>
  );
}
