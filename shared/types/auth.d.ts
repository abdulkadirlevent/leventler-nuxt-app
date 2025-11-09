// auth.d.ts
import type {AvatarProps} from "@nuxt/ui";
import type {UserStatus} from "~/types";

declare module '#auth-utils' {
    interface User {
        id: string
        name: string
        email: string
        username: string
        location: string
        provider: 'github'
        providerId: number
        avatar?: AvatarProps
        status: UserStatus
    }
}

export {}