
// Payment success — verifies the Stripe Checkout Session,
// activates premium access, and displays the payment receipt.

import { headers } from "next/headers"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import {
    ArrowLeft,
    ArrowRight,
    Check,
    ShieldCheck,
} from "lucide-react"

import type Stripe from "stripe"
import { auth, setUserPremium } from "@/lib/auth"
import { stripe } from "@/lib/stripe"

// Fixed en-US format for consistent server rendering.
const formatDate = (unixSeconds: number) =>
    new Date(unixSeconds * 1000).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    })

export default async function CheckoutSuccessPage({
    searchParams,
}: {
    searchParams: Promise<{
        session_id?: string
        redirectTo?: string
    }>
}) {
    const {
        session_id: sessionId,
        redirectTo,
    } = await searchParams

    // Verify authenticated user.
    const userSession = await auth.api.getSession({
        headers: await headers(),
    })

    if (!userSession?.user) {
        redirect("/sign-in")
    }

    if (!sessionId) {
        notFound()
    }

    // Only same-origin paths are allowed.
    const returnTo =
        redirectTo?.startsWith("/") && !redirectTo.startsWith("//")
            ? redirectTo
            : "/dashboard/seeker"

    let checkoutSession: Stripe.Checkout.Session

    try {
        // Retrieve and expand Stripe payment information.
        checkoutSession = await stripe.checkout.sessions.retrieve(
            sessionId,
            {
                expand: ["line_items", "payment_intent"],
            }
        )
    } catch (error) {
        console.error("Stripe session verification failed:", error)
        notFound()
    }

    // Ensure this Checkout Session belongs to the logged-in user.
    if (
        checkoutSession.client_reference_id !== userSession.user.id
    ) {
        notFound()
    }

    // An open session means checkout has not finished.
    if (checkoutSession.status === "open") {
        redirect("/payment")
    }

    // Verify that Stripe has confirmed the payment.
    if (
        checkoutSession.status !== "complete" ||
        checkoutSession.payment_status !== "paid"
    ) {
        redirect("/payment?canceled=1")
    }

    // Activate premium access only after successful verification.
    await setUserPremium(userSession.user.id)

    // Extract verified receipt information.
    const paymentIntent =
        typeof checkoutSession.payment_intent === "object"
            ? checkoutSession.payment_intent
            : null

    const transactionId =
        paymentIntent?.id ?? checkoutSession.id

    const amount = (
        (checkoutSession.amount_total ?? 0) / 100
    ).toLocaleString("en-US", {
        style: "currency",
        currency: checkoutSession.currency || "usd",
    })

    const lineItems = checkoutSession.line_items?.data ?? []

    const planName =
        lineItems[0]?.description || "Hireloop Pro Plan"

    const receiptEmail =
        checkoutSession.customer_details?.email ??
        checkoutSession.customer_email

    // Render long Stripe IDs without losing their selectable value.
    const idChip = (id: string) => (
        <code
            title={id}
            className="max-w-[190px] truncate rounded bg-[#1f2937] px-2 py-1 font-mono text-[11px] text-[#9ca3af] select-all"
        >
            {id}
        </code>
    )

    return (
        <div className="relative min-h-screen bg-[#08080a]">
            {/* Header */}
            <header className="mx-auto flex h-24 w-full max-w-3xl items-center px-4">
                <Link
                    href="/"
                    aria-label="Back"
                    className="mr-6 text-[#a1a1aa] transition-colors hover:text-white"
                >
                    <ArrowLeft aria-hidden className="size-6" />
                </Link>

                <Link
                    href="/"
                    className="font-heading text-lg font-bold text-white"
                >
                    Hireloop
                </Link>
            </header>

            {/* Decorative background glow */}
            <div
                aria-hidden
                className="pointer-events-none absolute left-1/2 top-1/2 size-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#1e3a8a] blur-[120px]"
            />

            <main className="relative flex items-start justify-center px-4 pb-24">
                <section className="w-full max-w-[512px] rounded-3xl border border-white/10 bg-[#141418] px-6 py-10 text-center shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] sm:px-10">

                    {/* Success icon */}
                    <div className="flex justify-center">
                        <span
                            aria-hidden
                            className="flex size-16 items-center justify-center rounded-full bg-[#10b981] shadow-[0_0_0_4px_rgba(16,185,129,0.05)]"
                        >
                            <Check
                                strokeWidth={3}
                                className="size-8 text-white"
                            />
                        </span>
                    </div>

                    <p className="mt-7 inline-flex h-5 items-center rounded border border-[#3b82f6] bg-[#3b82f6]/15 px-[11px] text-[11px] font-medium tracking-[0.34em] text-[#60a5fa] uppercase">
                        Upgrade successful
                    </p>

                    <h1 className="mt-4 text-[22px] font-semibold tracking-[-0.02em] text-[#EDEDEF]">
                        Welcome to Hireloop Pro
                    </h1>

                    <p className="mx-auto mt-5 max-w-[366px] text-base leading-[26px] text-[#9ca3af]">
                        Your payment of {amount} was received successfully.
                        All advanced premium features are unlocked on your account.
                    </p>

                    {/* Verified payment receipt */}
                    <div className="mt-10 rounded-xl border border-[#1f2937] bg-black px-4 py-3.5 text-left">

                        <div className="flex flex-wrap items-center gap-2.5">
                            <ShieldCheck
                                aria-hidden
                                className="size-5 shrink-0 text-[#6b7280]"
                            />

                            <span className="text-[13px] font-medium text-[#a0a0ab]">
                                Session verified
                            </span>

                            <span className="ml-auto">
                                {idChip(checkoutSession.id)}
                            </span>
                        </div>

                        <dl className="mt-3 divide-y divide-[#1f2937] border-t border-[#1f2937] pt-1">

                            {/* Transaction ID */}
                            <div className="flex items-center justify-between gap-4 py-2.5">
                                <dt className="shrink-0 text-[13px] text-[#a0a0ab]">
                                    Transaction ID
                                </dt>

                                <dd>
                                    {idChip(transactionId)}
                                </dd>
                            </div>

                            {/* Plan */}
                            <div className="flex items-center justify-between gap-4 py-2.5">
                                <dt className="text-[13px] text-[#a0a0ab]">
                                    Plan
                                </dt>

                                <dd className="truncate text-[13px] text-[#EDEDEF]">
                                    {planName}
                                </dd>
                            </div>

                            {/* Amount */}
                            <div className="flex items-center justify-between gap-4 py-2.5">
                                <dt className="text-[13px] text-[#a0a0ab]">
                                    Amount paid
                                </dt>

                                <dd className="text-[13px] font-medium text-[#EDEDEF]">
                                    {amount}
                                </dd>
                            </div>

                            {/* Payment date */}
                            <div className="flex items-center justify-between gap-4 py-2.5">
                                <dt className="text-[13px] text-[#a0a0ab]">
                                    Payment date
                                </dt>

                                <dd className="text-right text-[12px] text-[#EDEDEF] sm:text-[13px]">
                                    {formatDate(checkoutSession.created)}
                                </dd>
                            </div>

                            {/* Receipt email */}
                            {receiptEmail && (
                                <div className="flex items-center justify-between gap-4 py-2.5">
                                    <dt className="shrink-0 text-[13px] text-[#a0a0ab]">
                                        Receipt email
                                    </dt>

                                    <dd className="truncate text-[13px] text-[#EDEDEF]">
                                        {receiptEmail}
                                    </dd>
                                </div>
                            )}
                        </dl>
                    </div>

                    {/* Dashboard navigation */}
                    <Link
                        href={returnTo}
                        className="mt-8 flex h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-white text-sm font-semibold text-black shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] transition-colors hover:bg-white/90"
                    >
                        Go to My Applications

                        <ArrowRight
                            aria-hidden
                            className="size-4"
                        />
                    </Link>
                </section>
            </main>
        </div>
    )
}
