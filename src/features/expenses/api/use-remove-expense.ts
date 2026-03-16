import { useMutation } from "convex/react";
import { useCallback, useMemo, useState } from "react";

import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

type Options = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
  throwError?: boolean;
};

type Status = "loading" | "success" | "error" | null;

export const useRemoveExpense = () => {
  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState<Status>(null);

  const mutation = useMutation(api.expenses.remove);

  const isPending = useMemo(() => status === "loading", [status]);

  const mutate = useCallback(
    async (id: Id<"expenses">, options: Options = {}) => {
      try {
        setError(null);
        setStatus("loading");

        await mutation({ id });
        options?.onSuccess?.();
        setStatus("success");
      } catch (err) {
        setError(err as Error);
        setStatus("error");
        options?.onError?.(err as Error);
        if (options?.throwError) throw err;
      } finally {
        options?.onSettled?.();
      }
    },
    [mutation]
  );

  return { mutate, error, status, isPending };
};
