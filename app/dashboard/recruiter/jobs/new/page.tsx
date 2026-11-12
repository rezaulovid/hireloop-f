"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Briefcase, Calendar, MapPin } from "lucide-react"
import { createJob } from "@/lib/actions/jobs"
import { toast } from "@/components/ui/toast"
import { useRouter } from "next/navigation"
import type { JobFormData, JobType } from "@/lib/types"
import { Card } from "@/components/ui/card"
import { SectionHeader } from "@/app/components/SectionHeader"
import { inputClass } from "@/lib/styles"

const JOB_CATEGORIES = [
    "Engineering & Tech",
    "Design",
    "Product",
    "Marketing",
    "Infrastructure",
    "Quality",
]

const JOB_TYPES: JobType[] = ["full-time", "part-time", "contract", "internship"]

export default function NewJobPage() {
    const [form, setForm] = useState<JobFormData>({
        title: "",
        companyName: "",
        category: "",
        jobType: "full-time",
        isRemote: false,
        location: "",
        deadline: "",
        responsibilities: "",
        requirements: "",
         applicants: 0,
    status: "active",
    })
        const router = useRouter()

    // Generic flat setter so every field is just setField("key")(value).
    const set =
        <K extends keyof JobFormData>(key: K) =>
            (value: JobFormData[K]) =>
                setForm((prev) => ({ ...prev, [key]: value }))

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const jobData: JobFormData = { ...form }
        console.log("new job form data:", jobData)
        // TODO: wire into the backend (`POST /jobs` or similar).

        const result = await createJob(jobData);
        if(result.insertedId){
   console.log("createJob result:", result);
    toast.add({
                title: "Job created",
                description: "The job has been succssfully.",
            })
               router.push('/dashboard/recruiter/jobs')
        }
    }

    return (
        <div className="mx-auto w-full max-w-3xl px-4 py-8">
            <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
                <div className="flex flex-col gap-1.5">
                    <p className="text-xs font-medium tracking-wide text-[#03030d] uppercase">
                        Create New Listing
                    </p>
                    <h1 className="font-heading text-[28px] leading-[1.15] font-bold tracking-[-0.02em] text-black">
                        Post a New Job
                    </h1>
                    <p className="text-sm text-black/60">
                        Fill in the position specifications to attract qualified talent across
                        our network.
                    </p>
                </div>

            </header>

            <form id="new-job-form" onSubmit={handleSubmit} className="flex flex-col gap-6">
                {/* 1. Basic Information */}
                <Card className="p-6">
                    <SectionHeader step="1" title="Basic Information" />

                    <div className="flex flex-col gap-5">
                        {/* Job Title */}
                        <div className="flex flex-col gap-2   text-white">
                            <Label htmlFor="title">Job title</Label>
                            <Input
                                id="title"
                                name="title"
                                required
                                minLength={3}
                                maxLength={80}
                                value={form.title}
                                onChange={(e) => set("title")(e.target.value)}
                                placeholder="e.g. Senior Product Designer"
                                className={inputClass}
                            />
                        </div>

                        {/* Company Name & Job Category */}
                        <div className="grid gap-5 sm:grid-cols-2  text-white">
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="companyName">Company name</Label>
                                <div className="relative">
                                    <Briefcase
                                        aria-hidden
                                        className="pointer-events-none 
                                        absolute top-1/2 left-3 size-4
                                         -translate-y-1/2 text-white"
                                    />
                                    <Input
                                        id="companyName"
                                        name="companyName"
                                        required
                                        value={form.companyName}
                                        onChange={(e) => set("companyName")(e.target.value)}
                                        placeholder="Acme Inc."
                                        className={`${inputClass} pl-9`}
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col gap-2  text-white">
                                <Label htmlFor="category">Job category</Label>
                                <Select
                                    value={form.category || ''}
                                    onValueChange={(value) => set("category")(value ?? "")}
                                >
                                    <SelectTrigger id="category" className={`${inputClass} w-full`}>
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {JOB_CATEGORIES.map((category) => (
                                            <SelectItem key={category} value={category}>
                                                {category}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Job Type */}
                        <fieldset className="flex flex-col gap-2  text-white">
                            <legend className="text-sm text-[#EDEDEF]/80">Job type</legend>
                            <RadioGroup
                                value={form.jobType}
                                onValueChange={(value) => set("jobType")(value as JobType)}
                                className="grid grid-cols-2 gap-2 sm:grid-cols-4"
                            >
                                {JOB_TYPES.map((type) => {
                                    const selected = form.jobType === type

                                    return (
                                        <Label
                                            key={type}
                                            htmlFor={`job-type-${type}`}
                                            className={
                                                "flex h-11 cursor-pointer items-center justify-center rounded-lg border text-sm capitalize transition-colors has-[input:focus-visible]:ring-2 has-[input:focus-visible]:ring-[#5C53FE]/60 " +
                                                (selected
                                                    ? "border-[#5C53FE] bg-[#5C53FE]/15 text-white"
                                                    : "border-white/10 bg-[#1A1A1F] text-white/70 hover:border-white/25 hover:text-white")
                                            }
                                        >
                                            <RadioGroupItem
                                                value={type}
                                                id={`job-type-${type}`}
                                                className="sr-only"
                                            />
                                            {type}
                                        </Label>
                                    )
                                })}
                            </RadioGroup>
                        </fieldset>
                    </div>
                </Card>

                {/* 2. Location & Timeline */}
                <Card className="p-6">
                    <SectionHeader step="2" title="Location &amp; Timeline" />

                    <div className="flex flex-col gap-5  text-white">
                        {/* Remote Work Allowed (isRemote) */}
                        <div className="flex items-center justify-between gap-4 rounded-lg border border-white/10 bg-[#1A1A1F] p-4">
                            <div className="flex flex-col gap-1">
                                <Label htmlFor="isRemote" className="text-white/90">
                                    Remote work allowed
                                </Label>
                                <p className="text-xs text-white">
                                    Enable worldwide or distributed candidate applications
                                </p>
                            </div>
                            <Switch
                                id="isRemote"
                                checked={form.isRemote}
                                onCheckedChange={(checked) => set("isRemote")(checked)}
                            />
                        </div>

                        {/* Job Location & Application Deadline */}
                        <div className="grid gap-5 sm:grid-cols-2  text-white">
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="location">
                                    Job location <span className="text-destructive/70">*</span>
                                </Label>
                                <div className="relative">
                                    <MapPin
                                        aria-hidden
                                        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-white/50"
                                    />
                                    <Input
                                        id="location"
                                        name="location"
                                        required={!form.isRemote}
                                        value={form.location}
                                        onChange={(e) => set("location")(e.target.value)}
                                        placeholder="e.g. New York, USA"
                                        className={`${inputClass} pl-9`}
                                    />
                                </div>
                                <p className="text-xs text-white">Required</p>
                            </div>
                            <div className="flex flex-col gap-2  text-white">
                                <Label htmlFor="deadline">Application deadline</Label>
                                <div className="relative">
                                    <Calendar
                                        aria-hidden
                                        className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-white/50"
                                    />
                                    <Input
                                        id="deadline"
                                        name="deadline"
                                        type="date"
                                        value={form.deadline}
                                        onChange={(e) => set("deadline")(e.target.value)}
                                        className={inputClass}
                                    />
                                </div>
                            </div>
                        </div>

                    </div>
                </Card>

                {/* 3. Responsibilities & Requirements */}
                <Card className="p-6 text-white">
                    <SectionHeader step="3" title="Responsibilities &amp; Requirements" />

                    <div className="flex flex-col gap-5  text-white">
                        <div className="flex flex-col gap-2  text-white">
                            <Label htmlFor="responsibilities">Key responsibilities</Label>
                            <Textarea
                                id="responsibilities"
                                name="responsibilities"
                                required
                                rows={5}
                                maxLength={2000}
                                placeholder="Describe the key responsibilities of the role…"
                                value={form.responsibilities}
                                onChange={(e) => set("responsibilities")(e.target.value)}
                                className={inputClass}
                            />
                        </div>
                        <div className="flex flex-col gap-2  text-white">
                            <Label htmlFor="requirements">Qualifications &amp; requirements</Label>
                            <Textarea
                                id="requirements"
                                name="requirements"
                                required
                                rows={5}
                                maxLength={2000}
                                placeholder={"• 3+ years of experience with…\n• Solid understanding of…"}
                                value={form.requirements}
                                onChange={(e) => set("requirements")(e.target.value)}
                                className={inputClass}
                            />
                        </div>
                    </div>
                </Card>
                <section>
                    <Button type="submit" form="new-job-form" className="bg-[#5C53FE] hover:bg-[#7B74FF]">
                        <Briefcase aria-hidden />
                        Publish Job
                    </Button>
                </section>
            </form>
        </div>
    )
}