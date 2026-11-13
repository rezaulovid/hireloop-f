"use client"

// Shared dashboard chrome: a small search context (the topbar search filters
// whichever dashboard page opts into it) plus the topbar from the Figma
// "Seeker Portal" screens.

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bell, Mail, Search, X } from "lucide-react"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { useSession } from "@/lib/auth-client"
import { cn } from "cn"

type DashboardSearchValue = {
    query: string
    setQuery: (query: string) => void
}

const DashboardSearchContext = React.createContext<DashboardSearchValue | null>(null)

export function DashboardSearchProvider({ children }: { children: React.ReactNode }) {
    const [query, setQuery] = React.useState("")
    const value = React.useMemo(() => ({ query, setQuery }), [query])

    return (
        <DashboardSearchContext.Provider value={value}>
            {children}
        </DashboardSearchContext.Provider>
    )
}

/** Read the dashboard search query. Safe to call outside the dashboard too. */
export function useDashboardSearch() {
    return (
        React.useContext(DashboardSearchContext) ?? {
            query: "",
            setQuery: () => {},
        }
    )
}

const SEARCH_PLACEHOLDERS: Record<string, string> = {
    "/dashboard/seeker/applications": "Search applications...",
    "/dashboard/seeker/jobs": "Search jobs...",
    "/dashboard/seeker/saved-jobs": "Search saved jobs...",
    "/dashboard/recruiter/jobs": "Search job posts...",
    "/dashboard/admin/users": "Search users...",
}

const iconButtonClass =
    "relative flex size-8 items-center justify-center rounded-lg text-white/55 transition-colors hover:bg-white/[0.06] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5C53FE]/60"

export function DashboardTopbar() {
    const pathname = usePathname()
    const { data: session } = useSession()
    const { query, setQuery } = useDashboardSearch()

    const placeholder = SEARCH_PLACEHOLDERS[pathname] ?? "Search dashboard..."
    const initials =
        session?.user?.name
            ?.split(" ")
            .map((part) => part[0])
            .join("")
            .slice(0, 2)
            .toUpperCase() || "U"

    return (
        <div className="flex h-[60px] shrink-0 items-center gap-3 border-b border-white/[0.07] bg-[#08080a]/95 px-4 sm:px-6">
            <SidebarTrigger className="text-white/60 hover:bg-white/[0.06] hover:text-white md:hidden" />

            <label className="relative block w-full max-w-[300px]" htmlFor="dashboard-search">
                <span className="sr-only">Search dashboard</span>
                <Search
                    aria-hidden
                    className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-white/35"
                />
                <input
                    id="dashboard-search"
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder={placeholder}
                    className="h-9 w-full rounded-lg border border-white/10 bg-[#141416] pr-9 pl-9 text-sm text-[#EDEDEF] outline-none transition-colors placeholder:text-white/35 focus:border-[#5C53FE]/60 focus:ring-3 focus:ring-[#5C53FE]/20 [&::-webkit-search-cancel-button]:appearance-none"
                />
                {query ? (
                    <button
                        type="button"
                        aria-label="Clear search"
                        onClick={() => setQuery("")}
                        className="absolute top-1/2 right-2 flex size-5 -translate-y-1/2 items-center justify-center rounded text-white/40 transition-colors hover:text-white"
                    >
                        <X aria-hidden className="size-3.5" />
                    </button>
                ) : null}
            </label>

            <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
                <button type="button" aria-label="Notifications" className={iconButtonClass}>
                    <Bell aria-hidden className="size-[18px]" />
                    <span
                        aria-hidden
                        className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-[#5C53FE] ring-2 ring-[#08080a]"
                    />
                </button>
                <Link
                    href="/dashboard/seeker/applications"
                    aria-label="Messages"
                    className={cn(iconButtonClass, "hidden sm:flex")}
                >
                    <Mail aria-hidden className="size-[18px]" />
                </Link>

                <span
                    aria-hidden
                    className="mx-1 hidden h-6 w-px bg-white/10 sm:block"
                />

                <Link
                    href="/dashboard/seeker/settings"
                    aria-label="Open profile settings"
                    className="flex size-8 items-center justify-center overflow-hidden rounded-full border border-white/15 bg-[#1A1A1F] text-[11px] font-semibold text-[#CDCBFF] transition-colors hover:border-white/30"
                >
                    {session?.user?.image ? (
                        // eslint-disable-next-line @next/next/no-img-element -- avatar URLs are user-provided
                        <img
                            alt=""
                            src={session.user.image}
                            className="size-full object-cover"
                        />
                    ) : (
                        initials
                    )}
                </Link>
            </div>
        </div>
    )
}
