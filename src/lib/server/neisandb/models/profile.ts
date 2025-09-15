import type { DBModelProperties } from '@neisanworks/neisandb';
import { titleCase } from 'title-case';
import z from 'zod/v4';

export const NameSchema = z.string().transform((name) => titleCase(name));
export const ProfileSchema = z.object({
	last: NameSchema,
	first: NameSchema,
	middle: NameSchema.optional(),
	prefermiddle: z.boolean().default(false),
	email: z.email(),
	phone: z.coerce
		.string()
		.regex(/^[0-9]{10}$/, 'Invalid Phone Number')
		.transform((phone) => `+1 (${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6)}`)
		.or(z.string().regex(/^\+1 \(\d{3}\) \d{3}-\d{4}$/, 'Invalid Phone Number'))
});
export type ProfileSchema = typeof ProfileSchema;

export class ProfileModel implements DBModelProperties<ProfileSchema> {
    id: number;
    last: string;
    first: string;
    middle?: string;
    prefermiddle: boolean;
    email: string;
    phone: string;
    
    constructor(data: z.infer<ProfileSchema>, id: number) {
        this.id = id
        this.last = data.last
        this.first = data.first
        this.middle = data.middle
        this.prefermiddle = data.prefermiddle
        this.email = data.email
        this.phone = data.phone
    }

    get contact(): Record<'email' | 'phone', string> {
        return { email: this.email, phone: this.phone };
    }

    get preferedname(): string {
        return this.prefermiddle && this.middle ? this.middle : this.first
    }

    get shortname(): string {
        return `${this.preferedname} ${this.last}`
    }

    get fullname(): string {
        return `${this.first}${this.middle ? ` ${this.middle}` : ''} ${this.last}`
    }
}
