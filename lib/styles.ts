/**
 * Shared dark-theme utility classes, so repeated styling lives in one place.
 * These are "delta" classes — applied on top of the ui primitives' own styling.
 */

/** Dark input/select fields rendered on dark Cards (bg, borders, focus ring). */
export const inputClass =
  "bg-[#1A1A1F] border-white/10 focus-visible:border-[#5C53FE]/60 focus-visible:ring-[#5C53FE]/30 aria-invalid:border-destructive/60"

/** Small pill used for job type badges. */
export const typePillClass =
  "inline-flex items-center whitespace-nowrap rounded-lg border border-white/10 bg-[#1A1A1F] px-2.5 py-0.5 text-xs capitalize text-white/80"
