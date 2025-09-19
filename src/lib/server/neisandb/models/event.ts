import type { DBModelProperties } from "@neisanworks/neisandb"
import z from "zod/v4"
import { CreateEventSchema } from "$lib/remote/event.utils";
import { AddressModel } from "$lib/remote/$common";
import { formatDate } from "$lib/utils/common";
import { EventJSONSchema } from "$lib/schemas/events";

export const EventAttendeeSchema = z.object({
    user: z.number().min(0).optional(),
    total: z.number().min(1).default(1),
    items: z.array(z.string().nonempty()).optional()
})
export type EventAttendeeSchema = typeof EventAttendeeSchema;

export const EventSchema = z.object({
	...CreateEventSchema.shape,
    creator: z.number().min(0),
	moderators: z.array(z.number().min(0)).default([]),
    attendees: z.array(EventAttendeeSchema).default([]),
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
    addressline1: string
    addressline2?: string
    city: string
    state: string
    zip: string
    moderators: Array<number>
    attendees: Array<EventAttendantModel>
    private: boolean

    constructor(data: z.infer<EventSchema>, id: number) {
        this.id = id
        this.title = data.title
        this.creator = data.creator
        this.date = new Date(data.date)
        this.time = data.time
        this.addressline1 = data.addressline1
        this.addressline2 = data.addressline2
        this.city = data.city
        this.state = data.state
        this.zip = data.zip
        this.moderators = data.moderators
        this.attendees = data.attendees.map((attendee) => new EventAttendantModel(attendee));
        this.private = data.private
    }

    get address(): AddressModel {
        return new AddressModel({
            addressline1: this.addressline1,
            addressline2: this.addressline2,
            city: this.city,
            state: this.state,
            zip: this.zip
        })
    }

    get addressString(): string {
        return `${this.addressline1}${this.addressline2 ? `, ${this.addressline2}` : ''}, ${this.city}, ${this.state} ${this.zip}`
    }

    get items(): Array<string> {
        return this.attendees.flatMap((attendee) => attendee.items ?? []);
    }

    get totalAttendees(): number {
        return this.attendees.reduce((total, attendee) => total + attendee.total, 0);
    }

    get json(): z.core.output<EventJSONSchema> {
        const parse = EventJSONSchema.safeParse(this);
        if (!parse.success) {
            console.log(parse.error.message)
            throw new Error(parse.error.message);
        };
        return parse.data
    }
}
