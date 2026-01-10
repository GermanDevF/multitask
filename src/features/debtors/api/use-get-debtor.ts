"use client";

import { useQuery } from "convex/react";
import { useMemo } from "react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface UseGetDebtorProps {
  id: Id<"debtors"> | null;
}

export const useGetDebtor = ({ id }: UseGetDebtorProps) => {
  const debtor = useQuery(api.debtors.get, id ? { id } : "skip");
  const isLoading = useMemo(() => debtor === undefined, [debtor]);

  return { debtor, isLoading };
};
