// Content sections — Figma "Content Sections": 22px headings over 13px/20
// dot-bulleted lists on the #141418 card, sections divided by a 7% white rule.

import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { detailCardClass } from "@/lib/styles"
import type { JobRow } from "@/lib/types"

/** "• 3+ years of…\n- Solid understanding of…" → ["3+ years of…", "Solid understanding of…"]. */
const toItems = (text: string) =>
    text
        .split("\n")
        .map((line) => line.replace(/^[•\-*]\s*/, "").trim())
        .filter(Boolean)

function ContentSection({ title, items, divided }: { title: string; items: string[]; divided?: boolean }) {
    return (
        <section className={cn(divided && "border-t border-white/[0.07] pt-[25px]")}>
            <h2 className="font-heading text-[22px] leading-7 font-semibold tracking-[-0.02em] text-[#EDEDEF]">
                {title}
            </h2>
            <ul className="mt-6 flex flex-col gap-3">
                {items.map((item, index) => (
                    <li key={index} className="flex items-start gap-6">
                        {/* Figma bullet: 6px white dot, vertically centered on the first line */}
                        <span
                            aria-hidden
                            className="mt-2 size-1.5 shrink-0 rounded-full bg-white"
                        />
                        <p className="text-[13px] leading-5 text-[#A0A0AB]">{item}</p>
                    </li>
                ))}
            </ul>
        </section>
    )
}

export function JobContentCard({ job }: { job: JobRow }) {
    const responsibilities = toItems(job.responsibilities)
    const requirements = toItems(job.requirements)

    return (
        <Card className={cn(detailCardClass, "flex flex-col gap-6 p-[33px]")}>
            {responsibilities.length > 0 && (
                <ContentSection title="Responsibilities" items={responsibilities} />
            )}
            {requirements.length > 0 && (
                <ContentSection title="Requirements" items={requirements} divided={responsibilities.length > 0} />
            )}
        </Card>
    )
}
