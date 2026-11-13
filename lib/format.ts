// Small date helpers shared by the dashboard views.

const MINUTE = 60 * 1000
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR
const WEEK = 7 * DAY
const MONTH = 30 * DAY
const YEAR = 365 * DAY

/**
 * "2 hours ago" / "3 days ago" / "2 months ago" — the wording used on the
 * My Applications table.
 */
export const formatRelativeTime = (isoDate: string, now: number = Date.now()): string => {
    const timestamp = Date.parse(isoDate)
    if (Number.isNaN(timestamp)) return "—"

    const diff = now - timestamp
    if (diff < MINUTE) return "just now"
    if (diff < HOUR) {
        const minutes = Math.floor(diff / MINUTE)
        return `${minutes} minute${minutes > 1 ? "s" : ""} ago`
    }
    if (diff < DAY) {
        const hours = Math.floor(diff / HOUR)
        return `${hours} hour${hours > 1 ? "s" : ""} ago`
    }
    if (diff < WEEK) {
        const days = Math.floor(diff / DAY)
        return `${days} day${days > 1 ? "s" : ""} ago`
    }
    if (diff < MONTH) {
        const weeks = Math.floor(diff / WEEK)
        return `${weeks} week${weeks > 1 ? "s" : ""} ago`
    }
    if (diff < YEAR) {
        const months = Math.floor(diff / MONTH)
        return `${months} month${months > 1 ? "s" : ""} ago`
    }

    const years = Math.floor(diff / YEAR)
    return `${years} year${years > 1 ? "s" : ""} ago`
}

/** "Nov 12, 2026" — fixed locale so SSR and client always agree. */
export const formatDate = (isoDate: string): string => {
    const timestamp = Date.parse(isoDate)
    if (Number.isNaN(timestamp)) return "—"

    return new Date(timestamp).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    })
}
