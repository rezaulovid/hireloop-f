"use client"

// Search bar for the Browse Jobs page — mirrors the Figma
// "Section - Search & Quick Filters".
//
// Submitting navigates to /browse-jobs?search=<term>; the page already
// forwards its search params into getJobs, so backend filtering picks it up.

import { useRouter } from "next/navigation"
import { buttonVariants } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { inputClass } from "@/lib/styles"
import { Search } from "lucide-react"

export function JobSearchBar() {
    const router = useRouter()

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const formData = new FormData(event.currentTarget)
        const data = Object.fromEntries(formData.entries())

        const params = new URLSearchParams()
        params.set("search", String(data.searchField ?? ""))
        router.push(`/browse-jobs?${params.toString()}`)
    }

    return (
        <form onSubmit={handleSubmit} role="search" className="w-full">
            <Card className="flex flex-col gap-3 p-6 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                    <Search
                        aria-hidden
                        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#8E9192]"
                    />
                    <Input
                        name="searchField"
                        aria-label="Search jobs"
                        placeholder="Search by job title, keywords..."
                        className={cn(
                            inputClass,
                            "h-12 w-full pr-3 pl-10 text-sm text-[#EDEDEF] placeholder:text-[#A0A0AB]"
                        )}
                    />
                </div>
                <button
                    type="submit"
                    className={cn(buttonVariants(), "bg-white text-[#2F3131] hover:bg-white/90 sm:h-12")}
                >
                    Search Jobs
                </button>
            </Card>
        </form>
    )
}
