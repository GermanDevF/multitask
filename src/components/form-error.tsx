import { AlertCircleIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormErrorProps {
  error?: string | null;
  className?: string;
}

export const FormError = ({ error, className }: FormErrorProps) => {
  if (!error) return null;

  return (
    <div
      role="alert"
      aria-live="polite"
      aria-atomic="true"
      className={cn(
        "bg-destructive/15 text-destructive flex items-start gap-x-2 rounded-md p-3 text-sm",
        "border-destructive/20 border",
        "opacity-100 transition-opacity duration-200 ease-in-out",
        className
      )}>
      <AlertCircleIcon className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <p className="flex-1 leading-relaxed">{error}</p>
    </div>
  );
};
