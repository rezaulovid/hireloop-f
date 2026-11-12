"use server"

import type { JobFormData, JobRow } from "@/lib/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

/** Wraps undici's opaque `TypeError: fetch failed` with actionable context. */
const request = (path: string, init?: RequestInit) =>
    fetch(`${BASE_URL}${path}`, init).catch((error) => {
        throw new Error(
            `Could not reach the jobs API at ${BASE_URL}${path} — is the backend running?`,
            { cause: error },
        )
    })

/** Some backends answer unknown routes with an HTML page (DOCTYPE…) — a bare
 * `res.json()` then dies with `Unexpected token '<'`. Wrap parsing so the
 * failure surfaces with the request path instead. */
const parseJson = async <T>(res: Response, path: string): Promise<T> => {
    try {
        return (await res.json()) as T
    } catch (error) {
        throw new Error(
            `Jobs API at ${BASE_URL}${path} returned a non-JSON body (HTML?) — is the backend route implemented?`,
            { cause: error },
        )
    }
}

export const getJobs = async (query = ''): Promise<JobRow[]> => {
    const res = await request(`/jobs?${query}`)
    if (!res.ok) {
        throw new Error(`Jobs API responded with ${res.status} ${res.statusText}`)
    }
    return parseJson<JobRow[]>(res, `/jobs?${query}`)
}

/** Missing job (HTTP 404) → null, so callers can render notFound(). */
export const getJobById = async (jobId: string): Promise<JobRow | null> => {
    const res = await request(`/jobs/${jobId}`)
    if (res.status === 404) return null
    if (!res.ok) {
        throw new Error(`Jobs API responded with ${res.status} ${res.statusText}`)
    }
    return parseJson<JobRow>(res, `/jobs/${jobId}`)
}

export const createJob = async (data: JobFormData) => {
    const res = await request("/jobs", {
        method: "POST",
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        throw new Error(`Jobs API responded with ${res.status} ${res.statusText}`)
    }
    return parseJson<{ insertedId?: string }>(res, "/jobs");
}

export const deleteJob = async (jobId: string) => {
    const res = await request(`/jobs/${jobId}`, {
        method: 'DELETE'
    });

    if (!res.ok) {
        throw new Error(`Jobs API responded with ${res.status} ${res.statusText}`)
    }

    return parseJson<{ deletedCount?: number }>(res, `/jobs/${jobId}`);
}
