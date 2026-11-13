// Payment — where a seeker upgrades to the premium plan.
//
// Two columns: the payment form on the left, the order summary on the right.
// The card details are collected but nothing is charged yet — pressing "Pay"
// is the seam where the Stripe Checkout session is created and the user is
// sent to Stripe's hosted page.

import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { Check, Lock } from "lucide-react"

import { auth } from "@/lib/auth"
import { formatAmount, PREMIUM_PLAN } from "@/lib/plans"
import { PaymentForm } from "./_components/payment-form"

export default async function PaymentPage({
    searchParams,
}: {
    searchParams: Promise<{ redirectTo?: string }>
}) {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    // Only signed-in seekers can upgrade.
    if (!session?.user) {
        redirect("/sign-in?redirectTo=/payment")
    }

    // Already premium — nothing to pay for.
    if (session.user.premium) {
        redirect("/dashboard/seeker")
    }

    const { redirectTo } = await searchParams
    // Only same-origin paths are allowed back, so the param can't be used to
    // bounce the user to another site after paying.
    const returnTo = redirectTo?.startsWith("/") ? redirectTo : "/dashboard/seeker"

    const total = formatAmount(PREMIUM_PLAN.amount, PREMIUM_PLAN.currency)

    return (
        <div className="min-h-screen bg-[#08080a] pb-16">
            <div className="mx-auto w-full max-w-5xl px-4 py-10">
                <header className="mb-8">
                    <h1 className="text-[32px] font-semibold tracking-[-0.02em] text-[#EDEDEF]">
                        Checkout
                    </h1>
                    <p className="mt-2 text-[13px] text-[#A0A0AB]">
                        One step away from applying to unlimited jobs.
                    </p>
                </header>

                <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
                    {/* Payment form */}
                    <PaymentForm plan={PREMIUM_PLAN} redirectTo={returnTo} />

                    {/* Order summary */}
                    <aside className="lg:sticky lg:top-6 lg:self-start">
                        <div className="rounded-2xl border border-white/10 bg-[#101010]/95 p-6 shadow-[inset_0_3px_10px_rgba(255,255,255,0.04)]">
                            <h2 className="text-[18px] font-semibold tracking-[-0.02em] text-[#EDEDEF]">
                                Order summary
                            </h2>

                            <div className="mt-5 flex items-start justify-between gap-4 border-b border-white/10 pb-5">
                                <div>
                                    <p className="text-[13px] font-medium text-[#EDEDEF]">
                                        {PREMIUM_PLAN.name}
                                    </p>
                                    <p className="mt-1 text-xs text-[#A0A0AB]">
                                        Billed every {PREMIUM_PLAN.interval}
                                    </p>
                                </div>
                                <p className="text-[13px] font-medium text-[#EDEDEF]">
                                    {total}
                                </p>
                            </div>

                            <ul className="flex flex-col gap-3 border-b border-white/10 py-5">
                                {PREMIUM_PLAN.features.map((feature) => (
                                    <li key={feature} className="flex items-start gap-3">
                                        <span
                                            aria-hidden
                                            className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-[#5C53FE]/20"
                                        >
                                            <Check className="size-3 text-[#8B85FF]" />
                                        </span>
                                        <span className="text-[13px] text-[#EDEDEF]/90">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <div className="flex items-center justify-between pt-5">
                                <span className="text-[13px] text-[#A0A0AB]">Total due today</span>
                                <span className="text-[22px] font-semibold text-[#EDEDEF]">{total}</span>
                            </div>
                        </div>

                        <p className="mt-4 flex items-center justify-center gap-2 text-center text-xs text-white/50">
                            <Lock aria-hidden className="size-3.5" />
                            Cancel anytime. Payments are processed by Stripe.
                        </p>
                    </aside>
                </div>
            </div>
        </div>
    )
}
