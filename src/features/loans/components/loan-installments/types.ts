import type { Doc, Id } from "../../../../../convex/_generated/dataModel";

export type Loan = Doc<"loans">;
export type Installment = Doc<"installments">;

export type InstallmentRowProps = {
  installment: Installment;
  loan: Loan;
  now: number;
  onPay: (installmentId: Id<"installments">) => void;
};

export type LoanInstallmentStats = {
  total: number;
  paid: number;
  pending: number;
  late: number;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
};
