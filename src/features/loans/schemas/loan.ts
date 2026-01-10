import { z } from "zod";

export const loanFormSchema = z.object({
  debtorId: z.string().min(1, "Selecciona un deudor"),
  amount: z
    .string()
    .min(1, "Ingresa un monto")
    .refine(
      (v) => Number.isFinite(Number(v)) && Number(v) > 0,
      "Monto inválido"
    ),
  currency: z.string().min(1, "Selecciona una moneda"),
  startDate: z.string().min(1, "Selecciona la fecha de inicio"),
  firstDueDate: z.string().min(1, "Selecciona la primera fecha de pago"),
  installmentsCount: z.coerce
    .number()
    .int("Debe ser un entero")
    .min(1, "Mínimo 1"),
  frequency: z.enum(["WEEKLY", "BIWEEKLY", "MONTHLY"]),
  interestType: z.enum(["NONE", "SIMPLE"]),
  interestRatePercent: z
    .string()
    .min(1, "Ingresa la tasa (0 si no aplica)")
    .refine(
      (v) => Number.isFinite(Number(v)) && Number(v) >= 0,
      "Interés inválido"
    ),
  notes: z.string().optional(),
});

export type LoanFormInput = z.input<typeof loanFormSchema>;
export type LoanFormValues = z.infer<typeof loanFormSchema>;
