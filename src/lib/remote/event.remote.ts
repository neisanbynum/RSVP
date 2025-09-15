import { command, query } from '$app/server';
import { Events } from '$lib/server/neisandb';
import { getUserID } from './auth.remote';
import { Status } from '$lib/utils/endpoint/status';
import { error } from '@sveltejs/kit';
import { CreateEventSchema } from './event.utils';

export const createEvent = command(CreateEventSchema, async (data) => {
	const userID = await getUserID();
	if (!userID) {
		error(Status.UNAUTHORIZED, 'User Not Authenticated');
	}

	const event = Events.create({
		...data,
		creator: userID,
		moderators: [],
		attendees: []
	});
	if (!event.success) {
		error(
			Status.INTERNAL_SERVER_ERROR,
			Object.values(event.errors).at(0) ?? 'Failed to Create Event'
		);
    }
    
    return { message: "Event Created" };
});

export const createdEvents = query(async () => {
	const userID = await getUserID();
	if (!userID) return;

	return Events.find(([, record]) => record.creator === userID) ?? undefined;
});

export const moderatingEvents = query(async () => {
	const userID = await getUserID();
	if (!userID) return;

	return Events.find(([, record]) => record.moderators.includes(userID)) ?? undefined;
});

export const attendingEvents = query(async () => {
	const userID = await getUserID();
	if (!userID) return;

	return (
		Events.find(([, record]) => {
			for (const attendee of record.attendees) {
				if (attendee.user && attendee.user === userID) return true;
			}
			return false;
		}) ?? undefined
	);
});
