import { TimeSchema } from '$lib/components/custom/time-picker';
import z from 'zod/v4';
import { AddressSchema, IDSchema } from './common';
import { formatDate } from '$lib/utils/common';

export const CreateEventSchema = z.object({
	title: z.string().nonempty(),
	date: z.date(),
	time: TimeSchema,
	...AddressSchema.shape,
	private: z.boolean().default(false)
});
export type CreateEventSchema = typeof CreateEventSchema;

export const AttendEventFormSchema = z.object({
	eventID: IDSchema,
	attendees: z.coerce.number().min(1),
	items: z.array(z.string().nonempty()).default([])
})
export type AttendEventFormSchema = typeof AttendEventFormSchema

export const EventAttendeeSchema = z.object({
	user: z.number().min(0).optional(),
	total: z.number().min(1).default(1),
	items: z.array(z.string().nonempty()).optional()
});
export type EventAttendeeSchema = typeof EventAttendeeSchema;

export const EventSchema = z.object({
	...CreateEventSchema.shape,
	creator: z.number().min(0),
	moderators: z.array(z.number().min(0)).default([]),
	attendees: z.array(EventAttendeeSchema).default([])
});
export type EventSchema = typeof EventSchema;

export const EventAccessFormSchema = z.object({
	code: z.string().nonempty()
});

export const EventJSONSchema = z
	.object({
		...EventSchema.shape,
		id: IDSchema
	})
	.transform((event) => {
		return {
			...event,
			date: formatDate(event.date),
			totalAttendees: event.attendees.reduce((total, attendee) => total + attendee.total, 0),
			items: event.attendees.flatMap((attendee) => attendee.items ?? []),
			addressString: `${event.addressline1}${event.addressline2 ? `, ${event.addressline2}` : ''}, ${event.city}, ${event.state} ${event.zip}`
		};
	});
export type EventJSONSchema = typeof EventJSONSchema;
