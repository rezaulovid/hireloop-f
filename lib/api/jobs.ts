// TODO: replace with real backend wiring (e.g. `GET /jobs`).
import type { JobRow } from "@/app/dashboard/recruiter/jobs/page"
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

export const getJobs = async (): Promise<JobRow[]> => {
    const res = await fetch(`${BASE_URL}/jobs`);
    return res.json();
}
