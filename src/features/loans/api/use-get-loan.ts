"use client";

import { useQuery } from "convex/react";
import { useMemo } from "react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface UseGetLoanProps {
  id: Id<"loans"> | null;
}

export const useGetLoan = ({ id }: UseGetLoanProps) => {
  const data = useQuery(api.loans.getLoan, id ? { loanId: id } : "skip");
  const isLoading = useMemo(() => data === undefined, [data]);

  return { data, isLoading };
};
