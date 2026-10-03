"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { clearSessionCookie } from "@/lib/session-cookie";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";

export function LogoutButton() {
  const router = useRouter();

  function handleLogout() {
    clearSessionCookie();
    toast.add({
      type: "info",
      title: "Sesión cerrada",
      description: "Te esperamos pronto.",
    });
    router.push("/");
    router.refresh();
  }

  return (
    <Button variant="outline" onClick={handleLogout}>
      <LogOut data-icon="inline-start" />
      Cerrar sesión
    </Button>
  );
}