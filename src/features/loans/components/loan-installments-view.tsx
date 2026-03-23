"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type { Id } from "../../../../convex/_generated/dataModel";
import { useGetLoan } from "../api/use-get-loan";
import { usePaymentDialog } from "../hooks/use-payment-dialog";
import { PaymentDialog } from "./payment-dialog";
import { computeInstallmentStats } from "./loan-installments/compute-stats";
import { formatCurrency } from "./loan-installments/format";
import { LoanAmountsSection } from "./loan-installments/loan-amounts-section";
import { LoanInstallmentsDetail } from "./loan-installments/loan-installments-detail";
import { LoanInstallmentsSkeleton } from "./loan-installments/loan-installments-skeleton";
import { LoanLoadError } from "./loan-installments/loan-load-error";
import { LoanStatsGrid } from "./loan-installments/loan-stats-grid";

type LoanInstallmentsViewProps = {
  loanId: Id<"loans">;
};

export function LoanInstallmentsView({ loanId }: LoanInstallmentsViewProps) {
  const { data, isLoading } = useGetLoan({ id: loanId });
  const { onOpen: onOpenPayment } = usePaymentDialog();

  const loan = data?.loan;
  const installments = useMemo(
    () => data?.installments || [],
    [data?.installments]
  );

  const [now] = useState(() => Date.now());

  const sortedInstallments = useMemo(() => {
    return [...installments].sort((a, b) => a.number - b.number);
  }, [installments]);

  const stats = useMemo(
    () => computeInstallmentStats(installments),
    [installments]
  );

  const progressPercent =
    stats.totalAmount > 0
      ? Math.min(100, Math.round((stats.paidAmount / stats.totalAmount) * 100))
      : 0;

  const handlePay = (installmentId: Id<"installments">) => {
    onOpenPayment(loanId, installmentId);
  };

  const rowContext = loan
    ? {
        loan,
        now,
        onPay: handlePay,
      }
    : null;

  return (
    <div className="mx-auto flex w-full max-w-screen-2xl flex-col gap-6 pb-6">
      {isLoading ? (
        <LoanInstallmentsSkeleton />
      ) : loan ? (
        <Card className="border-none shadow-none sm:border sm:shadow-sm">
          <CardHeader className="gap-4 px-2 sm:px-6">
            <Button variant="ghost" size="sm" className="w-fit -ml-2 h-9" asChild>
              <Link href="/loans">
                <ArrowLeft className="mr-1 size-4" aria-hidden />
                Volver a préstamos
              </Link>
            </Button>
            <div className="space-y-1">
              <CardTitle className="text-2xl font-semibold tracking-tight">
                Cuotas del préstamo
              </CardTitle>
              <CardDescription className="text-base">
                Capital{" "}
                <span className="font-medium text-foreground">
                  {formatCurrency(loan.principalCents, loan.currency)}
                </span>
                {" · "}
                {stats.total} {stats.total === 1 ? "cuota" : "cuotas"}
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-8 px-2 sm:px-6">
            <LoanStatsGrid stats={stats} />
            <LoanAmountsSection
              loan={loan}
              stats={stats}
              progressPercent={progressPercent}
            />
            <LoanInstallmentsDetail
              installments={sortedInstallments}
              rowContext={rowContext}
            />
          </CardContent>
        </Card>
      ) : (
        <LoanLoadError />
      )}
      <PaymentDialog />
    </div>
  );
}
