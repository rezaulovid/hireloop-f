// Sidebar filters for the Browse Jobs page — from the Figma
// "Aside - Sidebar Filters" (labels 13px #A0A0AB, counts #6E6E78,
// filter groups stacked in one dark card).
//
// Job Type and Job Category are single-select (radio inputs); Work
// Arrangement is a multi-select checkbox. Counts are computed at render
// from the current job list. Selection only flips visually — no query
// params, no list filtering (wired up separately).

import { Card } from "@/components/ui/card"
import { FilterChecklist, type FilterOption } from "@/components/shared/filter-checklist"
import type { JobRow } from "@/lib/types"

type OptionSeed = { value: string; label: string }

/** Mirrors the JobType union values (lib/types.ts), with Figma display labels. */
const JOB_TYPES: OptionSeed[] = [
    { value: "full-time", label: "Full-time" },
    { value: "part-time", label: "Part-Time" },
    { value: "contract", label: "Contract" },
    { value: "internship", label: "Internship" },
]

/** Mirrors the "Post a New Job" form category options. */
const JOB_CATEGORIES: OptionSeed[] = [
    { value: "Engineering & Tech", label: "Engineering & Tech" },
    { value: "Design", label: "Design" },
    { value: "Product", label: "Product" },
    { value: "Marketing", label: "Marketing" },
    { value: "Infrastructure", label: "Infrastructure" },
    { value: "Quality", label: "Quality" },
]

/** Job counts per facet, mirrored in the Figma sidebar ("Full-time  1.2k"). */
const countOptions = (
    facet: (job: JobRow) => string,
    allOptions: readonly OptionSeed[],
    jobs: readonly JobRow[],
): FilterOption[] =>
    allOptions.map(({ value, label }) => ({
        value,
        label,
        count: jobs.filter((job) => facet(job) === value).length,
    }))

export function JobFiltersPanel({ jobs }: { jobs: readonly JobRow[] }) {
    return (
        <Card className="p-6">
            <h2 className="text-[22px] font-semibold tracking-[-0.02em] text-[#EDEDEF]">Filters</h2>

            <div className="mt-7 flex flex-col gap-6">
                <FilterChecklist
                    legend="Job Type"
                    name="jobType"
                    multiple={false}
                    options={countOptions((job) => job.jobType, JOB_TYPES, jobs)}
                />
                <FilterChecklist
                    legend="Job Category"
                    name="category"
                    multiple={false}
                    options={countOptions((job) => job.category, JOB_CATEGORIES, jobs)}
                />
                <FilterChecklist
                    legend="Work Arrangement"
                    name="isRemote"
                    multiple
                    options={[
                        {
                            value: "remote",
                            label: "Remote only",
                            count: jobs.filter((job) => job.isRemote).length,
                        },
                    ]}
                />
            </div>
        </Card>
    )
}
