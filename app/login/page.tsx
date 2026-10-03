import type { Metadata } from "next";
import { AutoLogin } from "@/components/AutoLogin";
import { LoginForm } from "@/components/LoginForm";

export const metadata: Metadata = {
  title: "Ingresar",
  description:
    "Ingresá a tu cuenta de Yogures Cremosos para ver recomendados y pedidos.",
};

interface LoginPageProps {
  searchParams: Promise<{ next?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { next } = await searchParams;
  const target = next && next.startsWith("/") && !next.startsWith("//") ? next : undefined;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <AutoLogin next={target} />
      <LoginForm next={target} />
    </div>
  );
}