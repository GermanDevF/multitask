import { Metadata } from "next";

import { LoanInstallmentsView } from "@/features/loans/components/loan-installments-view";

import type { Id } from "../../../../../../convex/_generated/dataModel";

export const metadata: Metadata = {
  title: "Cuotas del préstamo",
  description: "Cuotas y pagos del préstamo",
};

type PageProps = {
  params: Promise<{ loanId: string }>;
};

export default async function LoanInstallmentsPage({ params }: PageProps) {
  const { loanId } = await params;

  return (
    <main className="flex flex-1 flex-col pt-2 sm:pt-4">
      <div className="flex flex-1 flex-col space-y-4 px-2 sm:px-4">
        <section aria-label="Cuotas del préstamo">
          <LoanInstallmentsView loanId={loanId as Id<"loans">} />
        </section>
      </div>
    </main>
  );
}
