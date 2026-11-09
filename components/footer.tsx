"use client"

import Link from "next/link"
import { ExternalLink, GitBranch, Mail, X } from "lucide-react"

import { BrandLogo } from "@/components/brand-logo"
import { cn } from "@/lib/utils"

type FooterLink = {
  label: string
  href: string
  external?: boolean
  icon?: React.ComponentType<{ className?: string }>
}

const footerColumns: { title: string; items: FooterLink[] }[] = [
  {
    title: "Platform",
    items: [
      { label: "Browse Jobs", href: "/jobs" },
      { label: "Pricing", href: "/pricing" },
      { label: "Get Started", href: "/get-started" },
    ],
  },
  {
    title: "Account",
    items: [
      { label: "Sign In", href: "/sign-in" },
      { label: "Sign Up", href: "/sign-up" },
    ],
  },
  {
    title: "Company",
    items: [
      { label: "About HireLoop", href: "/" },
      { label: "Contact", href: "mailto:hello@hireloop.com", icon: Mail },
    ],
  },
  {
    title: "Follow",
    items: [
      { label: "Twitter / X", href: "https://twitter.com/hireloop", external: true, icon: X },
      { label: "LinkedIn", href: "https://linkedin.com/company/hireloop", external: true, icon: ExternalLink },
      { label: "GitHub", href: "https://github.com/hireloop", external: true, icon: GitBranch },
    ],
  },
]

const socialLinks: { href: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { href: "https://twitter.com/hireloop", icon: X },
  { href: "https://linkedin.com/company/hireloop", icon: ExternalLink },
  { href: "https://github.com/hireloop", icon: GitBranch },
]

function FooterLinkItem({ item }: { item: FooterLink }) {
  const Icon = item.icon
  if (item.external) {
    return (
      <Link
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-sm text-zinc-300 transition-colors hover:text-white"
      >
        {Icon && <Icon className="size-4" aria-hidden="true" />}
        {item.label}
      </Link>
    )
  }
  return (
    <Link
      href={item.href}
      className={cn(
        "text-sm text-zinc-300 transition-colors hover:text-white",
        Icon ? "inline-flex items-center gap-1.5" : "",
      )}
    >
      {Icon && <Icon className="size-4" aria-hidden="true" />}
      {item.label}
    </Link>
  )
}

function FooterColumn({ title, items }: { title: string; items: FooterLink[] }) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-xs font-semibold tracking-wider uppercase text-zinc-400">
        {title}
      </h3>
      {items.map((item) => (
        <FooterLinkItem key={item.href} item={item} />
      ))}
    </div>
  )
}

function Footer() {
  return (
    <footer className="bg-[#08080b] border-t border-white/[0.06]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-12 lg:py-16">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
            <div className="flex flex-col gap-4 lg:max-w-[360px]">
              <BrandLogo className="h-9 w-auto shrink-0" href="/" />
              <p className="text-sm text-zinc-400 leading-relaxed">
                Connecting top talent with world-class companies.
              </p>
              <div className="flex items-center gap-3">
                {socialLinks.map(({ href, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="size-9 rounded-lg border border-white/10 bg-[#131317] flex items-center justify-center transition-colors hover:bg-white/5 hover:border-white/20"
                    aria-label={Icon.name}
                  >
                    <Icon className="size-4 text-zinc-400" aria-hidden="true" />
                  </Link>
                ))}
              </div>
            </div>

            <div
              className={cn(
                "mt-8 lg:mt-0 flex flex-col lg:flex-row lg:gap-12 w-full lg:w-auto",
                "border-t border-white/[0.05] pt-8 lg:border-t-0 lg:pt-0",
              )}
            >
              {footerColumns.map((column) => (
                <FooterColumn key={column.title} {...column} />
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/[0.05] flex flex-col md:flex-row justify-between items-center gap-4 px-4 py-8 sm:px-6 lg:px-8">
          <p className="text-xs text-zinc-500">
            © {new Date().getFullYear()} HireLoop, Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export { Footer }
