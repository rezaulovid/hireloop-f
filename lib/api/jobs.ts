// TODO: replace with real backend wiring (e.g. `GET /jobs`).
import type { JobRow } from "@/app/dashboard/recruiter/jobs/page"

// Mock listings so the recruiter table renders before the API exists.
const MOCK_JOBS: JobRow[] = [
    {
        _id: "job_001",
        title: "Senior Frontend Engineer",
        companyName: "Acme Inc.",
        category: "Engineering & Tech",
        jobType: "full-time",
        isRemote: true,
        location: "Berlin, Germany",
        deadline: "2026-11-30",
        minSalary: "70",
        maxSalary: "95",
        salaryFrequency: "per hour",
        responsibilities: "Own the web experience end to end.",
        requirements: "5+ years with React and TypeScript.",
        applicants: 23,
        status: "active",
        posted: "Posted 2d ago",
    },
    {
        _id: "job_002",
        title: "Product Designer",
        companyName: "Globex",
        category: "Design",
        jobType: "contract",
        isRemote: false,
        location: "Amsterdam, Netherlands",
        deadline: "2026-11-20",
        minSalary: "45",
        maxSalary: "60",
        salaryFrequency: "per hour",
        responsibilities: "Shape the design system and flows.",
        requirements: "Strong portfolio in B2B SaaS.",
        applicants: 11,
        status: "active",
        posted: "Posted 4d ago",
    },
    {
        _id: "job_003",
        title: "Marketing Lead",
        companyName: "Initech",
        category: "Marketing",
        jobType: "part-time",
        isRemote: false,
        location: "Lisbon, Portugal",
        deadline: "2026-10-01",
        minSalary: "3000",
        maxSalary: "4200",
        salaryFrequency: "per month",
        responsibilities: "Own acquisition channels.",
        requirements: "3+ years in growth marketing.",
        applicants: 8,
        status: "expired",
        posted: "Posted 21d ago",
    },
]

export async function getJobs(): Promise<JobRow[]> {
    return MOCK_JOBS
}
