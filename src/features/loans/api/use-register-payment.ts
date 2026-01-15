import { useMutation } from "convex/react";
import { useCallback, useMemo, useState } from "react";

import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

type RegisterPaymentValues = {
  loanId: Id<"loans">;
  installmentId: Id<"installments">;
  amountCents: number;
  paymentDate: number;
  method?: "CASH" | "TRANSFER" | "CARD" | "OTHER";
  reference?: string;
  notes?: string;
};

type RegisterPaymentResponse = { installmentId: Id<"installments"> };
type ResponseType = RegisterPaymentResponse | null;

type Options = {
  onSuccess?: (response: ResponseType) => void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
  throwError?: boolean;
};

type Status = "loading" | "success" | "error" | null;

export const useRegisterPayment = () => {
  const [data, setData] = useState<ResponseType>(null);
  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState<Status>(null);

  const mutation = useMutation(api.loans.registerPayment);

  const isPending = useMemo(() => status === "loading", [status]);
  const isSuccess = useMemo(() => status === "success", [status]);
  const isError = useMemo(() => status === "error", [status]);
  const isSettled = useMemo(
    () => status === "success" || status === "error",
    [status]
  );

  const mutate = useCallback(
    async (values: RegisterPaymentValues, options: Options = {}) => {
      try {
        // Reset state
        setData(null);
        setError(null);
        setStatus("loading");

        const response = await mutation({
          loanId: values.loanId,
          installmentId: values.installmentId,
          amountCents: values.amountCents,
          paymentDate: values.paymentDate,
          method: values.method,
          reference: values.reference,
          notes: values.notes,
        });

        const result = { installmentId: response?._id ?? "" };
        options?.onSuccess?.(result as ResponseType);
        setData(result as ResponseType);
        setStatus("success");
        return result;
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
