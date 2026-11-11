"use client"

import { SearchIcon } from "lucide-react"

import { Input } from "@/components/ui/input"
import { cn } from "cn"

/**
 * Search input with a leading icon. Transparent background so it can sit
 * inside a Card panel (e.g. the Browse Jobs search bar).
 */
function SearchBar({
  placeholder = "Search by job title, keywords...",
  onChange,
  className,
}: {
  placeholder?: string
  onChange?: (value: string) => void
  className?: string
}) {
  return (
    <div className={cn("relative flex-1", className)}>
      <SearchIcon
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-white/40"
      />
      <Input
        type="search"
        name="keywords"
        placeholder={placeholder}
        onChange={(event) => onChange?.(event.target.value)}
        className="h-10 border-0 bg-transparent pl-9 text-white placeholder:text-white/40 focus-visible:border-0 focus-visible:ring-0"
      />
    </div>
  )
}

export { SearchBar }
