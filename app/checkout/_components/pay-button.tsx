"use client"

import { useFormStatus } from "react-dom"
import { Loader2, Lock } from "lucide-react"

/**
 * Submit button for the mock Stripe page. `useFormStatus` reflects the
 * pending state of the form it's rendered inside — the action runs on the
 * server, so the button has to be a client component.
 */
export function PayButton({ amount }: { amount: string }) {
    const { pending } = useFormStatus()

    return (
        <button
            type="submit"
            disabled={pending}
            className="flex h-[40px] w-full items-center justify-center gap-2 rounded-md bg-[#635bff] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#7a73ff] disabled:cursor-not-allowed disabled:opacity-70"
        >
            {pending ? (
                <>
                    <Loader2 aria-hidden className="size-4 animate-spin" />
                    Processing…
                </>
            ) : (
                <>
                    <Lock aria-hidden className="size-3.5" />
                    Pay {amount}
                </>
            )}
        </button>
    )
}
