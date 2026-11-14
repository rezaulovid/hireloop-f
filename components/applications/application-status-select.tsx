"use client"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    APPLICATION_STATUS_META,
    APPLICATION_STATUS_OPTIONS,
} from "@/lib/applications"
import { inputClass } from "@/lib/styles"
import type { ApplicationStatus } from "@/lib/types"
import { cn } from "@/lib/utils"

/**
 * Status picker used by the recruiter applications table. The trigger is
 * tinted with the current status color so the table can be scanned at a
 * glance, and doubles as the status chip.
 *
 * Deliberately controlled: the caller owns the value and decides when to
 * persist the change (the database write is wired separately).
 */
export function ApplicationStatusSelect({
    value,
    onValueChange,
    disabled,
    className,
    "aria-label": ariaLabel,
}: {
    value: ApplicationStatus
    onValueChange: (status: ApplicationStatus) => void
    disabled?: boolean
    className?: string
    "aria-label": string
}) {
    const { color } = APPLICATION_STATUS_META[value]

    return (
        <Select<ApplicationStatus>
            value={value}
            items={APPLICATION_STATUS_OPTIONS}
            onValueChange={(next) => {
                if (next) onValueChange(next)
            }}
            disabled={disabled}
        >
            <SelectTrigger
                aria-label={ariaLabel}
                className={cn(
                    inputClass,
                    "h-8 w-[152px] gap-2 text-xs font-medium",
                    className,
                )}
                // Tint the trigger with the current status so the table can be
                // scanned by color without a separate pill.
                style={{
                    color,
                    borderColor: `${color}66`,
                    backgroundColor: `${color}14`,
                }}
            >
                <span
                    aria-hidden
                    className="size-1.5 shrink-0 rounded-full"
                    style={{ backgroundColor: color }}
                />
                <SelectValue />
            </SelectTrigger>

            <SelectContent align="end">
                {APPLICATION_STATUS_OPTIONS.map(({ value: status, label, color }) => (
                    <SelectItem key={status} value={status}>
                        <span className="flex items-center gap-2">
                            <span
                                aria-hidden
                                className="size-1.5 rounded-full"
                                style={{ backgroundColor: color }}
                            />
                            {label}
                        </span>
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}
