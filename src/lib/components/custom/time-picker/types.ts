import z from 'zod/v4';

export const TimeSchema = z
	.string()
	.regex(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)
    .or(z.string().regex(/^(0[0-9]|1[0-2]):[0-5][0-9] (AM|PM)$/));
export type TimeSchema = typeof TimeSchema;
export type Time = z.infer<typeof TimeSchema>;

export type TimePickerProperties = {
	class?: string;
    value?: Time;
    onValueChange?: (value?: Time) => void;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
};
