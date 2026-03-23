import { Metadata } from "next";
import { Suspense } from "react";

import { Skeleton } from "@/components/ui/skeleton";

import LoansCard from "./card";

export const metadata: Metadata = {
  title: "Préstamos",
  description: "Lista de préstamos, cuotas y pagos",
};

function LoansPageSkeleton() {
  return (
    <div
      className="mx-auto w-full max-w-screen-2xl space-y-4 px-2 pb-10 sm:px-4"
      aria-hidden>
      <div className="space-y-2 pt-1">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-full max-w-md" />
      </div>
      <Skeleton className="h-[min(24rem,50vh)] w-full rounded-xl" />
    </div>
  );
}

export default function LoansPage() {
  return (
    <main className="flex flex-1 flex-col pt-2 sm:pt-4">
      <div className="flex flex-1 flex-col space-y-4">
        <section
          aria-label="Lista de préstamos"
          className="flex flex-col gap-4 px-2 sm:px-4">
          <Suspense fallback={<LoansPageSkeleton />}>
            <LoansCard />
          </Suspense>
        </section>
      </div>
    </main>
  );
}
