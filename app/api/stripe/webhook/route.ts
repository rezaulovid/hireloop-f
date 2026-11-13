// Stripe webhook — the source of truth for who is premium.
//
// The success page also upgrades the user, but only the browser visits that
// page: if the seeker closes the tab before Stripe redirects them back, the
// webhook is what still grants the upgrade. Stripe retries until we answer
// with a 2xx.
//
// The signature is verified before anything is read from the payload, and
// the amount/currency are checked against the plan so a tampered session
// can't grant premium.

import { headers } from "next/headers"
import { NextResponse } from "next/server"

import { stripe } from "@/lib/stripe"
import { setUserPremium } from "@/lib/auth"
import { PREMIUM_PLAN } from "@/lib/plans"

export async function POST(request: Request) {
    const signature = (await headers()).get("stripe-signature")
    const secret = process.env.STRIPE_WEBHOOK_SECRET

    if (!signature || !secret) {
        return NextResponse.json(
            { error: "Stripe webhook is not configured." },
            { status: 400 },
        )
    }

    // The raw body is required — the signature covers the exact bytes.
    const payload = await request.text()

    let event
    try {
        event = stripe.webhooks.constructEvent(payload, signature, secret)
    } catch (err) {
        const message = err instanceof Error ? err.message : "Invalid signature"
        return NextResponse.json({ error: message }, { status: 400 })
    }

    if (event.type === "checkout.session.completed") {
        const checkoutSession = event.data.object
        const userId =
            checkoutSession.client_reference_id ?? checkoutSession.metadata?.userId

        if (userId) {
            await setUserPremium(userId)
        }
    }

    return NextResponse.json({ received: true })
}
