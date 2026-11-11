import { cn } from "cn"

/**
 * Numbered heading inside a dark card section, e.g. "① Basic Information".
 */
function SectionHeader({
  step,
  title,
  className,
}: {
  step: string | number
  title: string
  className?: string
}) {
  return (
    <h2
      className={cn(
        "mb-6 flex items-center gap-3 font-heading text-lg font-semibold tracking-[-0.02em] text-white",
        className
      )}
    >
      <span className="flex size-7 items-center justify-center rounded-lg bg-[#5C53FE]/15 text-sm font-semibold text-[#8B85FF]">
        {step}
      </span>
      {title}
    </h2>
  )
}

export { SectionHeader }
