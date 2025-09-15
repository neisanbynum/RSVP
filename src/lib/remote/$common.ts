import z from 'zod/v4';

export const IDSchema = z.number().min(0);

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

export class AddressModel implements z.infer<AddressSchema> {
	addressline1: string;
	addressline2?: string;
	city: string;
	state: string;
	zip: string;

	constructor(data: z.infer<AddressSchema>) {
		this.addressline1 = data.addressline1;
		this.addressline2 = data.addressline2;
		this.city = data.city;
		this.state = data.state;
		this.zip = data.zip;
	}
}
