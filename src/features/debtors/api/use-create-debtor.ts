import { useMutation } from "convex/react";
import { useCallback, useMemo, useState } from "react";

import { api } from "../../../../convex/_generated/api";
import { Doc } from "../../../../convex/_generated/dataModel";

type CreateDebtorValues = {
  fullName: string;
  phone?: string;
  email?: string;
  notes?: string;
};

type CreateDebtorResponse = Doc<"debtors">;
type ResponseType = CreateDebtorResponse | null;

type Options = {
  onSuccess?: (response: ResponseType) => void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
  throwError?: boolean;
};

type Status = "loading" | "success" | "error" | null;

export const useCreateDebtor = () => {
  const [data, setData] = useState<ResponseType>(null);
  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState<Status>(null);

  const mutation = useMutation(api.debtors.create);

  const isPending = useMemo(() => status === "loading", [status]);
  const isSuccess = useMemo(() => status === "success", [status]);
  const isError = useMemo(() => status === "error", [status]);
  const isSettled = useMemo(
    () => status === "success" || status === "error",
    [status]
  );

  const mutate = useCallback(
    async (values: CreateDebtorValues, options: Options = {}) => {
      try {
        // Reset state
        setData(null);
        setError(null);
        setStatus("loading");

        const response = await mutation({
          fullName: values.fullName,
          phone: values.phone,
          email: values.email,
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
