// Bento info grid — Figma "Bento Info Grid": four quick-fact tiles (icon,
// uppercase 13px label, 16px value) with square #141418 surfaces.
//
// Tile values map to real job fields; salary/experience from the Figma mock
// aren't in the data model, so Category and Deadline take those slots.

import type { LucideIcon } from "lucide-react"
import { Briefcase, Calendar, LayoutGrid, MapPin } from "lucide-react"

import { cn } from "@/lib/utils"
import { detailCardClass } from "@/lib/styles"
import type { JobRow } from "@/lib/types"

/** "2025-05-30" → "May 30, 2025". Fixed en-US so SSR and client agree. */
const formatDeadline = (deadline: string) =>
    new Date(deadline).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })

function Tile({
    icon: Icon,
    label,
    value,
}: {
    icon: LucideIcon
    label: string
    value: string
}) {
    return (
        <div className={cn(detailCardClass, "flex h-[121px] flex-col border p-[25px]")}>
            <Icon aria-hidden className="size-5 text-[#C4C7C8]" />
            <p className="text-[13px] leading-5 text-[#A0A0AB]">{label}</p>
            <p className="mt-1 truncate text-base leading-[27px] text-[#EDEDEF]">{value}</p>
        </div>
    )
}

export function JobHighlights({ job }: { job: JobRow }) {
    return (
        <section aria-label="Job highlights" className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <Tile
                icon={MapPin}
                label="LOCATION"
                value={job.isRemote ? (job.location ? `Remote (${job.location})` : "Remote") : job.location || "—"}
            />
            <Tile icon={Briefcase} label="JOB TYPE" value={job.jobType} />
            <Tile icon={LayoutGrid} label="CATEGORY" value={job.category || "—"} />
            <Tile
                icon={Calendar}
                label="DEADLINE"
                value={job.deadline ? formatDeadline(job.deadline) : "Open until filled"}
            />
        </section>
    )
}
