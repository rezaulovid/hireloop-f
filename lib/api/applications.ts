// Data-access module for the applications API (Express on :5000).
// Follows the `lib/api/jobs.ts` pattern.

import type { ApplicationFormData, ApplicationRow } from "@/lib/types"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

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

// GET /applications?userId=… — application rows for a seeker.
export const getApplications = async (query = ""): Promise<ApplicationRow[]> => {
    const path = query ? `/applications?${query}` : "/applications"
    const res = await request(path)
    if (!res.ok) {
        throw new Error(`Applications API responded with ${res.status} ${res.statusText}`)
    }
    return parseJson<ApplicationRow[]>(res, path)
}

export const createApplication = async (data: ApplicationFormData) => {
    const res = await request("/applications", {
        method: "POST",
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify(data),
    })
    if (!res.ok) {
        throw new Error(`Applications API responded with ${res.status} ${res.statusText}`)
    }
    return parseJson<{ insertedId?: string; alreadyApplied?: boolean }>(res, "/applications")
}
