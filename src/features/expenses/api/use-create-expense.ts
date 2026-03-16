import { useMutation } from "convex/react";
import { useCallback, useMemo, useState } from "react";

import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

type CreateExpenseValues = {
  description: string;
  amountCents: number;
  currency: string;
  category: string;
  paidByName: string;
  date: number;
};

type ResponseType = Id<"expenses"> | null;

type Options = {
  onSuccess?: (id: ResponseType) => void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
  throwError?: boolean;
};

type Status = "loading" | "success" | "error" | null;

export const useCreateExpense = () => {
  const [data, setData] = useState<ResponseType>(null);
  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState<Status>(null);

  const mutation = useMutation(api.expenses.create);

  const isPending = useMemo(() => status === "loading", [status]);
  const isSuccess = useMemo(() => status === "success", [status]);
  const isError = useMemo(() => status === "error", [status]);
  const isSettled = useMemo(
    () => status === "success" || status === "error",
    [status]
  );

  const mutate = useCallback(
    async (values: CreateExpenseValues, options: Options = {}) => {
      try {
        setData(null);
        setError(null);
        setStatus("loading");

        const response = await mutation(values);
        options?.onSuccess?.(response);
        setData(response);
        setStatus("success");
        return response;
      } catch (err) {
        setError(err as Error);
        setStatus("error");
        options?.onError?.(err as Error);
        if (options?.throwError) throw err;
        return null;
      } finally {
        options?.onSettled?.();
      }
    },
    [mutation]
  );

  return { mutate, data, error, status, isPending, isSuccess, isError, isSettled };
};
