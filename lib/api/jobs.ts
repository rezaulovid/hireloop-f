// TODO: replace with real backend wiring (e.g. `GET /jobs`).
import type { JobRow } from "@/app/dashboard/recruiter/jobs/page"
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

export const getJobs = async (): Promise<JobRow[]> => {
    let res: Response
    try {
        res = await fetch(`${BASE_URL}/jobs`)
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
