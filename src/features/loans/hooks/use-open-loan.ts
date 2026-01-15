import { create } from "zustand";

import type { Id } from "../../../../convex/_generated/dataModel";

type OpenLoanStore = {
  isOpen: boolean;
  id: Id<"loans"> | null;
  onOpen: (id: Id<"loans">) => void;
  onClose: () => void;
};

export const useOpenLoan = create<OpenLoanStore>((set) => ({
  isOpen: false,
  id: null,
  onOpen: (id) => set({ isOpen: true, id }),
  onClose: () => set({ isOpen: false, id: null }),
}));
