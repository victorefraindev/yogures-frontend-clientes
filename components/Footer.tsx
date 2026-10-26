import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { Drip } from "@/components/decor";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-card">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-morado to-azul-intenso text-white">
                <Drip className="size-4" />
              </span>
              <span className="font-heading text-lg font-bold text-foreground">
                Yogures Cremosos
              </span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Yogures artesanales y cremosos, preparados con frutas naturales
              para que cada cucharada sea un placer.
            </p>
          </div>

          <div>
            <h3 className="font-heading text-sm font-bold uppercase tracking-wide text-foreground">
              Navegación
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/productos" className="hover:text-primary">
                  Ver yogures
                </Link>
              </li>
              <li>
                <Link href="/carrito" className="hover:text-primary">
                  Mi carrito
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-primary">
                  Ingresar
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-sm font-bold uppercase tracking-wide text-foreground">
              Contacto
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Mail className="size-4 text-primary" />
                hola@yogurescremosos.com
              </li>
              <li className="flex items-center gap-2">
                <Phone className="size-4 text-primary" />
                +58 412-123-4567
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="size-4 text-primary" />
                Caracas, Venezuela
              </li>
            </ul>
          </div>
        </div>

        <p className="mt-8 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Yogures Cremosos · Demo con datos locales
        </p>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          Los pedidos y el perfil se guardan solo en este navegador.
        </p>
      </div>
    </footer>
  );
}