import type { Metadata } from "next";
import { requireAuth } from "@/lib/session";
import { ProfileView } from "@/components/ProfileView";

export const metadata: Metadata = {
  title: "Mi perfil",
  description: "Tus datos, yogures favoritos y pedidos anteriores.",
};

// SSR: página protegida, se renderiza por request.
export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  await requireAuth("/perfil");
  return <ProfileView />;
}
