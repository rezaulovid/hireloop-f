"use client"

import { useRouter } from "next/navigation"
import { BookmarkIcon, ClockIcon, FlameIcon } from "lucide-react"

import { Card } from "@/components/ui/card"
import { cn } from "cn"
import type { JobRow } from "@/lib/types"

const pillClass =
  "inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-[#1A1A1F] px-2.5 py-1 text-xs font-medium text-white/70 capitalize"

/** Placeholder heuristic for the amber "Hot Job" pill until real flagging exists. */
const HOT_JOB_MIN_APPLICANTS = 100

function JobCard({ job }: { job: JobRow }) {
  const router = useRouter()

  /** Whole-card click target → the job's details page under /browse-jobs. */
  const handleViewJobDetail = (jobId: string) => {
    router.push(`/browse-jobs/${jobId}`)
  }

  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={() => handleViewJobDetail(job._id)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault()
          handleViewJobDetail(job._id)
        }
      }}
      className="cursor-pointer p-4 transition-colors hover:border-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5C53FE]/60 sm:p-5"
    >
      <div className="flex items-start gap-4">
        {/* Company logo placeholder — initial until logos exist in the data */}
        <span
          aria-hidden
          className="flex size-12 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-[#1A1A1F] text-base font-semibold text-[#8B85FF]"
        >
          {job.companyName.charAt(0).toUpperCase()}
        </span>

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-[15px] font-semibold text-white">{job.title}</h3>
          <p className="mt-1 truncate text-xs text-white/50">
            {job.companyName} • {job.isRemote ? `${job.location} (Remote)` : job.location}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className={pillClass}>
              <ClockIcon aria-hidden className="size-3.5 text-white/50" />
              {job.jobType}
            </span>
            {job.applicants >= HOT_JOB_MIN_APPLICANTS && (
              <span
                className={cn(
                  pillClass,
                  "border-amber-500/30 bg-amber-500/10 text-amber-400"
                )}
              >
                <FlameIcon aria-hidden className="size-3.5" />
                Hot Job
              </span>
            )}
          </div>
        </div>

        <button
          type="button"
          aria-label={`Save ${job.title}`}
          onClick={(event) => {
            // Bookmark is independent — must not trigger the card navigation.
            event.stopPropagation()
            /* TODO: wire saving later */
          }}
          className="rounded-md p-1.5 text-white/40 transition-colors hover:bg-white/5 hover:text-white"
        >
          <BookmarkIcon aria-hidden className="size-4" />
        </button>
      </div>
    </Card>
  )
}

export { JobCard }
