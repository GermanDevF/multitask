/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as auth from "../auth.js";
import type * as debtors from "../debtors.js";
import type * as expenses from "../expenses.js";
import type * as http from "../http.js";
import type * as loans from "../loans.js";
import type * as schema_debtors from "../schema/debtors.js";
import type * as schema_expenses from "../schema/expenses.js";
import type * as schema_index from "../schema/index.js";
import type * as schema_installments from "../schema/installments.js";
import type * as schema_loans from "../schema/loans.js";
import type * as schema_payments from "../schema/payments.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  debtors: typeof debtors;
  expenses: typeof expenses;
  http: typeof http;
  loans: typeof loans;
  "schema/debtors": typeof schema_debtors;
  "schema/expenses": typeof schema_expenses;
  "schema/index": typeof schema_index;
  "schema/installments": typeof schema_installments;
  "schema/loans": typeof schema_loans;
  "schema/payments": typeof schema_payments;
  users: typeof users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
