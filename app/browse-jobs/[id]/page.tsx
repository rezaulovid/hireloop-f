// Job details — public page under Browse Jobs, from the Figma
// "Public / Job Details" (header card, bento info grid, content
// sections, company overview sidebar). The navbar comes from the
// root layout (app/layout.tsx) — don't render it here too.

import { notFound } from "next/navigation"
import { getJobById } from "@/lib/actions/jobs"

import { JobHeaderCard } from "./_components/job-header-card"
import { JobHighlights } from "./_components/job-highlights"
import { JobContentCard } from "./_components/job-content-card"
import { CompanyOverviewCard } from "./_components/company-overview-card"

export default async function JobDetailsPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const job = await getJobById(id);

    if (!job) notFound()

    return (
        <div className="min-h-screen bg-[#08080a] pb-8">
            <main className="mx-auto flex w-full max-w-[1280px] flex-col gap-6 px-5 py-6">
                <JobHeaderCard job={job} />

                <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_397px]">
                    <div className="flex min-w-0 flex-col gap-6">
                        <JobHighlights job={job} />
                        <JobContentCard job={job} />
                    </div>

                    <div>
                        <CompanyOverviewCard job={job} />
                    </div>
                </div>
            </main>
        </div>
    )
}