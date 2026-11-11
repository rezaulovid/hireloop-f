"use client"

import * as React from "react"

import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "cn"
import { inputClass } from "@/lib/styles"

export type FilterOption = { label: string; value: string }

function FilterSelect({
  label,
  options,
  placeholder = "Any",
  onChange,
  className,
  inline = false,
}: {
  label: string
  options: FilterOption[]
  placeholder?: string
  onChange?: (value: string) => void
  className?: string
  /** Inline layout ("label + compact trigger"), e.g. the results "Sort by:" control. */
  inline?: boolean
}) {
  const id = React.useId()

  const select = (
    <Select<string> onValueChange={(value) => onChange?.(value ?? "")}>
      <SelectTrigger
        id={id}
        className={cn(
          inputClass,
          "text-white",
          inline ? "h-8 w-auto rounded-lg" : "w-full"
        )}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )

  if (inline) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <Label htmlFor={id} className="text-xs font-normal text-white/50">
          {label}
        </Label>
        {select}
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Label htmlFor={id}>{label}</Label>
      {select}
    </div>
  )
}

export { FilterSelect }
