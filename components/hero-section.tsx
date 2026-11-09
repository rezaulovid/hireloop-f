import Link from "next/link"
import { MapPinIcon, SearchIcon } from "lucide-react"

const trendingSearches = [
  "Product Designer",
  "AI Engineering",
  "DevOps Engineer",
]

const stars = [
  { left: 3, top: 12, size: 1, opacity: 0.45 },
  { left: 7, top: 38, size: 1, opacity: 0.3 },
  { left: 5, top: 72, size: 1.5, opacity: 0.5 },
  { left: 11, top: 88, size: 1, opacity: 0.4 },
  { left: 15, top: 22, size: 1, opacity: 0.35 },
  { left: 18, top: 56, size: 1, opacity: 0.25 },
  { left: 22, top: 80, size: 1, opacity: 0.45 },
  { left: 26, top: 10, size: 1, opacity: 0.3 },
  { left: 29, top: 42, size: 1.5, opacity: 0.35 },
  { left: 33, top: 68, size: 1, opacity: 0.3 },
  { left: 38, top: 90, size: 1, opacity: 0.5 },
  { left: 41, top: 18, size: 1, opacity: 0.25 },
  { left: 44, top: 52, size: 1, opacity: 0.2 },
  { left: 48, top: 84, size: 1.5, opacity: 0.4 },
  { left: 52, top: 30, size: 1, opacity: 0.2 },
  { left: 56, top: 62, size: 1, opacity: 0.25 },
  { left: 59, top: 8, size: 1, opacity: 0.3 },
  { left: 63, top: 92, size: 1, opacity: 0.45 },
  { left: 66, top: 46, size: 1, opacity: 0.2 },
  { left: 69, top: 74, size: 1.5, opacity: 0.35 },
  { left: 73, top: 20, size: 1, opacity: 0.3 },
  { left: 77, top: 58, size: 1, opacity: 0.25 },
  { left: 81, top: 86, size: 1, opacity: 0.45 },
  { left: 84, top: 34, size: 1.5, opacity: 0.3 },
  { left: 88, top: 12, size: 1, opacity: 0.35 },
  { left: 91, top: 64, size: 1, opacity: 0.25 },
  { left: 94, top: 40, size: 1, opacity: 0.4 },
  { left: 97, top: 78, size: 1.5, opacity: 0.5 },
  { left: 12, top: 50, size: 1, opacity: 0.2 },
  { left: 24, top: 32, size: 1, opacity: 0.2 },
  { left: 36, top: 76, size: 1, opacity: 0.25 },
  { left: 58, top: 22, size: 1, opacity: 0.2 },
  { left: 72, top: 40, size: 1, opacity: 0.2 },
  { left: 86, top: 52, size: 1, opacity: 0.2 },
]

function CalendarGlyph() {
  return (
    <svg
      aria-hidden="true"
      className="size-3.5 shrink-0"
      fill="none"
      viewBox="0 0 16 16"
    >
      <rect x="1" y="2.5" width="14" height="12.5" rx="2.5" fill="#ff7a00" />
      <path d="M1 6.5h14" stroke="#fff" strokeWidth="1.4" />
      <path
        d="M4.5 1v3M11.5 1v3"
        stroke="#ff7a00"
        strokeLinecap="round"
        strokeWidth="2"
      />
      <path
        d="M4.5 9.5h2M9.5 9.5h2M4.5 12h2M9.5 12h2"
        stroke="#fff"
        strokeLinecap="round"
        strokeWidth="1.2"
      />
    </svg>
  )
}

function HeroSection() {
  return (
    <section className="relative isolate flex min-h-[calc(100svh-4.75rem)] items-center justify-center overflow-hidden bg-[#08080b] px-4 py-20 text-white sm:min-h-[calc(100svh-5rem)] sm:px-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        {stars.map((star, index) => (
          <span
            key={index}
            className="absolute rounded-full bg-white"
            style={{
              height: star.size,
              left: `${star.left}%`,
              opacity: star.opacity,
              top: `${star.top}%`,
              width: star.size,
            }}
          />
        ))}
        <div className="absolute top-[45%] left-1/2 h-[420px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#4f46e5]/[0.07] blur-[130px]" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-[radial-gradient(ellipse_50%_100%_at_50%_100%,rgba(99,102,241,0.32),rgba(99,102,241,0.05)_48%,transparent_72%)]" />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#6366f1]/20 to-transparent" />
      </div>

      <div className="flex w-full max-w-3xl flex-col items-center text-center">
        <div className="flex items-center gap-3">
          <span className="hidden h-px w-10 bg-gradient-to-r from-transparent to-white/20 sm:block sm:w-20" />
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#141417] px-3 py-1.5 text-[10px] font-medium tracking-[0.16em] text-zinc-400 uppercase sm:text-[11px]">
            <CalendarGlyph />
            <span>
              <span className="font-semibold text-white">56,000+</span> new jobs
              this month
            </span>
          </span>
          <span className="hidden h-px w-10 bg-gradient-to-l from-transparent to-white/20 sm:block sm:w-20" />
        </div>

        <h1 className="mt-7 font-display text-[32px] leading-[1.1] font-bold tracking-tight text-balance sm:text-5xl lg:text-[56px] lg:leading-[1.08]">
          Find Your Dream Job Today
        </h1>

        <p className="mt-5 max-w-2xl text-sm leading-relaxed text-zinc-400 sm:text-base">
          HireLoop connects top talent with world-class companies. Browse
          thousands of curated opportunities and land your next role — faster.
        </p>

        <form
          action="/jobs"
          role="search"
          className="mt-9 flex w-full max-w-2xl flex-col gap-1 rounded-2xl border border-white/10 bg-[#131317] p-1.5 shadow-2xl shadow-black/40 transition-colors focus-within:border-white/20 focus-within:ring-2 focus-within:ring-brand-indigo/20 sm:flex-row sm:items-center"
        >
          <div className="flex h-11 min-w-0 flex-1 items-center gap-2.5 rounded-xl px-3">
            <SearchIcon className="size-4 shrink-0 text-zinc-500" />
            <input
              aria-label="Job title, skill or company"
              className="h-full w-full min-w-0 bg-transparent text-sm text-white placeholder:text-zinc-500 focus:outline-none"
              name="q"
              placeholder="Job title, skill or company"
              type="text"
            />
          </div>

          <span
            aria-hidden="true"
            className="mx-1 hidden h-5 w-px shrink-0 bg-white/10 sm:block"
          />

          <div className="mx-3 h-px bg-white/5 sm:hidden" />

          <div className="flex h-11 min-w-0 flex-1 items-center gap-2.5 rounded-xl px-3">
            <MapPinIcon className="size-4 shrink-0 text-zinc-500" />
            <input
              aria-label="Location or Remote"
              className="h-full w-full min-w-0 bg-transparent text-sm text-white placeholder:text-zinc-500 focus:outline-none"
              name="location"
              placeholder="Location or Remote"
              type="text"
            />
          </div>

          <button
            aria-label="Search jobs"
            className="flex h-11 w-full shrink-0 items-center justify-center rounded-xl bg-brand-indigo text-white transition-colors hover:bg-brand-indigo/90 focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:outline-none sm:w-11"
            type="submit"
          >
            <SearchIcon className="size-4" />
          </button>
        </form>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
          <span className="text-xs text-zinc-500">Trending Position</span>
          {trendingSearches.map((term) => (
            <Link
              key={term}
              href={`/jobs?q=${encodeURIComponent(term)}`}
              className="rounded-full border border-white/10 bg-[#141417] px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:border-white/20 hover:bg-white/5 hover:text-white"
            >
              {term}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export { HeroSection }
