import { create } from "zustand";

type NewLoanStore = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useNewLoan = create<NewLoanStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
