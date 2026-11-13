// Data-access module for the applications API (Express on :5000).
// Follows the `lib/api/jobs.ts` pattern.

import type { JobApplication, JobApplicationRow } from "@/lib/types"
import { validateJobApplication } from "@/lib/validations/application"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"
// lib/types/applications.ts
/** Wraps undici's opaque `TypeError: fetch failed` with actionable context. */
const request = (path: string, init?: RequestInit) =>
    fetch(`${BASE_URL}${path}`, init).catch((error) => {
        throw new Error(
            `Could not reach the applications API at ${BASE_URL}${path} — is the backend running?`,
            { cause: error },
        )
    })

/** HTML error pages (DOCTYPE…) make a bare `res.json()` die with
 * `Unexpected token '<'` — wrap parsing so the failure has context. */
const parseJson = async <T>(res: Response, path: string): Promise<T> => {
    try {
        return (await res.json()) as T
    } catch (error) {
        throw new Error(
            `Applications API at ${BASE_URL}${path} returned a non-JSON body (HTML?) — is the backend route implemented?`,
            { cause: error },
        )
    }
}

/** Filters supported by `GET /applications`. */
export type ApplicationsQuery = {
    /** Applicant (`userId`) — the seeker who owns the applications. */
    userId?: string
    jobId?: string
    status?: string
    archived?: boolean
}

/** `{ userId: "abc" }` → `?userId=abc`. */
const buildQueryString = (params?: ApplicationsQuery) => {
    if (!params) return ""
    const search = new URLSearchParams()
    for (const [key, value] of Object.entries(params)) {
        if (value === undefined || value === "") continue
        search.append(key, String(value))
    }
    const qs = search.toString()
    return qs ? `?${qs}` : ""
}

// GET /applications?userId=… — application rows for a seeker.
export const getApplications = async (query?: ApplicationsQuery): Promise<JobApplicationRow[]> => {
    const path = `/applications${buildQueryString(query)}`
    const res = await request(path)
    if (!res.ok) {
        throw new Error(`Applications API responded with ${res.status} ${res.statusText}`)
    }
    return parseJson<JobApplicationRow[]>(res, path)
}

// GET /applications/count?applicantId=… — how many applications a seeker has.
// The API names this filter `applicantId`; it maps to the stored `userId`.
export const getApplicationsCount = async (userId: string): Promise<{ count: number }> => {
    const path = `/applications/count?applicantId=${encodeURIComponent(userId)}`
    const res = await request(path)
    if (!res.ok) {
        throw new Error(`Applications API responded with ${res.status} ${res.statusText}`)
    }
    return parseJson<{ count: number }>(res, path)
}



/**
 * POST /applications — saves an application.
 *
 * The payload is validated first (same rules the API applies), so an invalid
 * application never reaches the database.
 */
export const createApplication = async (application: JobApplication) => {
    const validation = validateJobApplication(application)
    if (!validation.ok) {
        throw new Error(`Invalid application — ${validation.errors.join("; ")}`)
    }

    const res = await request("/applications", {
        method: "POST",
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify(validation.data),
    })

    if (!res.ok) {
        const message = await res
            .json()
            .then((body: { error?: string }) => body?.error)
            .catch(() => undefined)
        throw new Error(
            message ?? `Applications API responded with ${res.status} ${res.statusText}`,
        )
    }

    return parseJson<{ insertedId?: string; alreadyApplied?: boolean }>(res, "/applications")
}
