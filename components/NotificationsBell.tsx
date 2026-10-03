"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Bell } from "lucide-react";
import { getMyNotifications, markAllNotificationsRead } from "@/lib/client-api";
import type { Notification } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Separator } from "@/components/ui/separator";

const NOTIFICATIONS_POLL_MS = 30_000;

export function NotificationsBell() {
  // Cliente-only: false durante SSR/hidratación, true en el browser.
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  const openRef = useRef(open);
  useEffect(() => {
    openRef.current = open;
  }, [open]);

  const unread = notifications.filter((n) => !n.status).length;

  async function refresh() {
    if (openRef.current) return;
    const res = await getMyNotifications();
    if (res.ok && res.data) setNotifications(res.data);
    setLoading(false);
  }

  useEffect(() => {
    const id = window.setInterval(() => void refresh(), NOTIFICATIONS_POLL_MS);
    const onFocus = () => void refresh();
    window.addEventListener("focus", onFocus);
    const initial = window.setTimeout(() => void refresh(), 0);
    return () => {
      window.clearInterval(id);
      window.clearTimeout(initial);
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  // Al abrir el panel se marcan todas como leídas (limpia el badge).
  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    void markAllNotificationsRead().then((res) => {
      if (!cancelled && res.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, status: true })));
      }
    });
    return () => {
      cancelled = true;
    };
  }, [open]);

  async function markAllRead() {
    const res = await markAllNotificationsRead();
    if (res.ok) {
      setNotifications((prev) => prev.map((n) => ({ ...n, status: true })));
    }
  }

  // Cliente-only: evita participar en SSR/hidratación.
  if (!mounted) return null;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="right" className="w-full sm:max-w-sm">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-lg">
            <Bell className="size-5 text-primary" />
            Notificaciones
          </SheetTitle>
        </SheetHeader>

        {notifications.length === 0 ? (
          <div className="px-4">
            <Empty>
              <EmptyMedia variant="icon">
                <Bell />
              </EmptyMedia>
              <EmptyContent>
                <EmptyTitle>Sin notificaciones</EmptyTitle>
                <EmptyDescription>
                  {loading ? "Cargando…" : "Aquí verás el estado de tus pedidos."}
                </EmptyDescription>
              </EmptyContent>
            </Empty>
          </div>
        ) : (
          <>
            <div className="flex flex-1 flex-col gap-2 overflow-y-auto px-4">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={
                    n.status
                      ? "rounded-2xl bg-muted/40 p-3"
                      : "rounded-2xl border border-primary/30 bg-primary/5 p-3"
                  }
                >
                  <p className="text-sm font-medium text-foreground">{n.description}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {formatDate(n.createdAt)}
                  </p>
                </div>
              ))}
            </div>

            <div className="p-4">
              <Separator className="mb-4" />
              <Button
                size="sm"
                variant="outline"
                className="w-full"
                disabled={unread === 0}
                onClick={markAllRead}
              >
                Marcar todas como leídas
              </Button>
            </div>
          </>
        )}
      </SheetContent>

      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            aria-label={
              unread > 0
                ? `Notificaciones, ${unread} sin leer`
                : "Notificaciones"
            }
          />
        }
      >
        <Bell className="size-5" />
        {unread > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-gradient-to-br from-morado to-azul-intenso px-1 text-[10px] font-bold text-white">
            {unread}
          </span>
        )}
      </SheetTrigger>
    </Sheet>
  );
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString("es-VE", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}