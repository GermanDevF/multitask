"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

import {
  formatCurrency,
  formatDate,
  formatStatus,
  getInstallmentDerived,
  getStatusVariant,
} from "./format";
import type { InstallmentRowProps } from "./types";

export function InstallmentTableRow({
  installment,
  loan,
  now,
  onPay,
}: InstallmentRowProps) {
  const { remaining, isOverdue } = getInstallmentDerived(installment, now);

  return (
    <TableRow
      className={cn(
        "transition-colors hover:bg-muted/40",
        isOverdue &&
          "border-l-4 border-l-destructive bg-destructive/6 dark:bg-destructive/10"
      )}>
      <TableCell className="w-14 font-medium tabular-nums">
        {installment.number}
      </TableCell>
      <TableCell>
        <div className="flex flex-col gap-0.5">
          <span className="font-medium">{formatDate(installment.dueDate)}</span>
          {installment.paidAt ? (
            <span className="text-xs text-muted-foreground">
              Pagado el {formatDate(installment.paidAt)}
            </span>
          ) : null}
        </div>
      </TableCell>
      <TableCell className="text-right font-medium tabular-nums">
        {formatCurrency(installment.amountCents, loan.currency)}
      </TableCell>
      <TableCell className="text-right tabular-nums text-muted-foreground">
        {formatCurrency(installment.paidCents, loan.currency)}
      </TableCell>
      <TableCell
        className={cn(
          "text-right tabular-nums",
          remaining > 0 && "font-medium text-amber-600 dark:text-amber-400"
        )}>
        {formatCurrency(remaining, loan.currency)}
      </TableCell>
      <TableCell>
        <Badge variant={getStatusVariant(installment.status)}>
          {formatStatus(installment.status)}
        </Badge>
      </TableCell>
      <TableCell className="w-30">
        {remaining > 0 ? (
          <Button
            size="sm"
            variant="outline"
            className="w-full min-w-22 sm:w-auto"
            onClick={() => onPay(installment._id)}>
            Pagar
          </Button>
        ) : (
          <span className="text-xs text-muted-foreground">—</span>
        )}
      </TableCell>
    </TableRow>
  );
}
