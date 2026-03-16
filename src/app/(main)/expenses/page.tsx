import { Metadata } from "next";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

import { ExpensesDashboard } from "@/features/expenses/components/expenses-dashboard";

export const metadata: Metadata = {
  title: "Gastos del Hogar",
  description: "Registro y prorrateo de gastos compartidos del hogar",
};

export default function ExpensesPage() {
  return (
    <main className="flex flex-1 flex-col pt-2 sm:pt-4">
      <div className="flex flex-1 flex-col space-y-4">
        <section
          aria-label="Expenses dashboard"
          className="flex flex-col gap-4 px-2 sm:px-4">
          <Suspense
            fallback={
              <div className="flex items-center justify-center py-20">
                <Loader2 className="size-6 animate-spin text-muted-foreground" />
              </div>
            }>
            <ExpensesDashboard />
          </Suspense>
        </section>
      </div>
    </main>
  );
}
