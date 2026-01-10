import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function todayISODate() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function dateInputToMs(value: string) {
  const [y, m, d] = value.split("-").map((n) => Number(n));
  return new Date(y, m - 1, d).getTime();
}

export function moneyToCents(value: string) {
  return Math.round(Number(value) * 100);
}
