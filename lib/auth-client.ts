import type { auth } from "@/lib/auth"
import { createAuthClient } from "better-auth/react"
import { inferAdditionalFields } from "better-auth/client/plugins"

export const authClient = createAuthClient({
    /** The base URL of the server (optional if you're using the same domain) */
     baseURL: process.env.BETTER_AUTH_URL,
    // Lets the client know about the `role` additional field defined in lib/auth.ts
    plugins: [inferAdditionalFields<typeof auth>()],
})


export const { signIn, signUp, signOut, useSession } = createAuthClient({
    plugins: [inferAdditionalFields<typeof auth>()],
})
