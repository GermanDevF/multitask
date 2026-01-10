import { Metadata } from "next";
import { Suspense } from "react";
import DebtorsCard from "./card";

export const metadata: Metadata = {
  title: "Debtors",
  description: "Debtors",
};

export default function DebtorsPage() {
  return (
    <main className="flex flex-1 flex-col pt-4">
      <div className="flex flex-1 flex-col space-y-4">
        <section
          aria-label="Debtors table"
          className="flex flex-col gap-4 px-4">
          <Suspense fallback={<span>Loading...</span>}>
            <DebtorsCard />
          </Suspense>
        </section>
      </div>
    </main>
  );
}
