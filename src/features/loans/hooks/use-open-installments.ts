import { create } from "zustand";

import type { Id } from "../../../../convex/_generated/dataModel";

type OpenInstallmentsStore = {
  isOpen: boolean;
  loanId: Id<"loans"> | null;
  onOpen: (loanId: Id<"loans">) => void;
  onClose: () => void;
};

export const useOpenInstallments = create<OpenInstallmentsStore>((set) => ({
  isOpen: false,
  loanId: null,
  onOpen: (loanId) => set({ isOpen: true, loanId }),
  onClose: () => set({ isOpen: false, loanId: null }),
}));
