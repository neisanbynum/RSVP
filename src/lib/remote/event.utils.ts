import z from 'zod/v4';
import { AddressSchema } from './$common';

export const CreateEventSchema = z.object({
    title: z.string().nonempty(),
    date: z.date(),
    time: z.coerce.string("Invalid Time").regex(/^[0-9]{2}:[0-9]{2}$/, 'Invalid Time'),
    address: AddressSchema,
    private: z.boolean().default(false)
});
