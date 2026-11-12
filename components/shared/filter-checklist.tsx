// Shared sidebar filter group — matches the Figma "Aside - Sidebar Filters"
// rows: 13px #A0A0AB labels, right-aligned #6E6E78 counts, and custom square
// toggles that flip white when checked.

import { CheckIcon } from "lucide-react"

export type FilterOption = {
  value: string
  label: string
  /** Display count for the row (e.g. 1234 → "1.2k"). */
  count: number
}

/** 1234 → "1.2k" */
const formatCount = (count: number) =>
  count >= 1000
    ? `${(count / 1000).toFixed(1).replace(/\.0$/, "")}k`
    : `${count}`

/** One filter row: custom square toggle + label + count, pure CSS checked state. */
function FilterRow({
  option,
  name,
  multiple,
}: {
  option: FilterOption
  name: string
  multiple: boolean
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5">
      <input
        type={multiple ? "checkbox" : "radio"}
        name={name}
        className="peer sr-only"
      />
      <span
        aria-hidden
        className="flex size-4 shrink-0 items-center justify-center rounded border border-white/15 bg-[#1A1A1F] transition-colors peer-checked:border-white peer-checked:bg-white peer-checked:[&>svg]:opacity-100 peer-focus-visible:ring-2 peer-focus-visible:ring-[#5C53FE]/60"
      >
        <CheckIcon className="size-3 text-[#03030d] opacity-0" />
      </span>
      <span className="text-[13px] text-[#A0A0AB] transition-colors peer-checked:text-white">
        {option.label}
      </span>
      <span className="ml-auto text-xs text-[#6E6E78]">{formatCount(option.count)}</span>
    </label>
  )
}

/**
 * A labelled group of filter rows. Radio rows by default (single-select —
 * options share the `name`, so checking one clears the others); checkbox rows
 * when `multiple`. Selection is visual only — no state, no query params
 * (wired up separately).
 */
function FilterChecklist({
  legend,
  name,
  options,
  multiple = false,
}: {
  legend: string
  /** Shared input name — radios with the same name toggle each other off. */
  name: string
  options: FilterOption[]
  /** True → checkbox rows (multi-select); default radio rows (single-select). */
  multiple?: boolean
}) {
  return (
    <fieldset>
      <legend className="text-sm font-semibold text-white">{legend}</legend>
      <div className="mt-3 flex flex-col gap-2.5">
        {options.map((option) => (
          <FilterRow key={option.value} option={option} name={name} multiple={multiple} />
        ))}
      </div>
    </fieldset>
  )
}

export { FilterChecklist }
