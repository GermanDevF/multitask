"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ComponentType, SVGProps } from "react";

export type StatCardProps = {
  label: string;
  value: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  variant?: "default" | "success" | "warning" | "danger";
  description?: string;
};

const variantStyles: Record<NonNullable<StatCardProps["variant"]>, string> = {
  default: "border-border",
  success: "border-green-200 dark:border-green-900",
  warning: "border-yellow-200 dark:border-yellow-900",
  danger: "border-red-200 dark:border-red-900",
};

const iconStyles: Record<NonNullable<StatCardProps["variant"]>, string> = {
  default: "text-foreground",
  success: "text-green-600 dark:text-green-400",
  warning: "text-yellow-600 dark:text-yellow-400",
  danger: "text-red-600 dark:text-red-400",
};

export function StatCard({
  label,
  value,
  icon: Icon,
  variant = "default",
  description,
}: StatCardProps) {
  return (
    <Card
      className={cn(
        "transition-colors hover:border-muted-foreground/20",
        variantStyles[variant],
      )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-4 sm:pt-6">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {label}
        </CardTitle>
        <Icon className={cn("h-4 w-4 shrink-0", iconStyles[variant])} />
      </CardHeader>
      <CardContent className="pb-4 sm:pb-6">
        <div className="text-xl font-bold tabular-nums sm:text-2xl">{value}</div>
        {description && (
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}

