import { useMutation } from "convex/react";
import { useCallback, useMemo, useState } from "react";

import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

type CreateLoanValues = {
  debtorId: Id<"debtors">;
  principalCents: number;
  currency: string;
  startDate: number;
  firstDueDate: number;
  installmentsCount: number;
  frequency: "WEEKLY" | "BIWEEKLY" | "MONTHLY";
  interestType: "NONE" | "SIMPLE";
  interestRateBps: number;
  notes?: string;
};

type CreateLoanResponse = { loanId: Id<"loans"> };
type ResponseType = CreateLoanResponse | null;

type Options = {
  onSuccess?: (response: ResponseType) => void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
  throwError?: boolean;
};

type Status = "loading" | "success" | "error" | null;

export const useCreateLoan = () => {
  const [data, setData] = useState<ResponseType>(null);
  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState<Status>(null);

  const mutation = useMutation(api.loans.createLoanWithInstallments);

  const isPending = useMemo(() => status === "loading", [status]);
  const isSuccess = useMemo(() => status === "success", [status]);
  const isError = useMemo(() => status === "error", [status]);
  const isSettled = useMemo(
    () => status === "success" || status === "error",
    [status]
  );

  const mutate = useCallback(
    async (values: CreateLoanValues, options: Options = {}) => {
      try {
        // Reset state
        setData(null);
        setError(null);
        setStatus("loading");

        const response = await mutation({
          debtorId: values.debtorId,
          principalCents: values.principalCents,
          currency: values.currency,
          startDate: values.startDate,
          firstDueDate: values.firstDueDate,
          installmentsCount: values.installmentsCount,
          frequency: values.frequency,
          interestType: values.interestType,
          interestRateBps: values.interestRateBps,
          notes: values.notes,
        });
        options?.onSuccess?.(response);
        setData(response);
        setStatus("success");
        return response;
      } catch (error) {
        setError(error as Error);
        setStatus("error");
        options?.onError?.(error as Error);
        if (options?.throwError) {
          throw error;
        }
        return null;
      } finally {
        options?.onSettled?.();
      }
    },
    [mutation]
  );

  return {
    mutate,
    data,
    error,
    status,
    isPending,
    isSuccess,
    isError,
    isSettled,
  };
};
