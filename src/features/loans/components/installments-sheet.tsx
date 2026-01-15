"use client";

import { useMemo, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useOpenInstallments } from "../hooks/use-open-installments";
import { useGetLoan } from "../api/use-get-loan";
import { usePaymentDialog } from "../hooks/use-payment-dialog";
import { PaymentDialog } from "./payment-dialog";

// Función para formatear moneda
function formatCurrency(cents: number, currency: string): string {
  const amount = cents / 100;
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

// Función para formatear fecha
function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString("es-MX", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// Función para obtener el color del badge según el estado
function getStatusVariant(
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

// Función para traducir el estado
function formatStatus(status: string): string {
  const map: Record<string, string> = {
    PENDING: "Pendiente",
    PAID: "Pagado",
    LATE: "Vencido",
    CANCELLED: "Cancelado",
  };
  return map[status] || status;
}

export function InstallmentsSheet() {
  const { isOpen, loanId, onClose } = useOpenInstallments();
  const { data, isLoading } = useGetLoan({ id: loanId });
  const { onOpen: onOpenPayment } = usePaymentDialog();

  const loan = data?.loan;
  const installments = useMemo(
    () => data?.installments || [],
    [data?.installments]
  );

  // Obtener la fecha actual una vez al montar el componente
  const [now] = useState(() => Date.now());

  // Ordenar cuotas por número
  const sortedInstallments = useMemo(() => {
    return [...installments].sort((a, b) => a.number - b.number);
  }, [installments]);

  // Calcular estadísticas
  const stats = useMemo(() => {
    const total = installments.length;
    const paid = installments.filter((i) => i.status === "PAID").length;
    const pending = installments.filter((i) => i.status === "PENDING").length;
    const late = installments.filter((i) => i.status === "LATE").length;
    const totalAmount = installments.reduce((sum, i) => sum + i.amountCents, 0);
    const paidAmount = installments.reduce((sum, i) => sum + i.paidCents, 0);

    return {
      total,
      paid,
      pending,
      late,
      totalAmount,
      paidAmount,
      remainingAmount: totalAmount - paidAmount,
    };
  }, [installments]);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="overflow-y-auto w-full sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle>Cuotas del préstamo</SheetTitle>
          <SheetDescription>
            {loan
              ? `Cuotas del préstamo de ${formatCurrency(
                  loan.principalCents,
                  loan.currency
                )}`
              : "Visualiza todas las cuotas del préstamo"}
          </SheetDescription>
        </SheetHeader>

        {isLoading ? (
          <div className="mt-6 space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        ) : loan ? (
          <div className="mt-6 space-y-6">
            {/* Estadísticas */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="rounded-lg border p-4">
                <div className="text-sm text-muted-foreground">Total</div>
                <div className="text-2xl font-semibold">{stats.total}</div>
              </div>
              <div className="rounded-lg border p-4">
                <div className="text-sm text-muted-foreground">Pagadas</div>
                <div className="text-2xl font-semibold text-green-600 dark:text-green-400">
                  {stats.paid}
                </div>
              </div>
              <div className="rounded-lg border p-4">
                <div className="text-sm text-muted-foreground">Pendientes</div>
                <div className="text-2xl font-semibold text-yellow-600 dark:text-yellow-400">
                  {stats.pending}
                </div>
              </div>
              <div className="rounded-lg border p-4">
                <div className="text-sm text-muted-foreground">Vencidas</div>
                <div className="text-2xl font-semibold text-red-600 dark:text-red-400">
                  {stats.late}
                </div>
              </div>
            </div>

            {/* Resumen de montos */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-lg border p-4">
                <div className="text-sm text-muted-foreground">Monto total</div>
                <div className="text-lg font-semibold">
                  {formatCurrency(stats.totalAmount, loan.currency)}
                </div>
              </div>
              <div className="rounded-lg border p-4">
                <div className="text-sm text-muted-foreground">Pagado</div>
                <div className="text-lg font-semibold text-green-600 dark:text-green-400">
                  {formatCurrency(stats.paidAmount, loan.currency)}
                </div>
              </div>
              <div className="rounded-lg border p-4">
                <div className="text-sm text-muted-foreground">Pendiente</div>
                <div className="text-lg font-semibold text-yellow-600 dark:text-yellow-400">
                  {formatCurrency(stats.remainingAmount, loan.currency)}
                </div>
              </div>
            </div>

            {/* Tabla de cuotas */}
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">#</TableHead>
                    <TableHead>Fecha de vencimiento</TableHead>
                    <TableHead className="text-right">Monto</TableHead>
                    <TableHead className="text-right">Pagado</TableHead>
                    <TableHead className="text-right">Pendiente</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="w-32">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedInstallments.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center text-muted-foreground">
                        No hay cuotas registradas
                      </TableCell>
                    </TableRow>
                  ) : (
                    sortedInstallments.map((installment) => {
                      const remaining =
                        installment.amountCents - installment.paidCents;
                      const isOverdue =
                        installment.status === "LATE" ||
                        (installment.status === "PENDING" &&
                          installment.dueDate < now);

                      return (
                        <TableRow
                          key={installment._id}
                          className={
                            isOverdue ? "bg-red-50 dark:bg-red-950/20" : ""
                          }>
                          <TableCell className="font-medium">
                            {installment.number}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span>{formatDate(installment.dueDate)}</span>
                              {installment.paidAt && (
                                <span className="text-xs text-muted-foreground">
                                  Pagado: {formatDate(installment.paidAt)}
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {formatCurrency(
                              installment.amountCents,
                              loan.currency
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(
                              installment.paidCents,
                              loan.currency
                            )}
                          </TableCell>
                          <TableCell
                            className={`text-right ${
                              remaining > 0
                                ? "font-medium text-yellow-600 dark:text-yellow-400"
                                : ""
                            }`}>
                            {formatCurrency(remaining, loan.currency)}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={getStatusVariant(installment.status)}>
                              {formatStatus(installment.status)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {remaining > 0 && loanId ? (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  onOpenPayment(loanId, installment._id)
                                }>
                                Pagar
                              </Button>
                            ) : (
                              <span className="text-xs text-muted-foreground">
                                Pagado
                              </span>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        ) : (
          <div className="mt-6 text-center text-muted-foreground">
            No se pudo cargar la información del préstamo
          </div>
        )}
      </SheetContent>
      <PaymentDialog />
    </Sheet>
  );
}
