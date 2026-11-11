import * as React from "react"

import { cn } from "cn"

/**
 * Dark panel shared across the app (auth card, dashboard sections, tables).
 * No default padding — pass e.g. `p-6` at the call site; classes passed via
 * `className` merge over the base (tailwind-merge), so overrides like a
 * stronger inset shadow work.
 */
function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "rounded-2xl border border-white/10 bg-[#101010]/95 shadow-[inset_0_3px_10px_rgba(255,255,255,0.04)]",
        className
      )}
      {...props}
    />
  )
}

export { Card }
