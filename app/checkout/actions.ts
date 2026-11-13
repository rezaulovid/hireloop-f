"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { auth, setUserPremium } from "@/lib/auth"

/** Digits only — the mock only checks the shape, not the real card. */
const digits = (value: FormDataEntryValue | null) =>
    String(value ?? "").replace(/\D/g, "")

/**
 * Completes the mock payment.
 *
 * This is the stand-in for Stripe's `checkout.session.completed` webhook:
 * it grants premium to the seeker. When Stripe is wired up, this action goes
 * away — the webhook handler does the same thing, and the browser is sent to
 * `/payment/success` instead.
 */
export async function completePayment(formData: FormData) {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session?.user) {
        redirect("/sign-in?redirectTo=/checkout")
    }

    const redirectTo = String(formData.get("redirectTo") ?? "")
    const returnTo = redirectTo.startsWith("/") ? redirectTo : "/dashboard/seeker"

    // Stand-in for Stripe rejecting a bad card.
    const number = digits(formData.get("cardNumber"))
    const expiry = String(formData.get("cardExpiry") ?? "")
    const cvc = digits(formData.get("cardCvc"))

    const invalid =
        number.length < 13 ||
        !/^\d{2}\/\d{2}$/.test(expiry) ||
        cvc.length < 3

    if (invalid) {
        redirect(
            `/checkout?error=invalid_card&redirectTo=${encodeURIComponent(returnTo)}`,
        )
    }

    await setUserPremium(session.user.id)

    redirect(returnTo)
}
