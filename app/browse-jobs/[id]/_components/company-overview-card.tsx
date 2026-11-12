// Aside - Sidebar — Figma "Company Overview": heading, banner image with a
// bottom-dark linear gradient, bordered spec rows, and a Visit Website button.
//
// Only facts that exist in the job data are shown; the banner uses the
// company initial as a placeholder until company photos exist in the data.

"use client"

import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { detailCardClass } from "@/lib/styles"
import type { JobRow } from "@/lib/types"

function SpecRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex h-[49px] items-center justify-between gap-4 border-t border-white/[0.07]">
            <dt className="shrink-0 text-[13px] leading-5 text-[#A0A0AB]">{label}</dt>
            <dd className="truncate text-base leading-6 text-[#EDEDEF]">{value}</dd>
        </div>
    )
}

export function CompanyOverviewCard({ job }: { job: JobRow }) {
    return (
        <Card className={cn(detailCardClass, "flex flex-col gap-6 p-[25px]")}>
            <h2 className="font-heading text-[22px] leading-7 font-semibold tracking-[-0.02em] text-[#EDEDEF]">
                Company Overview
            </h2>

            {/* Banner — placeholder until company photos exist in the data */}
            <div className="relative flex h-[204px] items-center justify-center overflow-hidden rounded-xl bg-[#1A1A1F]">
                <span
                    aria-hidden
                    className="text-6xl font-semibold text-[#8B85FF]"
                >
                    {job.companyName.charAt(0).toUpperCase()}
                </span>
                {/* Figma "Gradient" overlay */}
                <div
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
                />
            </div>

            <dl className="flex flex-col gap-6">
                <SpecRow label="WORKPLACE" value={job.isRemote ? "Remote" : "On-site"} />
                <SpecRow label="LOCATION" value={job.location || "—"} />
            </dl>

            <button
                type="button"
                onClick={() => { /* TODO: wire the company website once it exists in the data */ }}
                className="flex h-11 items-center justify-center rounded-[10px] border border-white/10 bg-white/[0.04] text-[13px] leading-5 text-[#EDEDEF] transition-colors hover:bg-white/[0.08]"
            >
                Visit Website
            </button>
        </Card>
    )
}
