"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { SearchBar } from "@/app/components/SearchBar"

/**
 * Full-width search panel: icon input + "Search Jobs" button.
 * Handlers are intentionally empty — search wiring lands later.
 */
function JobSearchPanel() {
  return (
    <Card className="flex flex-col gap-3 p-2.5 sm:flex-row sm:items-center">
      <SearchBar onChange={() => { /* TODO: wire search later */ }} />
      <Button
        type="button"
        onClick={() => { /* TODO: wire search later */ }}
        className="h-10 shrink-0 rounded-lg bg-white px-5 font-medium text-[#03030d] hover:bg-white/90"
      >
        Search Jobs
      </Button>
    </Card>
  )
}

export { JobSearchPanel }
