"use client";

import { Calendar } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import {
  formatCurrency,
  formatDate,
  formatStatus,
  getInstallmentDerived,
  getStatusVariant,
} from "./format";
import type { InstallmentRowProps } from "./types";

export function InstallmentMobileCard({
  installment,
  loan,
  now,
  onPay,
}: InstallmentRowProps) {
  const { remaining, isOverdue } = getInstallmentDerived(installment, now);

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-xl border bg-card p-4 shadow-sm",
        isOverdue && "border-destructive/40 bg-destructive/4 dark:bg-destructive/10"
      )}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-baseline gap-2">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-sm font-semibold tabular-nums">
            {installment.number}
          </span>
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="size-3.5 shrink-0" aria-hidden />
              <span className="truncate">{formatDate(installment.dueDate)}</span>
            </div>
            {installment.paidAt ? (
              <p className="mt-0.5 text-xs text-muted-foreground">
                Pagado el {formatDate(installment.paidAt)}
              </p>
            ) : null}
          </div>
        </div>
        <Badge variant={getStatusVariant(installment.status)} className="shrink-0">
          {formatStatus(installment.status)}
        </Badge>
      </div>

      <div className="grid grid-cols-3 gap-2 text-sm">
        <div>
          <p className="text-xs text-muted-foreground">Cuota</p>
          <p className="font-medium tabular-nums">
            {formatCurrency(installment.amountCents, loan.currency)}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Pagado</p>
          <p className="tabular-nums text-muted-foreground">
            {formatCurrency(installment.paidCents, loan.currency)}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Pendiente</p>
          <p
            className={cn(
              "tabular-nums",
              remaining > 0 && "font-medium text-amber-600 dark:text-amber-400"
            )}>
            {formatCurrency(remaining, loan.currency)}
          </p>
        </div>
      </div>

      {remaining > 0 ? (
        <Button
          size="sm"
          className="w-full"
          onClick={() => onPay(installment._id)}>
          Pagar
        </Button>
      ) : null}
    </div>
  );
}
