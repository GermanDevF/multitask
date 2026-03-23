import type { Installment } from "./types";

export function formatCurrency(cents: number, currency: string): string {
  const amount = cents / 100;
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString("es-MX", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function getStatusVariant(
  status: string
): "default" | "secondary" | "destructive" | "outline" {
  const map: Record<
    string,
    "default" | "secondary" | "destructive" | "outline"
  > = {
    PENDING: "outline",
    PAID: "default",
    LATE: "destructive",
    CANCELLED: "secondary",
  };
  return map[status] || "outline";
}

export function formatStatus(status: string): string {
  const map: Record<string, string> = {
    PENDING: "Pendiente",
    PAID: "Pagado",
    LATE: "Vencido",
    CANCELLED: "Cancelado",
  };
  return map[status] || status;
}

export function getInstallmentDerived(installment: Installment, now: number) {
  const remaining = installment.amountCents - installment.paidCents;
  const isOverdue =
    installment.status === "LATE" ||
    (installment.status === "PENDING" && installment.dueDate < now);
  return { remaining, isOverdue };
}
