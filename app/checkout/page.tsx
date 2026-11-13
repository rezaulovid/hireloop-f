// Upgrade to Premium — the destination for seekers who hit the free
// application limit on the job details page.
//
// Premium lifts the cap on how many jobs a seeker can apply to. The plan
// summary is static for now; wire the payment provider (and the webhook
// that flips `user.premium`) once it's picked.

import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { Card } from "@/components/ui/card"

const PREMIUM_FEATURES = [
    "Apply to unlimited jobs",
    "Priority listing in recruiter searches",
    "Early access to new postings",
]

export default async function CheckoutPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    // Only signed-in seekers can upgrade.
    if (!session?.user) {
        redirect("/sign-in?redirectTo=/checkout")
    }

    if (session.user.premium) {
        redirect("/dashboard/seeker")
    }

    return (
        <div className="min-h-screen bg-[#08080a] pb-16">
            <div className="mx-auto w-full max-w-3xl px-4 py-10">
                <header className="text-center">
                    <h1 className="text-[32px] font-semibold tracking-[-0.02em] text-[#EDEDEF]">
                        Upgrade to Premium
                    </h1>
                    <p className="mt-2 text-[13px] text-[#A0A0AB]">
                        You have reached the free plan application limit. Go premium to keep applying.
                    </p>
                </header>

                <Card className="mt-8 p-8">
                    <div className="flex flex-wrap items-start justify-between gap-6">
                        <div>
                            <h2 className="text-[22px] font-semibold text-[#EDEDEF]">
                                Premium
                            </h2>
                            <p className="mt-1 text-[13px] text-[#A0A0AB]">
                                Everything in the free plan, without the limits.
                            </p>
                        </div>

                        <div className="text-right">
                            <p className="text-[32px] font-semibold text-[#EDEDEF]">
                                $9
                                <span className="text-[13px] font-normal text-[#A0A0AB]">/month</span>
                            </p>
                        </div>
                    </div>

                    <ul className="mt-6 flex flex-col gap-3 border-t border-white/10 pt-6">
                        {PREMIUM_FEATURES.map((feature) => (
                            <li key={feature} className="flex items-start gap-3">
                                <span
                                    aria-hidden
                                    className="mt-1 size-1.5 shrink-0 rounded-full bg-[#8B85FF]"
                                />
                                <span className="text-[13px] text-[#EDEDEF]">{feature}</span>
                            </li>
                        ))}
                    </ul>

                    {/* TODO: hand off to the payment provider and set
                        `premium: true` on the user document from its webhook. */}
                    <button
                        type="button"
                        disabled
                        className="mt-8 h-12 w-full rounded-lg bg-[#FAFAFA] px-4 text-base font-medium text-[#0B0B0C] shadow-[0_1px_2px_rgba(0,0,0,0.35)] transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        Continue to payment
                    </button>
                </Card>
            </div>
        </div>
    )
}
