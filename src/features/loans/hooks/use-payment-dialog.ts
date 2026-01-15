import { create } from "zustand";

import type { Id } from "../../../../convex/_generated/dataModel";

type PaymentDialogStore = {
  isOpen: boolean;
  loanId: Id<"loans"> | null;
  installmentId: Id<"installments"> | null;
  onOpen: (loanId: Id<"loans">, installmentId: Id<"installments">) => void;
  onClose: () => void;
};

export const usePaymentDialog = create<PaymentDialogStore>((set) => ({
  isOpen: false,
  loanId: null,
  installmentId: null,
  onOpen: (loanId, installmentId) =>
    set({ isOpen: true, loanId, installmentId }),
  onClose: () => set({ isOpen: false, loanId: null, installmentId: null }),
}));
