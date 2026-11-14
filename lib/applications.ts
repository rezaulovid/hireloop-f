// Application status vocabulary and small presentation helpers.
//
// Shared by both sides of the product: seekers see read-only status pills on
// My Applications, recruiters pick a status from a select on a job's
// applications page. Keeping the labels/colors here keeps the two views in
// sync (and gives the validation module a single source for valid values).

import type { ApplicationStatus } from "@/lib/types"

/**
 * Valid statuses, in review-workflow order. Also used by
 * `lib/validations/application.ts`, so the database contract and the UI can
 * never drift apart.
 */
export const APPLICATION_STATUSES = [
    "applied",
    "reviewed",
    "shortlisted",
    "interview",
    "offered",
    "rejected",
    "hired",
] as const satisfies readonly ApplicationStatus[]

/** Label + accent color for each status, used by pills and selects. */
export const APPLICATION_STATUS_META: Record<
    ApplicationStatus,
    { label: string; color: string }
> = {
    applied: { label: "Applied", color: "#3B82F6" },
    reviewed: { label: "In Review", color: "#F59E0B" },
    shortlisted: { label: "Shortlisted", color: "#22C55E" },
    interview: { label: "Interview", color: "#A855F7" },
    offered: { label: "Offered", color: "#14B8A6" },
    rejected: { label: "Rejected", color: "#EF4444" },
    hired: { label: "Hired", color: "#22C55E" },
}

/**
 * `{ value, label, color }` pairs for Base UI's `<Select items>` prop, so the
 * trigger shows "In Review" instead of the raw `"reviewed"` value.
 */
export const APPLICATION_STATUS_OPTIONS = APPLICATION_STATUSES.map((status) => ({
    value: status,
    label: APPLICATION_STATUS_META[status].label,
    color: APPLICATION_STATUS_META[status].color,
}))

/**
 * The application snapshot stores the applicant's email but not their display
 * name. Turn "jane.doe@example.com" into "Jane Doe" until the API returns the
 * related user record.
 */
export const formatApplicantName = (email: string): string => {
    const [localPart = ""] = email.split("@")
    const words = localPart.split(/[._-]+/).filter(Boolean)

    if (words.length === 0) return "Applicant"

    return words
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
}

/** First two letters of the derived applicant name, for the avatar tile. */
export const getApplicantInitials = (email: string): string => {
    const initials = formatApplicantName(email)
        .split(" ")
        .map((word) => word.charAt(0))
        .join("")
        .slice(0, 2)
        .toUpperCase()

    return initials || "?"
}
