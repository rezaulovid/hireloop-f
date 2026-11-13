// /checkout is an alias for /payment — the checkout page lives at /payment.
//
// Kept so the URL from the earlier apply-limit flow (and any bookmark)
// still lands somewhere sensible.

import { redirect } from "next/navigation"

export default async function CheckoutPage({
    searchParams,
}: {
    searchParams: Promise<{ redirectTo?: string }>
}) {
    const { redirectTo } = await searchParams
    const target = redirectTo ? `/payment?redirectTo=${encodeURIComponent(redirectTo)}` : "/payment"
    redirect(target)
}
