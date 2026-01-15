"use client";

import { useState } from "react";

import { NewDebtorSheet } from "@/features/debtors/components/new-debtor-sheet";
import { EditDebtorSheet } from "@/features/debtors/components/edit-debtor-sheet";
import { NewLoanSheet } from "@/features/loans/components/new-loan-sheet";
import { EditLoanSheet } from "@/features/loans/components/edit-loan-sheet";

export function Sheets() {
  const [mounted] = useState(() => typeof window !== "undefined");

  if (!mounted) return null;
  return (
    <>
      <NewDebtorSheet />
      <EditDebtorSheet />
      <NewLoanSheet />
      <EditLoanSheet />
    </>
  );
}
