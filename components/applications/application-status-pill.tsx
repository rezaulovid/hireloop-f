import { APPLICATION_STATUS_META } from "@/lib/applications"
import type { ApplicationStatus } from "@/lib/types"
import { cn } from "@/lib/utils"

/**
 * Read-only status chip shared by seeker and recruiter views:
 * a colored border/text on a 10% tint of the same color.
 */
export function ApplicationStatusPill({
    status,
    className,
}: {
    status: ApplicationStatus
    className?: string
}) {
    const { label, color } = APPLICATION_STATUS_META[status]

    return (
        <span
            className={cn(
                "inline-flex h-[22px] items-center whitespace-nowrap rounded-full border px-2.5 text-xs font-medium",
                className,
            )}
            style={{ color, borderColor: color, backgroundColor: `${color}1A` }}
        >
            {label}
        </span>
    )
}
