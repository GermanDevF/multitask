"use client";

import { Wallet } from "lucide-react";

import { Separator } from "@/components/ui/separator";

import { formatCurrency } from "./format";
import type { Loan, LoanInstallmentStats } from "./types";

type LoanAmountsSectionProps = {
  loan: Loan;
  stats: LoanInstallmentStats;
  progressPercent: number;
};

export function LoanAmountsSection({
  loan,
  stats,
  progressPercent,
}: LoanAmountsSectionProps) {
  return (
    <div className="space-y-4 rounded-xl border bg-muted/30 p-4 sm:p-5">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Montos</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Comparación entre el total del plan y lo abonado hasta hoy
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Wallet className="size-4" aria-hidden />
          <span className="tabular-nums">
            {formatCurrency(stats.paidAmount, loan.currency)} de{" "}
            {formatCurrency(stats.totalAmount, loan.currency)}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <div
          className="flex justify-between text-xs text-muted-foreground"
          aria-hidden>
          <span>Progreso</span>
          <span className="tabular-nums font-medium">{progressPercent}%</span>
        </div>
        <div
          className="h-2.5 overflow-hidden rounded-full bg-muted"
          role="progressbar"
          aria-valuenow={progressPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Progreso de pago: ${progressPercent} por ciento`}>
          <div
            className="h-full rounded-full bg-primary transition-[width] duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <Separator className="bg-border/80" />

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Monto total
          </p>
          <p className="mt-1 text-lg font-semibold tabular-nums">
            {formatCurrency(stats.totalAmount, loan.currency)}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Pagado
          </p>
          <p className="mt-1 text-lg font-semibold tabular-nums text-emerald-600 dark:text-emerald-400">
            {formatCurrency(stats.paidAmount, loan.currency)}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Por pagar
          </p>
          <p className="mt-1 text-lg font-semibold tabular-nums text-amber-600 dark:text-amber-400">
            {formatCurrency(stats.remainingAmount, loan.currency)}
          </p>
        </div>
      </div>
    </div>
  );
}
