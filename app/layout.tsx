import type { Metadata } from "next";
import { Baloo_2, Nunito_Sans } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Toaster } from "@/components/ui/toast";
import { SessionProvider } from "@/lib/session-provider";
import { isAuthenticated } from "@/lib/session";
import { cn } from "@/lib/utils";

const baloo = Baloo_2({
  variable: "--font-baloo",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const nunito = Nunito_Sans({
  variable: "--font-nunito",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Yogures Cremosos",
    template: "%s · Yogures Cremosos",
  },
  description:
    "Yogures artesanales, cremosos y llenos de sabor. Elige tu favorito y recíbelo fresquito en tu casa.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const isLoggedIn = await isAuthenticated();

  return (
    <html
      lang="es"
      className={cn(
        "h-full scroll-smooth antialiased",
        baloo.variable,
        nunito.variable,
        "font-sans",
      )}
    >
      <body className="flex min-h-full flex-col">
        <CartProvider>
          <SessionProvider initial={isLoggedIn}>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </SessionProvider>
        </CartProvider>
        <Toaster />
      </body>
    </html>
  );
}