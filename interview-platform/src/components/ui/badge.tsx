import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        destructive: "border-transparent bg-destructive text-destructive-foreground",
        outline: "text-foreground",
        success: "border-transparent bg-[hsl(var(--status-live))] text-white",
        scheduled: "border-[hsl(var(--status-scheduled))]/30 bg-[hsl(var(--status-scheduled))]/10 text-[hsl(var(--status-scheduled))]",
        live: "border-[hsl(var(--status-live))]/30 bg-[hsl(var(--status-live))]/10 text-[hsl(var(--status-live))]",
        completed: "border-[hsl(var(--status-completed))]/30 bg-[hsl(var(--status-completed))]/10 text-[hsl(var(--status-completed))]",
        cancelled: "border-[hsl(var(--status-cancelled))]/30 bg-[hsl(var(--status-cancelled))]/10 text-[hsl(var(--status-cancelled))]",
      },
    },
    defaultVariants: { variant: "default" },
  }
);