import { useMutation } from "convex/react";
import { useCallback, useMemo, useState } from "react";

import { api } from "../../../../convex/_generated/api";
import { Doc, Id } from "../../../../convex/_generated/dataModel";

type ReturnType = {
  id: Id<"debtors">;
  fullName: string;
  phone?: string;
  email?: string;
  notes?: string;
};
type ResponseType = Doc<"debtors"> | null;

type Options = {
  onSuccess?: (response: ResponseType) => void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
  throwError?: boolean;
};

type Status = "loading" | "success" | "error" | "settled" | null;

export const useEditDebtor = () => {
  const [data, setData] = useState<ResponseType>(null);
  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState<Status>(null);

  const mutation = useMutation(api.debtors.update);

  const isPending = useMemo(() => status === "loading", [status]);
  const isSuccess = useMemo(() => status === "success", [status]);
  const isError = useMemo(() => status === "error", [status]);
  const isSettled = useMemo(() => status === "settled", [status]);

  const mutate = useCallback(
    async (values: ReturnType, options: Options) => {
      try {
        // Reset state
        setData(null);
        setError(null);
        setStatus("loading");

        // Start loading

        const response = await mutation({
          id: values.id,
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
      } finally {
        // End loading
        setStatus("settled");
        options?.onSettled?.();
        return null;
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
