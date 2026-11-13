// Plan definitions — single source of truth for what we sell.
//
// The price shown on the checkout page and the amount charged by Stripe both
// come from here, so the two can't drift apart. `stripePriceId` is filled in
// once the product exists in the Stripe dashboard; the checkout session uses
// it instead of a raw amount so Stripe owns the actual charge.

export type PlanInterval = "month" | "year"

export type Plan = {
    /** Internal id, used in URLs and analytics. */
    id: string
    name: string
    /** Price in the smallest currency unit (cents). */
    amount: number
    currency: string
    interval: PlanInterval
    /** Bullet list rendered on the checkout page. */
    features: string[]
    /** Stripe Price ID — set once the product is created in Stripe. */
    stripePriceId?: string
}

export const PREMIUM_PLAN: Plan = {
    id: "premium",
    name: "Premium",
    amount: 900,
    currency: "USD",
    interval: "month",
    features: [
        "Apply to unlimited jobs",
        "Priority listing in recruiter searches",
        "Early access to new postings",
    ],
    // Price created in the Stripe dashboard — the amount above is only used
    // for display; Stripe is the source of truth for what's charged.
    stripePriceId: "price_1UbJ3pRqGG8ZD2vcXSSAo2VH",
}

/**
 * "9.00" → "$9.00". Fixed locale so SSR and the client always agree on the
 * string (a different locale would render a different symbol).
 */
export const formatAmount = (amount: number, currency: string): string =>
    new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
        minimumFractionDigits: 2,
    }).format(amount / 100)
