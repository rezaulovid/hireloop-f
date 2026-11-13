// Mock of the Stripe hosted checkout page.
//
// Stripe Checkout lives on checkout.stripe.com and is rendered by Stripe, not
// by us — this page stands in for it until the integration is live, so the
// flow (payment page → hosted checkout → premium) can be walked end to end.
//
// It deliberately looks like Stripe: white panel, Stripe's purple accent,
// the same field order. The "Pay" action (`completePayment`) stands in for
// Stripe's `checkout.session.completed` webhook and grants premium directly.
//
// When Stripe is wired up: delete this page and the action, and let the
// browser go to checkout.stripe.com while the webhook grants premium.

import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { AlertCircle, CreditCard, Lock } from "lucide-react"

import { auth } from "@/lib/auth"
import { formatAmount, PREMIUM_PLAN } from "@/lib/plans"
import { completePayment } from "./actions"
import { PayButton } from "./_components/pay-button"

export default async function CheckoutPage({
    searchParams,
}: {
    searchParams: Promise<{ redirectTo?: string; error?: string }>
}) {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session?.user) {
        redirect("/sign-in?redirectTo=/checkout")
    }

    const { redirectTo, error } = await searchParams
    // Only same-origin paths are allowed back.
    const returnTo = redirectTo?.startsWith("/") ? redirectTo : "/dashboard/seeker"

    // Already upgraded — nothing left to pay for.
    if (session.user.premium) {
        redirect(returnTo)
    }

    const amount = formatAmount(PREMIUM_PLAN.amount, PREMIUM_PLAN.currency)

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#0a0a0b] px-4 py-12">
            <div className="w-full max-w-[430px]">
                {/* Test-mode banner — this page is a stand-in, not Stripe. */}
                <p className="mb-4 rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-center text-xs text-amber-300">
                    Test mode — this is a mock of the Stripe Checkout page. No
                    payment is processed.
                </p>

                <div className="rounded-xl bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.25)]">
                    {/* Merchant */}
                    <div className="flex items-center justify-between">
                        <span className="text-[18px] font-semibold tracking-[-0.01em] text-[#32325d]">
                            HireLoop
                        </span>
                        <span className="flex items-center gap-1.5 text-xs font-medium text-[#6b6e82]">
                            <Lock aria-hidden className="size-3.5" />
                            Secure checkout
                        </span>
                    </div>

                    {/* Order */}
                    <div className="mt-6 border-t border-[#e6e9f0] pt-5">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-sm font-medium text-[#32325d]">
                                    {PREMIUM_PLAN.name}
                                </p>
                                <p className="mt-0.5 text-xs text-[#6b6e82]">
                                    Billed every {PREMIUM_PLAN.interval}
                                </p>
                            </div>
                            <p className="text-sm font-medium text-[#32325d]">
                                {amount}
                            </p>
                        </div>

                        <div className="mt-4 flex items-center justify-between border-t border-[#e6e9f0] pt-4">
                            <span className="text-sm text-[#32325d]">Total due today</span>
                            <span className="text-lg font-semibold text-[#32325d]">
                                {amount}
                            </span>
                        </div>
                    </div>

                    {/* Card details */}
                    <form action={completePayment} className="mt-6">
                        <input type="hidden" name="redirectTo" value={returnTo} />

                        <fieldset>
                            <legend className="mb-3 flex w-full items-center justify-between text-sm font-medium text-[#32325d]">
                                Card information
                                <CreditCard aria-hidden className="size-4 text-[#9aa0b4]" />
                            </legend>

                            {error === "invalid_card" ? (
                                <p
                                    role="alert"
                                    className="mb-3 flex items-start gap-2 rounded-md border border-[#e25950]/30 bg-[#e25950]/10 px-3 py-2 text-xs text-[#b32d24]"
                                >
                                    <AlertCircle aria-hidden className="mt-0.5 size-3.5 shrink-0" />
                                    Your card number is invalid.
                                </p>
                            ) : null}

                            <input
                                name="cardNumber"
                                type="text"
                                inputMode="numeric"
                                autoComplete="cc-number"
                                required
                                placeholder="1234 1234 1234 1234"
                                className="h-11 w-full rounded-md border border-[#d9dce3] px-3 text-sm text-[#32325d] outline-none transition-colors placeholder:text-[#9aa0b4] focus:border-[#635bff] focus:ring-2 focus:ring-[#635bff]/20"
                            />

                            <div className="mt-3 grid grid-cols-2 gap-3">
                                <input
                                    name="cardExpiry"
                                    type="text"
                                    inputMode="numeric"
                                    autoComplete="cc-exp"
                                    required
                                    placeholder="MM / YY"
                                    className="h-11 w-full rounded-md border border-[#d9dce3] px-3 text-sm text-[#32325d] outline-none transition-colors placeholder:text-[#9aa0b4] focus:border-[#635bff] focus:ring-2 focus:ring-[#635bff]/20"
                                />
                                <input
                                    name="cardCvc"
                                    type="text"
                                    inputMode="numeric"
                                    autoComplete="cc-csc"
                                    required
                                    placeholder="CVC"
                                    className="h-11 w-full rounded-md border border-[#d9dce3] px-3 text-sm text-[#32325d] outline-none transition-colors placeholder:text-[#9aa0b4] focus:border-[#635bff] focus:ring-2 focus:ring-[#635bff]/20"
                                />
                            </div>

                            <input
                                name="cardZip"
                                type="text"
                                autoComplete="postal-code"
                                placeholder="ZIP / Postal code"
                                className="mt-3 h-11 w-full rounded-md border border-[#d9dce3] px-3 text-sm text-[#32325d] outline-none transition-colors placeholder:text-[#9aa0b4] focus:border-[#635bff] focus:ring-2 focus:ring-[#635bff]/20"
                            />
                        </fieldset>

                        <div className="mt-6">
                            <PayButton amount={amount} />
                        </div>

                        <p className="mt-4 text-center text-[11px] leading-4 text-[#6b6e82]">
                            Payments are simulated in this mock. In production
                            this step happens on Stripe&apos;s hosted page.
                        </p>
                    </form>
                </div>
            </div>
        </div>
    )
}
