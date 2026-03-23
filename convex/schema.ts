import { authTables } from "@convex-dev/auth/server";
import { defineSchema } from "convex/server";
import {
  debtors,
  expenses,
  installments,
  loans,
  payments,
} from "./schema/index";

/**
 * Esquema de la base de datos de Convex.
 * Define las tablas: debtors, loans, installments y payments.
 */
export default defineSchema({
  ...authTables,
  debtors,
  loans,
  installments,
  payments,
  expenses,
});
