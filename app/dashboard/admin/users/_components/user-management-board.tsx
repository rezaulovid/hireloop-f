"use client"

import { useState } from "react"
import { Check, Search, ShieldCheck, Users, UserRound, BriefcaseBusiness } from "lucide-react"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import type { UserRole } from "@/lib/types"
import { cn } from "@/lib/utils"

type ManagedUser = {
    id: string
    name: string
    email: string
    emailVerified: boolean
    image?: string | null
    createdAt: Date | string
    role?: string
}

type UserFilter = "all" | UserRole

const roleOptions: { value: UserRole; label: string }[] = [
    { value: "seeker", label: "Seeker" },
    { value: "recruiter", label: "Recruiter" },
    { value: "admin", label: "Admin" },
]

const filterOptions: { value: UserFilter; label: string }[] = [
    { value: "all", label: "All users" },
    { value: "seeker", label: "Seekers" },
    { value: "recruiter", label: "Recruiters" },
    { value: "admin", label: "Admins" },
]

const tableHeaderClass = "px-4 py-3 text-left text-xs font-medium text-[#777781]"

function getInitials(name: string) {
    return name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase() || "U"
}

function UserAvatar({ user }: { user: ManagedUser }) {
    return (
        <span className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-md border border-white/10 bg-[#242428] text-xs font-semibold text-[#EDEDEF]">
            {user.image ? (
                // eslint-disable-next-line @next/next/no-img-element -- Profile image URLs are user-provided.
                <img src={user.image} alt="" className="size-full object-cover" />
            ) : (
                getInitials(user.name || user.email)
            )}
        </span>
    )
}

function StatCard({
    label,
    value,
    icon: Icon,
}: {
    label: string
    value: number
    icon: typeof Users
}) {
    return (
        <div className="flex items-start justify-between border border-white/10 bg-[#141418] px-5 py-4 shadow-[0_1px_2px_rgba(0,0,0,0.35)]">
            <div>
                <dt className="text-[13px] text-[#A0A0AB]">{label}</dt>
                <dd className="mt-2 text-[25px] leading-8 font-semibold text-[#EDEDEF]">
                    {value.toLocaleString()}
                </dd>
            </div>
            <Icon aria-hidden className="mt-0.5 size-[18px] text-[#8D8D97]" />
        </div>
    )
}

function formatJoinedDate(value: Date | string) {
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return "—"

    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        timeZone: "UTC",
    }).format(date)
}

export function UserManagementBoard({
    users,
    total,
}: {
    users: readonly ManagedUser[]
    total: number
}) {
    const [activeFilter, setActiveFilter] = useState<UserFilter>("all")
    const [searchValue, setSearchValue] = useState("")

    const counts = {
        seeker: users.filter((user) => user.role === "seeker").length,
        recruiter: users.filter((user) => user.role === "recruiter").length,
        admin: users.filter((user) => user.role === "admin").length,
    }
    const normalizedSearch = searchValue.trim().toLowerCase()
    const filteredUsers = users.filter((user) => {
        const matchesRole = activeFilter === "all" || user.role === activeFilter
        const matchesSearch =
            !normalizedSearch ||
            user.name.toLowerCase().includes(normalizedSearch) ||
            user.email.toLowerCase().includes(normalizedSearch)

        return matchesRole && matchesSearch
    })

    function handleRoleChange(userId: string, role: UserRole) {
        void userId
        void role
    }

    return (
        <div>
            <header className="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <p className="mb-1 text-[11px] font-medium tracking-[0.12em] text-[#8D8D97] uppercase">
                        Workspace / Admin
                    </p>
                    <h1 className="text-[22px] font-semibold text-[#EDEDEF]">User management</h1>
                    <p className="mt-1 text-[13px] text-[#A0A0AB]">
                        Review accounts and manage access across Hireloop.
                    </p>
                </div>
                <div className="flex items-center gap-2 text-[13px] text-[#A0A0AB]">
                    <span className="size-2 rounded-full bg-[#22C55E]" aria-hidden />
                    {total.toLocaleString()} accounts
                </div>
            </header>

            <dl className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
                <StatCard label="Total users" value={total} icon={Users} />
                <StatCard label="Seekers" value={counts.seeker} icon={UserRound} />
                <StatCard label="Recruiters" value={counts.recruiter} icon={BriefcaseBusiness} />
                <StatCard label="Admins" value={counts.admin} icon={ShieldCheck} />
            </dl>

            <section className="mt-6 overflow-hidden border border-white/10 bg-[#141418] shadow-[0_1px_2px_rgba(0,0,0,0.35)]">
                <div className="flex flex-col gap-4 border-b border-white/10 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-wrap items-center gap-1" role="group" aria-label="Filter users by role">
                        {filterOptions.map(({ value, label }) => (
                            <button
                                key={value}
                                type="button"
                                aria-pressed={activeFilter === value}
                                onClick={() => setActiveFilter(value)}
                                className={cn(
                                    "h-8 rounded px-3 text-[13px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5C53FE]/60",
                                    activeFilter === value
                                        ? "bg-white/[0.09] text-[#EDEDEF]"
                                        : "text-[#8D8D97] hover:bg-white/[0.04] hover:text-[#EDEDEF]",
                                )}
                            >
                                {label}
                                <span className="ml-1.5 text-[11px] text-[#777781]">
                                    {value === "all" ? users.length : counts[value]}
                                </span>
                            </button>
                        ))}
                    </div>

                    <label className="relative block w-full sm:max-w-[270px]" htmlFor="user-search">
                        <span className="sr-only">Search users</span>
                        <Search aria-hidden className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#777781]" />
                        <input
                            id="user-search"
                            type="search"
                            value={searchValue}
                            onChange={(event) => setSearchValue(event.target.value)}
                            placeholder="Search name or email"
                            className="h-9 w-full rounded-md border border-white/10 bg-[#1A1A1F] pr-3 pl-9 text-[13px] text-[#EDEDEF] outline-none placeholder:text-[#777781] focus:border-white/20 focus:ring-2 focus:ring-white/10"
                        />
                    </label>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[760px] text-left">
                        <thead>
                            <tr className="bg-[#1A1A1F]">
                                <th scope="col" className={cn(tableHeaderClass, "pl-5")}>User</th>
                                <th scope="col" className={tableHeaderClass}>Role</th>
                                <th scope="col" className={tableHeaderClass}>Email status</th>
                                <th scope="col" className={tableHeaderClass}>Joined</th>
                                <th scope="col" className={cn(tableHeaderClass, "pr-5 text-right")}>Manage role</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="h-[68px] border-t border-white/[0.07]">
                                    <td className="pl-5">
                                        <div className="flex min-w-0 items-center gap-3">
                                            <UserAvatar user={user} />
                                            <div className="min-w-0">
                                                <p className="truncate text-[13px] font-medium text-[#EDEDEF]">
                                                    {user.name || "Unnamed user"}
                                                </p>
                                                <p className="truncate text-xs text-[#8D8D97]">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4">
                                        <span className="inline-flex items-center rounded border border-white/10 bg-white/[0.04] px-2 py-1 text-xs text-[#C9C9D0]">
                                            {roleOptions.find((option) => option.value === user.role)?.label ?? "Unassigned"}
                                        </span>
                                    </td>
                                    <td className="px-4">
                                        {user.emailVerified ? (
                                            <span className="inline-flex items-center gap-1.5 text-xs text-[#7DD3A6]">
                                                <Check aria-hidden className="size-3.5" /> Verified
                                            </span>
                                        ) : (
                                            <span className="text-xs text-[#A0A0AB]">Unverified</span>
                                        )}
                                    </td>
                                    <td className="px-4 text-[13px] text-[#A0A0AB]">
                                        {formatJoinedDate(user.createdAt)}
                                    </td>
                                    <td className="pr-5 text-right">
                                        <Select
                                            defaultValue={roleOptions.some((option) => option.value === user.role) ? user.role : undefined}
                                            onValueChange={(value) => handleRoleChange(user.id, value as UserRole)}
                                        >
                                            <SelectTrigger
                                                aria-label={`Change role for ${user.name || user.email}`}
                                                className="ml-auto h-8 w-[132px] rounded-md border-white/10 bg-[#1A1A1F] text-xs text-[#D4D4D9] hover:bg-[#222228]"
                                            >
                                                <SelectValue placeholder="Assign role" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {roleOptions.map((option) => (
                                                    <SelectItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </td>
                                </tr>
                            ))}
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-4 py-12 text-center text-[13px] text-[#8D8D97]">
                                        No users match this search.
                                    </td>
                                </tr>
                            ) : null}
                        </tbody>
                    </table>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/10 px-5 py-3.5 text-xs text-[#8D8D97]">
                    <span>
                        Showing {filteredUsers.length} of {users.length} loaded users
                    </span>
                    <span>{total.toLocaleString()} total accounts</span>
                </div>
            </section>
        </div>
    )
}