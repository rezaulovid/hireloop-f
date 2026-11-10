"use server"

// TODO: replace these stubs with real backend wiring (e.g. `POST /jobs`).
// The shapes mirror what the recruiter pages expect so callers keep working
// once the actual API is connected.

type JobInput = {
    title: string
    companyName: string
    category: string
    jobType: "full-time" | "part-time" | "contract" | "internship"
    isRemote: boolean
    location: string
    deadline: string
    minSalary: string
    maxSalary: string
    salaryFrequency: string
    responsibilities: string
    requirements: string
}

export async function createJob(data: JobInput) {
    console.log("createJob stub — job data not persisted:", data)

    return {
        success: true as const,
        id: crypto.randomUUID(),
        data,
    }
}

export async function deleteJob(id: string) {
    console.log("deleteJob stub — job not deleted:", id)

    // Mongo-style response so callers checking `deletedCount` keep working.
    return { deletedCount: 1, id }
}
