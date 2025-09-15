import { PASSWORD_PEPPER } from "$env/static/private"
import type { DBModelProperties } from "@neisanworks/neisandb"
import { compare, hash } from "bcrypt"
import z from "zod/v4"

export const UserSchema = z.object({
    email: z.email(),
    hashedpassword: z.string(),
    attempts: z.number().min(0).default(0)
})
export type UserSchema = typeof UserSchema

export class UserModel implements DBModelProperties<UserSchema> {
    id: number
    email: string
    hashedpassword: string
    attempts: number

    constructor(data: z.infer<UserSchema>, id: number) {
        this.id = id
        this.email = data.email
        this.hashedpassword = data.hashedpassword
        this.attempts = data.attempts
    }

    async authenticate(password: string): Promise<boolean> {
        return await compare(password + PASSWORD_PEPPER, this.hashedpassword)
    }

    static async hashpassword(password: string): Promise<string> {
        return await hash(password + PASSWORD_PEPPER, 10)
    }
}
