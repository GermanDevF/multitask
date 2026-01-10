import { create } from "zustand";

type NewDebtorStore = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useNewDebtor = create<NewDebtorStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
