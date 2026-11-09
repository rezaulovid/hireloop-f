import Image from "next/image"
import Link from "next/link"

import logo from "@/app/images/logo.png"
import { cn } from "@/lib/utils"

function BrandLogo({
  className,
  href = "/",
  ...props
}: Omit<React.ComponentProps<typeof Link>, "href"> & { href?: string }) {
  return (
    <Link
      aria-label="hireloop home"
      className={cn("inline-flex shrink-0 items-center", className)}
      href={href}
      {...props}
    >
      <Image alt="" className="h-8 w-auto" priority src={logo} />
    </Link>
  )
}

export { BrandLogo }
