// Validation for the job application payload.
//
// The same rules are enforced twice: here (before the request leaves the
// browser, so the user gets instant feedback) and by the applications API
// (the source of truth). Keep both in sync — the field list mirrors the
// `applications` collection schema.

import type { ApplicationStatus, JobApplication, JobType } from "@/lib/types"

export const JOB_TYPES: JobType[] = ["full-time", "part-time", "contract", "internship"]

export const APPLICATION_STATUSES: ApplicationStatus[] = [
    "applied",
    "reviewed",
    "shortlisted",
    "interview",
    "offered",
    "rejected",
    "hired",
]

export type ValidationResult =
    | { ok: true; data: JobApplication }
    | { ok: false; errors: string[] }

const isNonEmptyString = (value: unknown): value is string =>
    typeof value === "string" && value.trim().length > 0

const isIsoDate = (value: unknown): value is string =>
    isNonEmptyString(value) && !Number.isNaN(Date.parse(value))

const isEmail = (value: unknown): value is string =>
    isNonEmptyString(value) && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())

/**
 * Checks a raw payload and returns either the normalized application or the
 * list of problems. Unknown keys are dropped so nothing unvalidated reaches
 * the database.
 */
export const validateJobApplication = (input: unknown): ValidationResult => {
    const errors: string[] = []

    if (typeof input !== "object" || input === null) {
        return { ok: false, errors: ["Application payload must be an object"] }
    }

    const payload = input as Record<string, unknown>

    if (!isNonEmptyString(payload.jobId)) errors.push("jobId is required")
    if (!isNonEmptyString(payload.userId)) errors.push("userId is required")
    if (!isEmail(payload.email)) errors.push("A valid email is required")
    if (!isNonEmptyString(payload.jobTitle)) errors.push("jobTitle is required")
    if (!isNonEmptyString(payload.companyName)) errors.push("companyName is required")
    if (!isNonEmptyString(payload.category)) errors.push("category is required")
    if (!isNonEmptyString(payload.location)) errors.push("location is required")

    if (!JOB_TYPES.includes(payload.jobType as JobType)) {
        errors.push(`jobType must be one of: ${JOB_TYPES.join(", ")}`)
    }

    if (typeof payload.isRemote !== "boolean") errors.push("isRemote must be a boolean")

    // The job form allows jobs without a deadline, so an empty value is valid.
    if (
        payload.deadline !== "" &&
        payload.deadline !== undefined &&
        !isIsoDate(payload.deadline)
    ) {
        errors.push("deadline must be a valid date")
    }

    if (!isIsoDate(payload.appliedAt)) errors.push("appliedAt must be a valid ISO date")

    if (!APPLICATION_STATUSES.includes(payload.status as ApplicationStatus)) {
        errors.push(`status must be one of: ${APPLICATION_STATUSES.join(", ")}`)
    }

    if (typeof payload.archived !== "boolean") errors.push("archived must be a boolean")

    if (errors.length > 0) return { ok: false, errors }

    return {
        ok: true,
        data: {
            jobId: (payload.jobId as string).trim(),
            userId: (payload.userId as string).trim(),
            email: (payload.email as string).trim(),
            jobTitle: (payload.jobTitle as string).trim(),
            companyName: (payload.companyName as string).trim(),
            category: (payload.category as string).trim(),
            jobType: payload.jobType as JobType,
            isRemote: payload.isRemote as boolean,
            location: (payload.location as string).trim(),
            deadline: typeof payload.deadline === "string" ? payload.deadline : "",
            appliedAt: payload.appliedAt as string,
            status: payload.status as ApplicationStatus,
            archived: payload.archived as boolean,
        },
    }
}
