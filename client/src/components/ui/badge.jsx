import * as React from "react"
import { cva } from "class-variance-authority"

import { cn } from "../../utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-brand-primary text-white hover:bg-brand-dark",
        secondary:
          "border-transparent bg-slate-100 text-slate-900 hover:bg-slate-200",
        destructive:
          "border-transparent bg-status-danger text-white hover:bg-status-danger/80",
        outline: "text-slate-950",
        success:
          "border-transparent bg-status-success text-white hover:bg-status-success/80",
        warning:
          "border-transparent bg-status-warning text-white hover:bg-status-warning/80",
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
