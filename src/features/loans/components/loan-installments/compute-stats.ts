import type { Installment, LoanInstallmentStats } from "./types";

export function computeInstallmentStats(
  installments: Installment[]
): LoanInstallmentStats {
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
}
