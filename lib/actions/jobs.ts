"use server"

import { JobFormData } from "@/app/dashboard/recruiter/jobs/new/page";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

/** Wraps undici's opaque `TypeError: fetch failed` with actionable context. */
const request = (path: string, init?: RequestInit) =>
    fetch(`${BASE_URL}${path}`, init).catch((error) => {
        throw new Error(
            `Could not reach the jobs API at ${BASE_URL}${path} — is the backend running?`,
            { cause: error },
        )
    })


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
    return res.json();
}

export const deleteJob = async (jobId: string) => {
    const res = await request(`/jobs/${jobId}`, {
        method: 'DELETE'
    });

    if (!res.ok) {
        throw new Error(`Jobs API responded with ${res.status} ${res.statusText}`)
    }

    return res.json();
}