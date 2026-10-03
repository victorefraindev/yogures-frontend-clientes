import type { OrderStatus } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

type BadgeVariant = "default" | "secondary" | "outline" | "destructive";

const statusVariant: Record<OrderStatus, BadgeVariant> = {
  aprobada: "default",
  comprobada: "secondary",
  entregada: "default",
  pendiente: "outline",
  rechazada: "destructive",
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return <Badge variant={statusVariant[status]}>{status}</Badge>;
}