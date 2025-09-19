import { UserIDSchema } from "$lib/remote/$utils"
import z from "zod/v4"

export const SessionCookieTimeout = () => new Date(Date.now() + 1000 * 60 * 10);
export const SessionCookieSchema = z.object({
    userID: UserIDSchema,
    client: z.ipv4('Invalid IP Address').or(z.string()),
    expires: z.date().default(() => SessionCookieTimeout())
})
export type SessionCookieSchema = typeof SessionCookieSchema
