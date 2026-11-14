// Recruiter view of the applicants for one job, reached from the
// "View applications" link on the Manage Jobs table.
//
// Loads the job (for header context) and its applications in parallel, then
// hands both to the interactive board.

import { notFound } from "next/navigation"

import { PageContainer } from "@/components/dashboard/page-shell"
import { getApplications } from "@/lib/api/applications"
import { getJobById } from "@/lib/actions/jobs"

import { ApplicationsBoard } from "./_components/applications-board"

export default async function JobApplicationsPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params

    const [job, applications] = await Promise.all([
        getJobById(id),
        getApplications({ jobId: id }),
    ])

    if (!job) notFound()

    return (
        <PageContainer width="wide">
            <ApplicationsBoard job={job} applications={applications} />
        </PageContainer>
    )
}
