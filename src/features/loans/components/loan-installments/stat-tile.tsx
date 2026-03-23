import type { ComponentType } from "react";

import { cn } from "@/lib/utils";

type StatTileProps = {
  label: string;
  value: number | string;
  icon: ComponentType<{ className?: string }>;
  valueClassName?: string;
};

export function StatTile({
  label,
  value,
  icon: Icon,
  valueClassName,
}: StatTileProps) {
  return (
    <div className="flex flex-col gap-2 rounded-xl border bg-card/50 p-4 shadow-sm">
      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        <Icon className="size-3.5 shrink-0 opacity-80" aria-hidden />
        {label}
      </div>
      <div
        className={cn(
          "text-2xl font-semibold tabular-nums tracking-tight",
          valueClassName
        )}>
        {value}
      </div>
    </div>
  );
}
