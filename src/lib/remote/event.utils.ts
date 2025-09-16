import z from 'zod/v4';
import { AddressSchema } from './$common';
import { TimeSchema } from '$lib/components/custom/time-picker';

export const CreateEventSchema = z.object({
    title: z.string().nonempty(),
    date: z.date(),
    time: TimeSchema,
    ...AddressSchema.shape,
    private: z.boolean().default(false)
});
