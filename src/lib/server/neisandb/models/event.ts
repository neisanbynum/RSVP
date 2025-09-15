import type { DBModelProperties } from "@neisanworks/neisandb"
import z from "zod/v4"
import { CreateEventSchema } from "$lib/remote/event.utils";
import { AddressModel } from "$lib/remote/$common";

export const EventAttendeeSchema = z.object({
    user: z.number().min(0).optional(),
    total: z.number().min(1).default(1),
    items: z.array(z.string().nonempty()).optional()
})
export type EventAttendeeSchema = typeof EventAttendeeSchema;

export const EventSchema = z.object({
	...CreateEventSchema.shape,
    creator: z.number().min(0),
	moderators: z.array(z.number().min(0)),
    attendees: z.array(EventAttendeeSchema),
});
export type EventSchema = typeof EventSchema

class EventAttendantModel implements z.infer<EventAttendeeSchema> {
	user?: number;
	total: number;
	items?: Array<string>;

	constructor(data: z.infer<EventAttendeeSchema>) {
		this.user = data.user;
		this.total = data.total;
		this.items = data.items;
	}
}

export class EventModel implements DBModelProperties<EventSchema> {
    id: number
    title: string
    creator: number
    date: Date
    time: string
    address: AddressModel
    moderators: Array<number>
    attendees: Array<EventAttendantModel>
    private: boolean

    constructor(data: z.infer<EventSchema>, id: number) {
        this.id = id
        this.title = data.title
        this.creator = data.creator
        this.date = data.date
        this.time = data.time
        this.address = new AddressModel(data.address)
        this.moderators = data.moderators
        this.attendees = data.attendees.map((attendee) => new EventAttendantModel(attendee));
        this.private = data.private
    }

    get items(): Array<string> {
        return this.attendees.flatMap((attendee) => attendee.items ?? []);
    }

    get totalAttendees(): number {
        return this.attendees.reduce((total, attendee) => total + attendee.total, 0);
    }
}
