"use client"

import { CheckIcon } from "lucide-react"

import { Card } from "@/components/ui/card"
import { cn } from "cn"

export type JobTypeOption = {
  label: string
  value: string
  /** Display count derived from the current job list (e.g. 1234 → "1.2k"). */
  count: number
}

/** 1234 → "1.2k" */
const formatCount = (count: number) =>
  count >= 1000
    ? `${(count / 1000).toFixed(1).replace(/\.0$/, "")}k`
    : `${count}`

function FilterCheckbox({ option }: { option: JobTypeOption }) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5">
      <input
        type="checkbox"
        className="peer sr-only"
        onChange={() => { /* TODO: wire filtering later */ }}
      />
      {/* Custom box — checked state is pure CSS via the peer, no React state. */}
      <span
        aria-hidden
        className="flex size-4 shrink-0 items-center justify-center rounded border border-white/15 bg-[#1A1A1F] transition-colors peer-checked:border-white peer-checked:bg-white peer-checked:[&>svg]:opacity-100 peer-focus-visible:ring-2 peer-focus-visible:ring-[#5C53FE]/60"
      >
        <CheckIcon className="size-3 text-[#03030d] opacity-0" />
      </span>
      <span className="text-sm text-white/80 transition-colors peer-checked:text-white">
        {option.label}
      </span>
      <span className="ml-auto text-xs text-white/40">{formatCount(option.count)}</span>
    </label>
  )
}

/**
 * "Filters" card shown next to the results (Job Type checkboxes with counts).
 * Checkboxes toggle locally only — no filtering/URL logic yet.
 */
function FilterSidebar({
  jobTypeOptions,
  className,
}: {
  jobTypeOptions: JobTypeOption[]
  className?: string
}) {
  return (
    <Card className={cn("h-fit p-5", className)}>
      <p className="text-base font-semibold text-white">Filters</p>

      <p className="mt-4 text-[13px] font-medium text-white/90">Job Type</p>
      <div className="mt-2.5 flex flex-col gap-2.5">
        {jobTypeOptions.map((option) => (
          <FilterCheckbox key={option.value} option={option} />
        ))}
      </div>
    </Card>
  )
}

export { FilterSidebar }
