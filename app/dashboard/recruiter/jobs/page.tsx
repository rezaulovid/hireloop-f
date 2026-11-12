import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Eye, Pencil, Plus, Users } from "lucide-react"
import type { JobRow, JobStatus } from "@/lib/types"
import { getJobs } from "@/lib/api/jobs"
import { DeleteJobDialog } from "@/app/components/DeleteJobDialog"
import { Card } from "@/components/ui/card"
import { typePillClass } from "@/lib/styles"

/** "2025-05-30" → "May 30, 2025". Fixed en-US so SSR and client agree. */
const formatDeadline = (deadline: string) =>
    new Date(deadline).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })

const badgeClass =
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize"
const statusStyles: Record<JobStatus, string> = {
    active: "border-emerald-400/30 bg-emerald-400/15 text-emerald-300",
    expired: "border-white/10 bg-white/5 text-white/50",
}

const iconButtonClass =
    "flex size-8 items-center justify-center rounded-md border border-white/10 bg-[#1A1A1F] text-white/60 transition-colors hover:border-white/25 hover:text-white"

// Responsive column visibility — shared by <th> and <td> so they always agree.
const cellVis = {
    company: "hidden md:table-cell",
    type: "hidden lg:table-cell",
    applicants: "hidden lg:table-cell",
    deadline: "hidden lg:table-cell",
} satisfies Record<string, string>

const headingClass = "px-3 py-3.5 text-xs font-medium tracking-wide text-white/50 uppercase"
const cellClass = "px-3 py-3.5"

export default async function RecruiterJobsPage() {
    
    const jobs: JobRow[] = await getJobs();
    console.log("jobs data", jobs) // wire to backend fetch later

    return (
        <div className="mx-auto w-full max-w-6xl px-4 py-8">
            {/* Breadcrumb */}
            <nav className="mb-6 flex items-center gap-2 text-sm">
                <span className="text-black/50">Manage Jobs</span>
                <span aria-hidden className="text-black/30">/</span>
                <span className="text-black/90">Job Listings &amp; Postings</span>
            </nav>

            {/* Page heading + primary action */}
            <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
                <div className="flex flex-col gap-1.5">
                    <h1 className="font-heading text-[28px] leading-[1.15] font-bold tracking-[-0.02em] text-black">
                        Manage Job Posts
                    </h1>
                    <p className="text-sm text-black/60">
                        Review live listings, monitor applicants, and update job details
                        across your organization.
                    </p>
                </div>
                <Link
                    href="/dashboard/recruiter/jobs/new"
                    className={cn(buttonVariants(), "bg-[#5C53FE] hover:bg-[#7B74FF]")}
                >
                    <Plus aria-hidden />
                    New Job Post
                </Link>
            </header>

            {/* Postings table — columns collapse away on smaller screens instead of scrolling */}
            <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="table-fixed w-full text-left text-sm">
                        <thead>
                            <tr className="border-b border-white/10">
                                <th scope="col" className={cn(headingClass, "px-5", "lg:w-[20%]")}>
                                    Job title &amp; dept
                                </th>
                                <th scope="col" className={cn(headingClass, cellVis.company, "lg:w-[16%]")}>
                                    Company &amp; location
                                </th>
                                <th scope="col" className={cn(headingClass, cellVis.type, "lg:w-[9%]")}>
                                    Type
                                </th>
                                <th scope="col" className={cn(headingClass, cellVis.applicants, "lg:w-[12%]")}>
                                    Applicants
                                </th>
                                <th scope="col" className={cn(headingClass, "lg:w-[9%]")}>
                                    Status
                                </th>
                                <th scope="col" className={cn(headingClass, cellVis.deadline, "lg:w-[11%]")}>
                                    Deadline
                                </th>
                                <th scope="col" className={cn(headingClass, "px-5", "lg:w-[11%]")}>
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {jobs.map((job) => (
                                <tr
                                    key={job._id}
                                    className="border-b border-white/5 transition-colors last:border-b-0 hover:bg-white/[0.03]"
                                >
                                    {/* Job title & dept */}
                                    <td className={cn(cellClass, "px-5")}>
                                        <div className="flex items-center gap-3">
                                            <span
                                                className="hidden size-10 shrink-0 items-center justify-center rounded-lg bg-[#5C53FE]/15 text-sm font-semibold text-[#8B85FF] sm:flex"
                                                aria-hidden
                                            >
                                                {job.title.charAt(0)}
                                            </span>
                                            <div className="flex min-w-0 flex-col">
                                                <span className="truncate font-medium text-[#EDEDEF]">
                                                    {job.title}
                                                </span>
                                                <span className="truncate text-xs text-white/50">
                                                    {job.category}
                                                </span>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Company & location */}
                                    <td className={cn(cellClass, cellVis.company)}>
                                        <div className="flex min-w-0 flex-col">
                                            <span className="truncate text-[#EDEDEF]">{job.companyName}</span>
                                            <span className="truncate text-xs text-white/50">
                                                {job.isRemote ? `Remote (${job.location})` : job.location}
                                            </span>
                                        </div>
                                    </td>

                                    {/* Type */}
                                    <td className={cn(cellClass, cellVis.type)}>
                                        <span className={typePillClass}>{job.jobType}</span>
                                    </td>

                                    {/* Applicants */}
                                    <td className={cn(cellClass, cellVis.applicants)}>
                                        <span className="flex items-center gap-2 whitespace-nowrap text-white/80">
                                            <Users aria-hidden className="size-4 text-white/40" />
                                            {job.applicants} candidates
                                        </span>
                                    </td>

                                    {/* Status */}
                                    <td className={cellClass}>
                                        <span className={cn(badgeClass, statusStyles[job.status])}>
                                            {job.status}
                                        </span>
                                    </td>

                                    {/* Deadline */}
                                    <td className={cn(cellClass, cellVis.deadline)}>
                                        <div className="flex flex-col whitespace-nowrap">
                                            <span className="text-[#EDEDEF]">{formatDeadline(job.deadline)}</span>
                                            <span className="text-xs text-white/50">{job.posted}</span>
                                        </div>
                                    </td>

                                    {/* Actions */}
                                    <td className={cn(cellClass, "px-5")}>
                                        <div className="flex items-center gap-1">
                                            <button
                                                type="button"
                                                aria-label={`View ${job.title}`}
                                                className={iconButtonClass}
                                            >
                                                <Eye aria-hidden className="size-4" />
                                            </button>
                                            <button
                                                type="button"
                                                aria-label={`Edit ${job.title}`}
                                                className={iconButtonClass}
                                            >
                                                <Pencil aria-hidden className="size-4" />
                                            </button>
                                            <DeleteJobDialog job={job}></DeleteJobDialog>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    )
}