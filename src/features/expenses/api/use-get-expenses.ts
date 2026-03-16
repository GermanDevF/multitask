"use client";
import { useQuery } from "convex/react";

import { api } from "../../../../convex/_generated/api";

type Filters = {
  from?: number;
  to?: number;
  category?: string;
  paidByName?: string;
};

export const useGetExpenses = (filters?: Filters) => {
  const data = useQuery(api.expenses.list, filters ?? {});
  return { expenses: data ?? [], isLoading: data === undefined };
};
