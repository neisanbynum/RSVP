import { getRequestEvent } from "$app/server";
import { SESSION_COOKIE_KEY, COOKIE_ENCRYPTION_KEY } from "$env/static/private";
import { decrypt } from "$lib/utils/encryption/helpers";
import z from "zod/v4"

export const UserIDSchema = z.coerce.number('Invalid User ID').min(0);
export function validUserID(data: unknown): data is number {
    return UserIDSchema.safeParse(data).success;
}

export const SessionCookieSchema = z.object({
    userID: UserIDSchema,
    client: z.ipv4('Invalid IP Address').or(z.string())
});
export async function getUser() {
    const { cookies, getClientAddress } = getRequestEvent();

    const encrypted = cookies.get(SESSION_COOKIE_KEY);
    if (!encrypted) return null;

    const decrypted = decrypt(encrypted, COOKIE_ENCRYPTION_KEY);
    const validate = await SessionCookieSchema.safeParseAsync(JSON.parse(decrypted));
    if (!validate.success) {
        cookies.delete(SESSION_COOKIE_KEY, { path: '/' });
        return null;
    }

    const client = getClientAddress();
    if (client !== validate.data.client) {
        cookies.delete(SESSION_COOKIE_KEY, { path: '/' });
        return null;
    }

    return validate.data.userID;
}
