"use client";
import { useQuery } from "convex/react";

import { api } from "../../../../convex/_generated/api";

export const useGetLoans = () => {
  const data = useQuery(api.loans.list);
  return { loans: data, isLoading: data === undefined };
};
