import { z } from "zod";

const optionalString = z
  .union([z.string(), z.literal("")])
  .transform((val) => (val === "" ? undefined : val))
  .optional();

const optionalEmail = z
  .union([z.email(), z.literal("")])
  .transform((val) => (val === "" ? undefined : val))
  .optional();

export const debtorSchema = z.object({
  fullName: z.string().min(1, "El nombre es requerido"),
  phone: optionalString,
  email: optionalEmail,
  notes: optionalString,
});

export type DebtorFormInput = z.input<typeof debtorSchema>;
