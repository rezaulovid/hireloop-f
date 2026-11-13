// Payment form — collects the billing details for the premium plan.
//
// The card fields are collected here for now, but the money movement is not:
// pressing "Pay" is the seam where a Stripe Checkout session gets created
// and the user is sent to Stripe's hosted page. Stripe owns the actual
// charge (and PCI scope) — see `handlePay` for the TODO.

"use client"

import * as React from "react"
import {
    ChevronDown,
    CreditCard,
    Loader2,
    Lock,
    MapPin,
    User,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { formatAmount, type Plan } from "@/lib/plans"

type PaymentDetails = {
    name: string
    number: string
    expiry: string
    cvc: string
    country: string
    zip: string
}

type Errors = Partial<Record<keyof PaymentDetails, string>>

const COUNTRIES = [
    { value: "US", label: "United States" },
    { value: "CA", label: "Canada" },
    { value: "GB", label: "United Kingdom" },
    { value: "DE", label: "Germany" },
    { value: "FR", label: "France" },
    { value: "ES", label: "Spain" },
    { value: "IN", label: "India" },
    { value: "BD", label: "Bangladesh" },
    { value: "AE", label: "United Arab Emirates" },
    { value: "AU", label: "Australia" },
]

/** Card brands shown on the panel — purely decorative. */
const CARD_BRANDS = ["VISA", "MASTERCARD", "AMEX"]

const inputClass =
    "h-12 w-full rounded-lg border border-white/10 bg-[#1A1A1F] pl-10 pr-3 text-base tracking-[-0.0125rem] text-[#EDEDEF] shadow-[inset_0_3px_10px_rgba(255,255,255,0.04)] outline-none transition-colors placeholder:text-white/40 focus:border-[#5C53FE]/60 focus:ring-2 focus:ring-[#5C53FE]/30 aria-invalid:border-red-500/60"

const labelClass = "mb-2 block text-left text-sm text-[#EDEDEF]/80"

const selectClass =
    "h-12 w-full appearance-none rounded-lg border border-white/10 bg-[#1A1A1F] pl-10 pr-10 text-base tracking-[-0.0125rem] text-[#EDEDEF] shadow-[inset_0_3px_10px_rgba(255,255,255,0.04)] outline-none transition-colors focus:border-[#5C53FE]/60 focus:ring-2 focus:ring-[#5C53FE]/30 aria-invalid:border-red-500/60"

/** "4242424242424242" → "4242 4242 4242 4242". */
const formatCardNumber = (value: string): string =>
    value
        .replace(/\D/g, "")
        .slice(0, 19)
        .replace(/(\d{4})(?=\d)/g, "$1 ")

/** "1228" → "12/28". */
const formatExpiry = (value: string): string => {
    const digits = value.replace(/\D/g, "").slice(0, 4)
    if (digits.length <= 2) return digits
    return `${digits.slice(0, 2)}/${digits.slice(2)}`
}

/** Luhn checksum — catches typos before the request leaves the browser. */
const passesLuhn = (number: string): boolean => {
    const digits = number.replace(/\D/g, "")
    if (digits.length < 13) return false

    let sum = 0
    let double = false
    for (let i = digits.length - 1; i >= 0; i--) {
        let digit = Number(digits[i])
        if (double) {
            digit *= 2
            if (digit > 9) digit -= 9
        }
        sum += digit
        double = !double
    }
    return sum % 10 === 0
}

/** "12/28" → { month, year }; year is the full 4-digit year. */
const parseExpiry = (value: string) => {
    const [month, year] = value.split("/")
    if (!month || !year) return null
    const monthNumber = Number(month)
    const fullYear = 2000 + Number(year)
    if (monthNumber < 1 || monthNumber > 12) return null
    return { month: monthNumber, year: fullYear }
}

export function PaymentForm({
    plan,
    redirectTo,
}: {
    plan: Plan
    /** Where to send the user after a successful payment. */
    redirectTo: string
}) {
    const [values, setValues] = React.useState<PaymentDetails>({
        name: "",
        number: "",
        expiry: "",
        cvc: "",
        country: "US",
        zip: "",
    })
    const [errors, setErrors] = React.useState<Errors>({})
    const [isPaying, setIsPaying] = React.useState(false)

    const setField =
        (field: keyof PaymentDetails) =>
        (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
            const raw = event.target.value
            const value =
                field === "number"
                    ? formatCardNumber(raw)
                    : field === "expiry"
                      ? formatExpiry(raw)
                      : field === "cvc"
                        ? raw.replace(/\D/g, "").slice(0, 4)
                        : raw

            setValues((prev) => ({ ...prev, [field]: value }))
            // Clear the field's error as soon as the user edits it.
            setErrors((prev) => ({ ...prev, [field]: undefined }))
        }

    const validate = (): Errors => {
        const next: Errors = {}

        if (!values.name.trim()) {
            next.name = "Enter the name on the card."
        }

        const digits = values.number.replace(/\D/g, "")
        if (!digits) {
            next.number = "Enter your card number."
        } else if (!passesLuhn(digits)) {
            next.number = "That card number doesn't look right."
        }

        const expiry = parseExpiry(values.expiry)
        if (!expiry || !/^\d{2}\/\d{2}$/.test(values.expiry)) {
            // Only checked once the field is complete — a half-typed "12/2"
            // would otherwise read as the year 2002.
            next.expiry = "Enter the expiry as MM/YY."
        } else {
            const now = new Date()
            const expired =
                expiry.year < now.getFullYear() ||
                (expiry.year === now.getFullYear() &&
                    expiry.month < now.getMonth() + 1)
            if (expired) next.expiry = "That card has expired."
        }

        if (!/^\d{3,4}$/.test(values.cvc)) {
            next.cvc = "Enter the 3 or 4 digit security code."
        }

        if (!values.country) {
            next.country = "Select a country."
        }

        return next
    }

    /**
     * Validates the form, then lets the browser POST it to
     * `/api/checkout_sessions`, which creates the Stripe Checkout session and
     * redirects to Stripe's hosted checkout page.
     */
    const handlePay = (event: React.FormEvent<HTMLFormElement>) => {
        if (isPaying) {
            event.preventDefault()
            return
        }

        const nextErrors = validate()
        setErrors(nextErrors)
        if (Object.keys(nextErrors).length > 0) {
            event.preventDefault()
            return
        }

        // Valid — let the form submit natively so the browser follows the
        // redirect to Stripe.
        setIsPaying(true)
    }

    const total = formatAmount(plan.amount, plan.currency)

    return (
        <form
            action="/api/checkout_sessions"
            method="post"
            onSubmit={handlePay}
            className="flex flex-col gap-5"
            noValidate
        >
            {/* Where to send the user once the payment completes. */}
            <input type="hidden" name="redirectTo" value={redirectTo} />

            {/* Card details
                The inputs here have no `name` attribute on purpose: a field
                without a name is never submitted, so the card details stay in
                the browser and never reach our server. Stripe collects the
                card on its own hosted checkout page. */}
            <section className="rounded-2xl border border-white/10 bg-[#101010]/95 p-6 shadow-[inset_0_3px_10px_rgba(255,255,255,0.04)]">
                <div className="mb-5 flex items-center justify-between gap-4">
                    <h2 className="text-[18px] font-semibold tracking-[-0.02em] text-[#EDEDEF]">
                        Card details
                    </h2>

                    <div className="flex items-center gap-1.5" aria-hidden>
                        {CARD_BRANDS.map((brand) => (
                            <span
                                key={brand}
                                className="rounded border border-white/10 bg-[#1A1A1F] px-1.5 py-0.5 text-[9px] font-semibold tracking-wider text-white/50"
                            >
                                {brand}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Cardholder name */}
                <div className="mb-5">
                    <label htmlFor="card-name" className={labelClass}>
                        Name on card
                    </label>
                    <div className="relative">
                        <User
                            aria-hidden
                            className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-white/50"
                        />
                        <input
                            id="card-name"
                            type="text"
                            autoComplete="cc-name"
                            required
                            maxLength={80}
                            value={values.name}
                            onChange={setField("name")}
                            placeholder="Jane Doe"
                            disabled={isPaying}
                            aria-invalid={Boolean(errors.name)}
                            aria-describedby={errors.name ? "card-name-error" : undefined}
                            className={inputClass}
                        />
                    </div>
                    {errors.name ? (
                        <p id="card-name-error" role="alert" className="mt-2 text-xs text-red-400">
                            {errors.name}
                        </p>
                    ) : null}
                </div>

                {/* Card number */}
                <div className="mb-5">
                    <label htmlFor="card-number" className={labelClass}>
                        Card number
                    </label>
                    <div className="relative">
                        <CreditCard
                            aria-hidden
                            className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-white/50"
                        />
                        <input
                            id="card-number"
                            type="text"
                            inputMode="numeric"
                            autoComplete="cc-number"
                            required
                            maxLength={23}
                            value={values.number}
                            onChange={setField("number")}
                            placeholder="4242 4242 4242 4242"
                            disabled={isPaying}
                            aria-invalid={Boolean(errors.number)}
                            aria-describedby={errors.number ? "card-number-error" : undefined}
                            className={inputClass}
                        />
                    </div>
                    {errors.number ? (
                        <p id="card-number-error" role="alert" className="mt-2 text-xs text-red-400">
                            {errors.number}
                        </p>
                    ) : null}
                </div>

                {/* Expiry + CVC */}
                <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                        <label htmlFor="card-expiry" className={labelClass}>
                            Expiry
                        </label>
                        <div className="relative">
                            <input
                                id="card-expiry"
                                type="text"
                                inputMode="numeric"
                                autoComplete="cc-exp"
                                required
                                maxLength={5}
                                value={values.expiry}
                                onChange={setField("expiry")}
                                placeholder="MM/YY"
                                disabled={isPaying}
                                aria-invalid={Boolean(errors.expiry)}
                                aria-describedby={errors.expiry ? "card-expiry-error" : undefined}
                                className={cn(inputClass, "pl-3")}
                            />
                        </div>
                        {errors.expiry ? (
                            <p id="card-expiry-error" role="alert" className="mt-2 text-xs text-red-400">
                                {errors.expiry}
                            </p>
                        ) : null}
                    </div>

                    <div>
                        <label htmlFor="card-cvc" className={labelClass}>
                            Security code
                        </label>
                        <div className="relative">
                            <Lock
                                aria-hidden
                                className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-white/50"
                            />
                            <input
                                id="card-cvc"
                                type="text"
                                inputMode="numeric"
                                autoComplete="cc-csc"
                                required
                                maxLength={4}
                                value={values.cvc}
                                onChange={setField("cvc")}
                                placeholder="123"
                                disabled={isPaying}
                                aria-invalid={Boolean(errors.cvc)}
                                aria-describedby={errors.cvc ? "card-cvc-error" : undefined}
                                className={inputClass}
                            />
                        </div>
                        {errors.cvc ? (
                            <p id="card-cvc-error" role="alert" className="mt-2 text-xs text-red-400">
                                {errors.cvc}
                            </p>
                        ) : null}
                    </div>
                </div>
            </section>

            {/* Billing address */}
            <section className="rounded-2xl border border-white/10 bg-[#101010]/95 p-6 shadow-[inset_0_3px_10px_rgba(255,255,255,0.04)]">
                <h2 className="mb-5 text-[18px] font-semibold tracking-[-0.02em] text-[#EDEDEF]">
                    Billing address
                </h2>

                <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                        <label htmlFor="country" className={labelClass}>
                            Country
                        </label>
                        <div className="relative">
                            <MapPin
                                aria-hidden
                                className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-white/50"
                            />
                            <select
                                id="country"
                                name="country"
                                autoComplete="country"
                                required
                                value={values.country}
                                onChange={setField("country")}
                                disabled={isPaying}
                                aria-invalid={Boolean(errors.country)}
                                aria-describedby={errors.country ? "country-error" : undefined}
                                className={selectClass}
                            >
                                {COUNTRIES.map((country) => (
                                    <option key={country.value} value={country.value}>
                                        {country.label}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown
                                aria-hidden
                                className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-white/50"
                            />
                        </div>
                        {errors.country ? (
                            <p id="country-error" role="alert" className="mt-2 text-xs text-red-400">
                                {errors.country}
                            </p>
                        ) : null}
                    </div>

                    <div>
                        <label htmlFor="zip" className={labelClass}>
                            ZIP / Postal code
                        </label>
                        <input
                            id="zip"
                            name="zip"
                            type="text"
                            autoComplete="postal-code"
                            maxLength={16}
                            value={values.zip}
                            onChange={setField("zip")}
                            placeholder="10001"
                            disabled={isPaying}
                            className={cn(inputClass, "pl-3")}
                        />
                    </div>
                </div>
            </section>

            {/* Pay */}
            <button
                type="submit"
                disabled={isPaying}
                className="flex h-[48px] w-full items-center justify-center gap-2 rounded-lg bg-[#FAFAFA] px-4 text-base font-medium text-[#0B0B0C] shadow-[0_1px_2px_rgba(0,0,0,0.35)] transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
            >
                {isPaying ? (
                    <>
                        <Loader2 aria-hidden className="size-4 animate-spin" />
                        Processing…
                    </>
                ) : (
                    <>
                        <Lock aria-hidden className="size-4" />
                        Pay {total}
                    </>
                )}
            </button>

            <p className="flex items-center justify-center gap-2 text-center text-xs text-white/50">
                <Lock aria-hidden className="size-3.5" />
                Secure checkout — your card is charged on Stripe&apos;s hosted
                page and never touches our servers.
            </p>
        </form>
    )
}
