"use client";

import { cn } from "@/lib/utils";
import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: LucideIcon;
  variant?: "default" | "success" | "warning" | "critical";
}

export function StatCard({
  title,
  value,
  change,
  changeLabel = "from last period",
  icon: Icon,
  variant = "default",
}: StatCardProps) {
  const getTrendIcon = () => {
    if (change === undefined || change === 0) return Minus;
    return change > 0 ? TrendingUp : TrendingDown;
  };

  const TrendIcon = getTrendIcon();

  const variantStyles = {
    default: "border-border",
    success: "border-success/30",
    warning: "border-warning/30",
    critical: "border-critical/30",
  };

  const iconStyles = {
    default: "bg-primary/10 text-primary",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    critical: "bg-critical/10 text-critical",
  };

  return (
    <div
      className={cn(
        "rounded-lg border bg-card p-5 transition-colors hover:border-primary/50",
        variantStyles[variant]
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold text-card-foreground">
            {typeof value === "number" ? value.toLocaleString() : value}
          </p>
        </div>
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-md",
            iconStyles[variant]
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
      {change !== undefined && (
        <div className="mt-3 flex items-center gap-1.5 text-xs">
          <span
            className={cn(
              "flex items-center gap-0.5 font-medium",
              change > 0 ? "text-success" : change < 0 ? "text-critical" : "text-muted-foreground"
            )}
          >
            <TrendIcon className="h-3 w-3" />
            {Math.abs(change)}%
          </span>
          <span className="text-muted-foreground">{changeLabel}</span>
        </div>
      )}
    </div>
  );
}
