"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, User } from "lucide-react";
import { Drip } from "@/components/decor";
import { CartBadge } from "@/components/CartBadge";
import { NotificationsBell } from "@/components/NotificationsBell";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/session-provider";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/productos", label: "Yogures" },
];

export function Header() {
  const isLoggedIn = useSession();
  const pathname = usePathname();
  const isProfilePage = pathname === "/perfil";

  const accountHref = isProfilePage ? "/" : isLoggedIn ? "/perfil" : "/login";
  const accountLabel = isProfilePage
    ? "Regresar a inicio"
    : isLoggedIn
      ? "Ver perfil"
      : "Ingresar";

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-morado to-azul-intenso text-white">
            <Drip className="size-5" />
          </span>
          <span className="font-heading text-xl font-bold leading-none text-foreground">
            Yogures <span className="text-primary">Cremosos</span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href={accountHref}
            className="hidden items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-accent hover:text-accent-foreground sm:inline-flex"
          >
            <User className="size-4 text-primary" />
            {accountLabel}
          </Link>
          {isLoggedIn && <NotificationsBell />}
          <CartBadge />

          {/* Menú móvil */}
          <Sheet>
            <SheetTrigger
              render={
                <Button
                  variant="outline"
                  size="icon"
                  className="md:hidden"
                  aria-label="Abrir menú"
                />
              }
            >
              <Menu />
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <span className="flex size-6 items-center justify-center rounded-full bg-gradient-to-br from-morado to-azul-intenso text-white">
                    <Drip className="size-3.5" />
                  </span>
                  Yogures Cremosos
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-4">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="rounded-xl px-3 py-2.5 text-base font-semibold text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href={accountHref}
                  className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-base font-semibold text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <User className="size-4 text-primary" />
                  {accountLabel}
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}