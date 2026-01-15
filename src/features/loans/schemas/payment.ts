import { z } from "zod";

export const paymentFormSchema = z.object({
  amount: z
    .string()
    .min(1, "Ingresa un monto")
    .refine(
      (v) => Number.isFinite(Number(v)) && Number(v) > 0,
      "Monto inválido"
    ),
  paymentDate: z.coerce.date({
    error: "Selecciona la fecha de pago",
  }),
  method: z.enum(["CASH", "TRANSFER", "CARD", "OTHER"]).optional(),
  reference: z.string().optional(),
  notes: z.string().optional(),
});

export type PaymentFormInput = z.input<typeof paymentFormSchema>;
export type PaymentFormValues = z.infer<typeof paymentFormSchema>;
