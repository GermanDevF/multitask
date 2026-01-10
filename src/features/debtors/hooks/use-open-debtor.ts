import { create } from "zustand";

import type { Id } from "../../../../convex/_generated/dataModel";

type OpenDebtorStore = {
  isOpen: boolean;
  id: Id<"debtors"> | null;
  onOpen: (id: Id<"debtors">) => void;
  onClose: () => void;
};

export const useOpenDebtor = create<OpenDebtorStore>((set) => ({
  isOpen: false,
  id: null,
  onOpen: (id) => set({ isOpen: true, id }),
  onClose: () => set({ isOpen: false, id: null }),
}));
