"use client"

// Recruiter view of the people who applied to one job: a searchable,
// status-filterable table where each row's status can be changed inline.
//
// The status update is intentionally local for now. When the API gains
// `PATCH /applications/:id/status`, call it from `handleStatusChange` and
// reconcile the row with the server response.

import { useMemo, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Search, Users } from "lucide-react"

import { ApplicationStatusSelect } from "@/components/applications/application-status-select"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { toast } from "@/components/ui/toast"
import {
    APPLICATION_STATUS_META,
    APPLICATION_STATUS_OPTIONS,
    formatApplicantName,
    getApplicantInitials,
} from "@/lib/applications"
import { formatDate, formatRelativeTime } from "@/lib/format"
import { inputClass, typePillClass } from "@/lib/styles"
import type { ApplicationStatus, JobApplicationRow, JobRow } from "@/lib/types"
import { cn } from "@/lib/utils"

type StatusFilter = ApplicationStatus | "all"

const STATUS_FILTER_OPTIONS: ReadonlyArray<{ value: StatusFilter; label: string }> = [
    { value: "all", label: "All statuses" },
    ...APPLICATION_STATUS_OPTIONS,
]

const headingClass = "px-3 py-3.5 text-xs font-medium tracking-wide text-white/50 uppercase"
const cellClass = "px-3 py-3.5"

/** Newest applications first — the order a recruiter reviews them in. */
const byNewest = (a: JobApplicationRow, b: JobApplicationRow) =>
    Date.parse(b.appliedAt) - Date.parse(a.appliedAt)

export function ApplicationsBoard({
    job,
    applications: initialApplications,
}: {
    job: JobRow
    applications: readonly JobApplicationRow[]
}) {
    const [applications, setApplications] = useState<JobApplicationRow[]>([
        ...initialApplications,
    ])
    const [query, setQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")

    const filtered = useMemo(() => {
        const needle = query.trim().toLowerCase()

        return [...applications].sort(byNewest).filter((application) => {
            const matchesStatus =
                statusFilter === "all" || application.status === statusFilter
            const matchesQuery =
                needle.length === 0 ||
                application.email.toLowerCase().includes(needle) ||
                formatApplicantName(application.email).toLowerCase().includes(needle)

            return matchesStatus && matchesQuery
        })
    }, [applications, query, statusFilter])

    const awaitingReview = applications.filter(
        (application) => application.status === "applied",
    ).length

    const handleStatusChange = (applicationId: string, status: ApplicationStatus) => {
        setApplications((current) =>
            current.map((application) =>
                application._id === applicationId ? { ...application, status } : application,
            ),
        )

        // TODO: persist the change once the status endpoint exists, e.g.
        // await updateApplicationStatus(applicationId, status)
        toast.add({
            title: `Marked as ${APPLICATION_STATUS_META[status].label.toLowerCase()}`,
            description: "Status changes are not saved yet.",
        })
    }

    const clearFilters = () => {
        setQuery("")
        setStatusFilter("all")
    }

    return (
        <div>
            {/* Breadcrumb */}
            <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-white/50">
                <Link href="/dashboard/recruiter/jobs" className="transition-colors hover:text-white">
                    Manage Jobs
                </Link>
                <span aria-hidden className="text-white/30">
                    /
                </span>
                <span className="max-w-[240px] truncate text-white/70">{job.title}</span>
                <span aria-hidden className="text-white/30">
                    /
                </span>
                <span className="text-white/90">Applications</span>
            </nav>

            {/* Page heading + job context */}
            <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
                <div className="flex min-w-0 items-start gap-4">
                    <span
                        aria-hidden
                        className="hidden size-12 shrink-0 items-center justify-center rounded-xl bg-[#5C53FE]/15 text-lg font-semibold text-[#8B85FF] sm:flex"
                    >
                        {job.title.charAt(0)}
                    </span>

                    <div className="min-w-0">
                        <h1 className="font-heading text-[28px] leading-[1.15] font-bold tracking-[-0.02em] text-white">
                            Applications
                        </h1>
                        <p className="mt-1 text-sm text-white/60">
                            Review and update applicants for{" "}
                            <span className="text-white/90">{job.title}</span> at{" "}
                            <span className="text-white/90">{job.companyName}</span>.
                        </p>

                        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-white/50">
                            <span className={typePillClass}>{job.category}</span>
                            <span className={cn(typePillClass, "capitalize")}>{job.jobType}</span>
                            <span>
                                {job.isRemote ? `Remote (${job.location})` : job.location}
                            </span>
                            <span aria-hidden className="size-1 rounded-full bg-white/30" />
                            <span>
                                {awaitingReview} of {applications.length} awaiting review
                            </span>
                        </div>
                    </div>
                </div>

                <Link
                    href="/dashboard/recruiter/jobs"
                    className="inline-flex h-9 items-center gap-2 rounded-lg border border-white/10 bg-[#1A1A1F] px-3 text-[13px] font-medium text-white/70 transition-colors hover:border-white/25 hover:text-white"
                >
                    <ArrowLeft aria-hidden className="size-4" />
                    Back to jobs
                </Link>
            </header>

            {/* Applicants table */}
            <Card className="overflow-hidden">
                {/* Toolbar: search + status filter + result count */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
                    <div className="flex flex-1 flex-wrap items-center gap-3">
                        <div className="relative w-full max-w-xs">
                            <Search
                                aria-hidden
                                className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-white/40"
                            />
                            <Input
                                type="search"
                                value={query}
                                onChange={(event) => setQuery(event.target.value)}
                                placeholder="Search by name or email…"
                                aria-label="Search applicants"
                                className={cn(inputClass, "h-9 pl-9")}
                            />
                        </div>

                        <Select<StatusFilter>
                            value={statusFilter}
                            items={STATUS_FILTER_OPTIONS}
                            onValueChange={(next) => setStatusFilter(next ?? "all")}
                        >
                            <SelectTrigger
                                aria-label="Filter by status"
                                className={cn(inputClass, "h-9 w-[164px] text-white/80")}
                            >
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {STATUS_FILTER_OPTIONS.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <p className="text-xs text-white/50" aria-live="polite">
                        Showing {filtered.length} of {applications.length} applicants
                    </p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b border-white/10">
                                <th scope="col" className={cn(headingClass, "px-5")}>
                                    Applicant
                                </th>
                                <th scope="col" className={cn(headingClass, "w-[180px]")}>
                                    Applied
                                </th>
                                <th
                                    scope="col"
                                    className={cn(headingClass, "w-[188px] px-5 text-right")}
                                >
                                    Status
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {filtered.map((application) => {
                                const applicantName = formatApplicantName(application.email)

                                return (
                                    <tr
                                        key={application._id}
                                        className="border-b border-white/5 transition-colors last:border-b-0 hover:bg-white/[0.03]"
                                    >
                                        {/* Applicant identity */}
                                        <td className={cn(cellClass, "px-5")}>
                                            <div className="flex items-center gap-3">
                                                <span
                                                    aria-hidden
                                                    className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#5C53FE]/15 text-xs font-semibold text-[#8B85FF]"
                                                >
                                                    {getApplicantInitials(application.email)}
                                                </span>
                                                <div className="min-w-0">
                                                    <p className="truncate font-medium text-[#EDEDEF]">
                                                        {applicantName}
                                                    </p>
                                                    <p className="truncate text-xs text-white/50">
                                                        {application.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Applied date */}
                                        <td className={cellClass}>
                                            <div className="flex flex-col whitespace-nowrap">
                                                <span className="text-[#EDEDEF]">
                                                    {formatRelativeTime(application.appliedAt)}
                                                </span>
                                                <span className="text-xs text-white/50">
                                                    {formatDate(application.appliedAt)}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Status: the select doubles as the colored status chip */}
                                        <td className={cn(cellClass, "px-5")}>
                                            <div className="flex justify-end">
                                                <ApplicationStatusSelect
                                                    value={application.status}
                                                    onValueChange={(status) =>
                                                        handleStatusChange(application._id, status)
                                                    }
                                                    aria-label={`Update status for ${applicantName}`}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}

                            {/* Empty states: no applicants at all vs. no filter matches */}
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="px-5 py-14 text-center">
                                        <Users
                                            aria-hidden
                                            className="mx-auto mb-3 size-6 text-white/25"
                                        />
                                        <p className="text-sm text-white/60">
                                            {applications.length === 0
                                                ? "No one has applied to this job yet."
                                                : "No applicants match your filters."}
                                        </p>
                                        {applications.length > 0 ? (
                                            <button
                                                type="button"
                                                onClick={clearFilters}
                                                className="mt-2 text-xs font-medium text-[#8B85FF] transition-colors hover:text-white"
                                            >
                                                Clear filters
                                            </button>
                                        ) : null}
                                    </td>
                                </tr>
                            ) : null}
                        </tbody>
                    </table>
                </div>

                <div className="border-t border-white/10 px-5 py-3 text-xs text-white/40">
                    Status changes are kept on this page until the applications API is
                    connected.
                </div>
            </Card>
        </div>
    )
}
