import * as React from "react"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-sm border px-2 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        destructive: "border-transparent bg-destructive text-destructive-foreground",
        outline: "border-border text-foreground",
        muted: "border-border bg-muted text-muted-foreground",
        accent: "border-accent-border bg-accent-subtle text-accent-strong",
        // Domän: konfidens (mjuka tinter, tema-reaktiva)
        "conf-high": "border-conf-high-border bg-conf-high-bg text-conf-high-fg",
        "conf-medium": "border-conf-medium-border bg-conf-medium-bg text-conf-medium-fg",
        "conf-low": "border-conf-low-border bg-conf-low-bg text-conf-low-fg",
        // Domän: datakvalitet
        "dq-ok": "border-dq-ok-border bg-dq-ok-bg text-dq-ok-fg",
        "dq-stale": "border-dq-stale-border bg-dq-stale-bg text-dq-stale-fg",
        "dq-missing": "border-dq-missing-border bg-dq-missing-bg text-dq-missing-fg",
        "dq-conflict": "border-dq-conflict-border bg-dq-conflict-bg text-dq-conflict-fg",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({ className, variant, ...props }) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
