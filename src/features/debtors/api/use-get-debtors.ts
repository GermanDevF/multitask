"use client";
import { useQuery } from "convex/react";

import { api } from "../../../../convex/_generated/api";

export const useGetDebtors = () => {
  const data = useQuery(api.debtors.list);
  return { debtors: data, isLoading: data === undefined };
};
