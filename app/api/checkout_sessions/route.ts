
// Creates a Stripe Checkout Session and redirects the browser to Stripe's
// hosted checkout page.
//
// The payment form POSTs here (a top-level form post, so the browser follows
// the redirect to Stripe). Stripe owns the charge; we only tell it what
// to sell and where to send the user afterwards.

import { NextResponse } from "next/server"
import { headers } from "next/headers"

import { stripe } from "@/lib/stripe"
import { auth } from "@/lib/auth"
import { PREMIUM_PLAN } from "@/lib/plans"

export async function POST(request: Request) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        })

        if (!session?.user) {
            return NextResponse.json(
                { error: "Sign in to upgrade." },
                { status: 401 },
            )
        }

        // Where to send the user once the payment completes. Only
        // same-origin paths are allowed back.
        const formData = await request.formData().catch(() => null)
        const redirectTo = String(formData?.get("redirectTo") ?? "")
        const returnTo = redirectTo.startsWith("/")
            ? redirectTo
            : "/dashboard/seeker"

        const headersList = await headers()
        const origin =
            headersList.get("origin") ?? new URL(request.url).origin

        const checkoutSession = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price: PREMIUM_PLAN.stripePriceId as string,
                    quantity: 1,
                },
            ],
            mode: "payment",
            // Prefills the email on Stripe's page.
            customer_email: session.user.email,
            // Ties the session to the user, so the webhook (and the success
            // page) know who paid.
            client_reference_id: session.user.id,
            metadata: {
                userId: session.user.id,
                redirectTo: returnTo,
            },
            success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}&redirectTo=${encodeURIComponent(returnTo)}`,
            cancel_url: `${origin}/payment?canceled=1`,
            integration_identifier: "hire_loop_web_001",
        })

        return NextResponse.redirect(checkoutSession.url as string, 303)
    } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err))
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
