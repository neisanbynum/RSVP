import z from 'zod/v4';

export const IDSchema = z.coerce.number().min(0);
export type IDSchema = typeof IDSchema;

export const AddressSchema = z.object({
	addressline1: z.string().nonempty(),
	addressline2: z.string().optional(),
	city: z.string().nonempty(),
	state: z.string().nonempty(),
	zip: z.coerce
		.string()
		.regex(/^\d{5}$/, 'Invalid Zip Code')
		.or(z.string().regex(/^\d{5}-\d{4}$/, 'Invalid Zip Code'))
});
export type AddressSchema = typeof AddressSchema;
