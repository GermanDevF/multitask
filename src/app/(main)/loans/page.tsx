import { Metadata } from "next";
import { Suspense } from "react";
import LoansCard from "./card";

export const metadata: Metadata = {
  title: "Loans",
  description: "Loans",
};

export default function LoansPage() {
  return (
    <main className="flex flex-1 flex-col pt-4">
      <div className="flex flex-1 flex-col space-y-4">
        <section aria-label="Loans table" className="flex flex-col gap-4 px-4">
          <Suspense fallback={<span>Loading...</span>}>
            <LoansCard />
          </Suspense>
        </section>
      </div>
    </main>
  );
}
