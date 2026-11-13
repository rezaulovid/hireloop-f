import { cn } from "cn"

/**
 * Shared page width and padding for dashboard routes. Keeps tables and
 * stat rows aligned across roles, while still centering on very wide screens.
 */
export function PageContainer({
    children,
    width = "wide",
    className,
}: {
    children: React.ReactNode
    width?: "default" | "wide"
    className?: string
}) {
    return (
        <div
            className={cn(
                "mx-auto w-full px-4 py-6 sm:px-6",
                width === "wide" ? "max-w-[1120px]" : "max-w-4xl",
                className
            )}
        >
            {children}
        </div>
    )
}
