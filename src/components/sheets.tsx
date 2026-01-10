"use client";

import { useState } from "react";

import { NewDebtorSheet } from "@/features/debtors/components/new-debtor-sheet";
import { EditDebtorSheet } from "@/features/debtors/components/edit-debtor-sheet";

export function Sheets() {
  const [mounted] = useState(() => typeof window !== "undefined");

  if (!mounted) return null;
  return (
    <>
      <NewDebtorSheet />
      <EditDebtorSheet />
    </>
  );
}
