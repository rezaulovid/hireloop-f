// TODO: replace with real backend wiring (e.g. `GET /jobs`).
import type { JobRow } from "@/lib/types"
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

/** Filter params for `GET /jobs`, sent as the query string (mirrors searchParams). */
export type JobsQuery = Record<string, string | string[] | undefined>

/** `{ keywords: "design", isRemote: ["true"] }` → `?keywords=design&isRemote=true`. */
const buildQueryString = (params?: JobsQuery) => {
    if (!params) return ""
    const search = new URLSearchParams()
    for (const [key, value] of Object.entries(params)) {
        if (value === undefined) continue
        for (const v of Array.isArray(value) ? value : [value]) {
            search.append(key, v)
        }
    }
    const qs = search.toString()
    return qs ? `?${qs}` : ""
}

export const getJobs = async (params?: JobsQuery): Promise<JobRow[]> => {
    let res: Response
    try {
        res = await fetch(`${BASE_URL}/jobs${buildQueryString(params)}`)
    } catch (error) {
        // Node/undici surfaces unreachable hosts as `TypeError: fetch failed`.
        // Re-throw with actionable context so the route error boundary can show it.
        throw new Error(
            `Could not reach the jobs API at ${BASE_URL}/jobs — is the backend running?`,
            { cause: error },
        )
    }

    if (!res.ok) {
        throw new Error(`Jobs API responded with ${res.status} ${res.statusText}`)
    }

    return res.json()
}
