import { z } from "zod";

export const EXPENSE_CATEGORIES = [
  "FOOD",
  "RENT",
  "UTILITIES",
  "TRANSPORT",
  "HEALTH",
  "ENTERTAINMENT",
  "OTHER",
] as const;

export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];

export const CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  FOOD: "Comida",
  RENT: "Renta",
  UTILITIES: "Servicios",
  TRANSPORT: "Transporte",
  HEALTH: "Salud",
  ENTERTAINMENT: "Entretenimiento",
  OTHER: "Otro",
};

export const expenseFormSchema = z.object({
  description: z.string().min(1, "La descripción es obligatoria"),
  amount: z
    .string()
    .min(1, "El monto es obligatorio")
    .refine((v) => Number(v) > 0, { message: "El monto debe ser mayor a 0" }),
  currency: z.enum(["MXN", "USD"]),
  category: z.enum(EXPENSE_CATEGORIES, {
    errorMap: () => ({ message: "Selecciona una categoría" }),
  }),
  date: z.date({ required_error: "La fecha es obligatoria" }),
  paidBy: z.string().min(1, "Quién pagó es obligatorio"),
});

export type ExpenseFormInput = z.infer<typeof expenseFormSchema>;
