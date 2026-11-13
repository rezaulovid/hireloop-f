"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
    Bookmark,
    Briefcase,
    Building2,
    FileText,
    LayoutDashboard,
    LogOut,
    PlusCircle,
    Settings,
    Users,
    Wallet,
    type LucideIcon,
} from "lucide-react"

import { BrandLogo } from "@/components/brand-logo"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { signOut, useSession } from "@/lib/auth-client"
import { cn } from "cn"
import type { UserRole } from "@/lib/types"

type MenuItem = {
    id: string
    name: string
    url: string
    icon: LucideIcon
}

// Sidebar nav from the `HL 2.0/Sidebar` Figma component (per-role variants).
const menuItemsByRole: Record<UserRole, MenuItem[]> = {
    seeker: [
        { id: "dashboard", name: "Dashboard", url: "/dashboard/seeker", icon: LayoutDashboard },
        { id: "jobs", name: "Jobs", url: "/dashboard/seeker/jobs", icon: Briefcase },
        { id: "saved-jobs", name: "Saved Jobs", url: "/dashboard/seeker/saved-jobs", icon: Bookmark },
        { id: "applications", name: "Applications", url: "/dashboard/seeker/applications", icon: FileText },
        { id: "billing", name: "Billing", url: "/dashboard/seeker/billing", icon: Wallet },
        { id: "settings", name: "Settings", url: "/dashboard/seeker/settings", icon: Settings },
    ],
    recruiter: [
        { id: "dashboard", name: "Dashboard", url: "/dashboard/recruiter", icon: LayoutDashboard },
        { id: "my-company", name: "My Company", url: "/dashboard/recruiter/my-company", icon: Building2 },
        { id: "manage-jobs", name: "Manage Jobs", url: "/dashboard/recruiter/jobs", icon: Briefcase },
        { id: "add-job", name: "Add Job", url: "/dashboard/recruiter/jobs/new", icon: PlusCircle },
        { id: "applications", name: "Applications", url: "/dashboard/recruiter/applications", icon: FileText },
        { id: "settings", name: "Settings", url: "/dashboard/recruiter/settings", icon: Settings },
    ],
    admin: [
        { id: "dashboard", name: "Dashboard", url: "/dashboard/admin", icon: LayoutDashboard },
        { id: "users", name: "Users", url: "/dashboard/admin/users", icon: Users },
        { id: "companies", name: "Companies", url: "/dashboard/admin/companies", icon: Building2 },
        { id: "jobs", name: "Jobs", url: "/dashboard/admin/jobs", icon: Briefcase },
        { id: "payments", name: "Payments", url: "/dashboard/admin/payments", icon: Wallet },
        { id: "settings", name: "Settings", url: "/dashboard/admin/settings", icon: Settings },
    ],
}

const tierLabelByRole: Record<UserRole, string> = {
    seeker: "Professional Tier",
    recruiter: "Recruiter Account",
    admin: "Administrator",
}

function isActivePath(pathname: string, url: string) {
    if (pathname === url) return true
    // The dashboard roots are prefixes of every other page in that role.
    if (url === "/dashboard/seeker" || url === "/dashboard/recruiter" || url === "/dashboard/admin") {
        return false
    }
    return pathname.startsWith(`${url}/`)
}

export function DashboardSidebar() {
    const pathname = usePathname()
    const router = useRouter()
    const { data: session } = useSession()
    const role: UserRole = session?.user?.role || "seeker"
    const items = menuItemsByRole[role]

    const name = session?.user?.name || "Seeker Portal"
    const initials =
        name
            .split(" ")
            .map((part) => part[0])
            .join("")
            .slice(0, 2)
            .toUpperCase() || "HL"

    const handleSignOut = async () => {
        await signOut()
        router.push("/")
        router.refresh()
    }

    return (
        <Sidebar className="border-r border-white/[0.07] bg-[#0b0b0d]">
            <SidebarHeader className="gap-4 px-4 pt-5 pb-4">
                <BrandLogo className="h-8" />

                <div className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-[#111113] p-2.5">
                    <span
                        aria-hidden
                        className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-[#1a1a1f] text-[11px] font-semibold text-[#cdcbff]"
                    >
                        {session?.user?.image ? (
                            // eslint-disable-next-line @next/next/no-img-element -- avatar URLs are user-provided
                            <img
                                alt=""
                                src={session.user.image}
                                className="size-full object-cover"
                            />
                        ) : (
                            initials
                        )}
                    </span>
                    <div className="flex min-w-0 flex-col">
                        <span className="truncate text-[13px] font-medium text-[#EDEDEF]">
                            {name}
                        </span>
                        <span className="truncate text-[11px] text-white/40">
                            {tierLabelByRole[role]}
                        </span>
                    </div>
                </div>
            </SidebarHeader>

            <SidebarContent className="px-2">
                <SidebarGroup className="p-0">
                    <SidebarMenu className="gap-1">
                        {items.map((item) => (
                            <SidebarMenuItem key={item.id}>
                                <SidebarMenuButton
                                    render={<Link href={item.url} />}
                                    isActive={isActivePath(pathname, item.url)}
                                    className="h-9 gap-2.5 rounded-lg px-3 text-[13px] font-medium text-white/55 transition-colors hover:bg-white/[0.04] hover:text-white data-active:bg-white/[0.07] data-active:text-white [&_svg]:size-4"
                                >
                                    <item.icon aria-hidden />
                                    <span>{item.name}</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="mt-auto gap-2 p-4">
                <Link
                    href={role === "seeker" ? "/dashboard/seeker/settings" : "/dashboard/recruiter/jobs/new"}
                    className={cn(
                        "flex h-9 w-full items-center justify-center rounded-lg bg-[#FAFAFA] px-3 text-[13px] font-medium text-[#0B0B0C] transition-colors hover:bg-white",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5C53FE]/60"
                    )}
                >
                    {role === "seeker" ? "Post Resume" : "Post a Job"}
                </Link>
                <button
                    type="button"
                    onClick={handleSignOut}
                    className="flex h-9 w-full items-center gap-2.5 rounded-lg px-3 text-left text-[13px] font-medium text-white/45 transition-colors hover:bg-white/[0.04] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5C53FE]/60"
                >
                    <LogOut aria-hidden className="size-4" />
                    Logout
                </button>
            </SidebarFooter>
        </Sidebar>
    )
}
