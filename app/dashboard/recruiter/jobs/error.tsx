"use client"

import { useEffect } from "react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function JobsError({
    error,
    retry,
}: {
    error: unknown
    retry: () => void
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error)
    }, [error])

    const message =
        error instanceof Error ? error.message : "An unexpected error occurred."

    return (
        <div className="mx-auto w-full max-w-6xl px-4 py-8">
            <Card className="p-6 text-sm">
                <p className="font-medium text-[#EDEDEF]">Failed to load job posts</p>
                <p className="mt-1 text-white/60">{message}</p>
                <Button onClick={retry} className="mt-4 bg-[#5C53FE] hover:bg-[#7B74FF]">
                    Try again
                </Button>
            </Card>
        </div>
    )
}
