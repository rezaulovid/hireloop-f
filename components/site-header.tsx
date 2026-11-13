"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { MenuIcon, XIcon } from "lucide-react"

import { BrandLogo } from "@/components/brand-logo"
import { useSession,signOut } from "@/lib/auth-client"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"



function SiteHeader() {
  const [open, setOpen] = React.useState(false)
  const closeButtonRef = React.useRef<HTMLButtonElement>(null)
  const { data: session, isPending } = useSession()
  const pathname = usePathname()

  // The dashboard renders its own sidebar + topbar (see app/dashboard).
  if (pathname?.startsWith("/dashboard")) return null

const navLinks = [
  { label: "Browse Jobs", href: "/jobs" },
  { label: "Company", href: "/company" },
  { label: "Pricing", href: "/pricing" },
  { label: "Dashboard", href: `/dashboard/${session?.user.role || 'seeker'}` },
] as const


 const handleSignOut = async () => {
    await signOut()
  }


  return (
    <header className="sticky top-0 z-50 bg-[#08080b] px-3 pt-3 sm:px-4 sm:pt-4">
      <nav
        aria-label="Main"
        className="mx-auto flex h-16 w-full items-center justify-between gap-4 rounded-xl border border-white/[0.06] bg-[#1b1b20] px-4 shadow-lg shadow-black/20 sm:px-6"
      >
        <BrandLogo />

        <div className="hidden items-center gap-8 md:flex">
          <div className="flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[15px] font-medium text-zinc-300 transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div aria-hidden="true" className="h-6 w-px bg-white/15" />
          <div className="flex items-center gap-6">
  {isPending ? null : session?.user ? (
    <>
      <span className="text-[#EDEDEF]">
        Welcome, {session.user.name}!
      </span>

      <Button
        onClick={handleSignOut}
        nativeButton={false}
        className="h-[38px] rounded-[8px] bg-transparent px-4 text-lg font-semibold text-[#645AFF] hover:bg-white/5 hover:text-[#645AFF]"
      >
        Sign Out
      </Button>
    </>
  ) : (
    <>
      <Link
        href="/sign-in"
        className="text-[15px] font-medium text-indigo-400 transition-colors hover:text-indigo-300"
      >
        Sign In
      </Link>

      <Link
        href="/sign-up"
        className={cn(
          buttonVariants({ size: "lg" }),
          "h-10 rounded-xl bg-brand-indigo px-5 text-[15px] font-medium text-white hover:bg-brand-indigo/90"
        )}
      >
        Get Started
      </Link>
    </>
  )}
</div>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            render={
              <Button
                aria-label="Open menu"
                className="text-zinc-300 hover:bg-white/10 hover:text-white md:hidden"
                size="icon"
                variant="ghost"
              />
            }
          >
            <MenuIcon />
          </SheetTrigger>

          <SheetContent
            className="w-[min(20rem,85vw)] border-l border-white/10 bg-[#141417] p-0 text-white"
            initialFocus={closeButtonRef}
            showCloseButton={false}
            side="right"
          >
            <SheetHeader className="flex-row items-center justify-between border-b border-white/10 px-5 py-4">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <SheetDescription className="sr-only">
                Browse the main hireloop navigation.
              </SheetDescription>
              <BrandLogo onClick={() => setOpen(false)} />
              <SheetClose
                render={
                  <Button
                    aria-label="Close menu"
                    className="text-zinc-400 hover:bg-white/10 hover:text-white"
                    ref={closeButtonRef}
                    size="icon-sm"
                    variant="ghost"
                  />
                }
              >
                <XIcon />
              </SheetClose>
            </SheetHeader>

            <nav aria-label="Mobile" className="flex flex-col gap-1 px-3 py-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-3 text-base font-medium text-zinc-300 transition-colors hover:bg-white/5 hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="mt-auto flex flex-col gap-3 border-t border-white/10 p-5">
              <Link
                href="/sign-in"
                onClick={() => setOpen(false)}
                className="flex h-11 items-center justify-center rounded-xl border border-white/10 text-[15px] font-medium text-indigo-300 transition-colors hover:bg-white/5 hover:text-indigo-200"
              >
                Sign In
              </Link>
              <Link
                href="/get-started"
                onClick={() => setOpen(false)}
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "h-11 w-full rounded-xl bg-brand-indigo px-5 text-[15px] font-medium text-white hover:bg-brand-indigo/90"
                )}
              >
                Get Started
              </Link>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  )
}

export { SiteHeader }
