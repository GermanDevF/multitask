"use client";

import { useQuery } from "convex/react";
import { useMemo } from "react";
import { api } from "../../../../convex/_generated/api";

export const useGetDashboard = () => {
  const data = useQuery(api.loans.getInstallmentsDashboard, {});
  const isLoading = useMemo(() => data === undefined, [data]);

  return { data, isLoading };
};
