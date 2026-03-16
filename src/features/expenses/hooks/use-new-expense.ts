import { create } from "zustand";

type NewExpenseState = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useNewExpense = create<NewExpenseState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
