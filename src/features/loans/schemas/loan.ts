import { z } from "zod";

export const loanFormSchema = z
  .object({
    debtorId: z.string().min(1, "Selecciona un deudor"),
    amount: z
      .string()
      .min(1, "Ingresa un monto")
      .refine(
        (v) => Number.isFinite(Number(v)) && Number(v) > 0,
        "Monto inválido"
      ),
    currency: z.string().min(1, "Selecciona una moneda"),
    startDate: z.coerce.date().min(1, "Selecciona la fecha de inicio"),
    firstDueDate: z.coerce.date().min(1, "Selecciona la primera fecha de pago"),
    installmentsCount: z.coerce
      .number()
      .int("Debe ser un entero")
      .min(1, "Mínimo 1")
      .max(1000, "Máximo 1000 cuotas"),
    frequency: z.enum(["WEEKLY", "BIWEEKLY", "MONTHLY"]),
    interestType: z.enum(["NONE", "SIMPLE"]),
    interestRatePercent: z.string().optional(),
    notes: z.string().optional(),
  })
  .refine(
    (data) => {
      if (!data.startDate || !data.firstDueDate) return true;
      const start = new Date(data.startDate);
      const firstDue = new Date(data.firstDueDate);
      return firstDue >= start;
    },
    {
      message:
        "La primera fecha de pago debe ser igual o posterior a la fecha de inicio",
      path: ["firstDueDate"],
    }
  )
  .superRefine((data, ctx) => {
    // Si el tipo de interés es SIMPLE, la tasa es requerida y debe ser > 0
    if (data.interestType === "SIMPLE") {
      if (!data.interestRatePercent || data.interestRatePercent.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "La tasa de interés es requerida cuando el tipo es Simple",
          path: ["interestRatePercent"],
        });
        return;
      }
      const rate = Number(data.interestRatePercent);
      if (!Number.isFinite(rate) || rate <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "La tasa de interés debe ser mayor a 0",
          path: ["interestRatePercent"],
        });
      }
    }
    // Si el tipo de interés es NONE, establecer la tasa en "0" si no está definida
    if (data.interestType === "NONE") {
      if (!data.interestRatePercent || data.interestRatePercent.trim() === "") {
        // No es un error, pero podemos establecerlo en "0" si queremos
        // Por ahora solo validamos que si hay un valor, sea válido
        return;
      }
      const rate = Number(data.interestRatePercent);
      if (!Number.isFinite(rate) || rate < 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "La tasa de interés debe ser 0 o mayor cuando el tipo es Sin interés",
          path: ["interestRatePercent"],
        });
      }
    }
  });

export type LoanFormInput = z.input<typeof loanFormSchema>;
export type LoanFormValues = z.infer<typeof loanFormSchema>;
