// Header card for the job details page — from the Figma
// "Public / Job Details › Header Section": logo tile, title, company
// line, and the bookmark + Apply Now actions.
"use client"
import { useState } from "react"
import type { ApplicationFormData, JobRow } from "@/lib/types"
import { Bookmark, LoaderCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useSession } from "@/lib/auth-client"
import { createApplication } from "@/lib/api/applications"
import { toast } from "@/components/ui/toast"
export function JobHeaderCard({ job }: { job: JobRow }) {
    const { data: session, isPending: isSessionPending } = useSession()
    const router = useRouter()
    const user = session?.user;
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleApplyNow = async () => {
        // Let the session resolve first so a logged-in user isn't
        // mistaken for a guest while it loads.
        if (isSessionPending) return

        if (!user) {
            // Preserve this job's URL so sign-in can send the user back here.
            router.push(`/sign-in?redirectTo=/browse-jobs/${job._id}`)
            return
        }

        if (user.role !== 'seeker') {
            toast.add({
                title: "Sign in as a job seeker to apply",
                description: "Recruiter and admin accounts can't apply to jobs.",
            })
            return
        }

        setIsSubmitting(true)
        try {
            // Save the full application snapshot (job + seeker + lifecycle)
            // so the My Applications page can render with no joins.
            const application: ApplicationFormData = {
                jobId: job._id,
                userId: user.id,
                email: user.email,
                jobTitle: job.title,
                companyName: job.companyName,
                jobType: job.jobType,
                isRemote: job.isRemote,
                location: job.location,
                deadline: job.deadline,
                appliedAt: new Date().toISOString(),
                status: "applied",
                archived: false,
            }

            const result = await createApplication(application);
            if (result.alreadyApplied) {
                // The backend rejects a second application for the same job.
                toast.add({
                    title: "Already applied",
                    description: `You applied to ${job.title} earlier.`,
                })
                return
            }
            toast.add({
                title: "Application submitted",
                description: `Your application for ${job.title} was sent to ${job.companyName}.`,
            })
            router.push('/browse-jobs')
        } catch (error) {
            toast.add({
                title: "Could not submit application",
                description:
                    error instanceof Error
                        ? error.message
                        : "Something went wrong. Please try again.",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <section className="flex flex-wrap items-start justify-between gap-6 border border-white/10 bg-[#141418] p-8 shadow-[0_1px_2px_rgba(0,0,0,0.35)] shadow-[inset_0_1px_rgba(255,255,255,0.035)]">
            <div className="flex min-w-0 flex-wrap items-start gap-6">
                {/* Company logo tile: 80px tile, 70px inner logo (Figma) */}
                <div className="flex size-20 shrink-0 items-center justify-center rounded-xl bg-[#1A1A1F]">
                    <span className="flex size-[70px] items-center justify-center rounded-xl bg-[#101014] text-2xl font-semibold text-[#8B85FF]">
                        {job.companyName.charAt(0).toUpperCase()}
                    </span>
                </div>

                <div className="min-w-0">
                    <h1 className="text-[32px] font-semibold leading-10 tracking-[-0.02em] text-[#EDEDEF]">
                        {job.title}
                    </h1>

                    {/* Company line with dot separator */}
                    <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2">
                        <span className="text-[22px] font-semibold text-[#A0A0AB]">
                            {job.companyName}
                        </span>
                        <span aria-hidden className="size-1 rounded-full bg-[#8E9192]" />
                        <span className="capitalize text-base text-[#EDEDEF]">
                            {job.location}
                            {job.isRemote ? " (Remote)" : ""}
                        </span>
                        <span aria-hidden className="size-1 rounded-full bg-[#8E9192]" />
                        <span className="capitalize text-base text-[#EDEDEF]">
                            {job.jobType}
                        </span>

                        {/* Placeholder for a "Verified Employer" badge when the
                            data model gains an employer verification flag. */}
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
                <button
                    type="button"
                    aria-label={`Bookmark ${job.title}`}
                    // TODO: wire saving/bookmarking.
                    className="flex size-12 items-center justify-center rounded-lg border border-white/10 bg-[#222228] text-[#E5E2E3] transition-colors hover:border-white/25 hover:text-white"
                >
                    <Bookmark aria-hidden className="size-5" />
                </button>
                <button
                    type="button"
                    onClick={handleApplyNow}
                    disabled={isSubmitting}
                    className="h-12 rounded-lg bg-[#FAFAFA] px-4 text-base font-medium text-[#0B0B0C] shadow-[0_1px_2px_rgba(0,0,0,0.35)] transition-colors hover:bg-white disabled:opacity-60"
                >
                    {isSubmitting ? (
                        <span className="flex items-center gap-2">
                            <LoaderCircle aria-hidden className="size-4 animate-spin" />
                            Applying…
                        </span>
                    ) : (
                        "Apply Now"
                    )}
                </button>
            </div>
        </section>
    )
}