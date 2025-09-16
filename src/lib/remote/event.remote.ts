import { command, query } from '$app/server';
import { Events } from '$lib/server/neisandb';
import { createSession, getUserID, logout } from './auth.remote';
import { Status } from '$lib/utils/endpoint/status';
import { error, redirect } from '@sveltejs/kit';
import { CreateEventSchema } from './event.utils';
import { validUserID } from './$utils';

export const createEvent = command(CreateEventSchema, async (data) => {
	const userID = await getUserID();
	if (!validUserID(userID)) {
		await logout();
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

	await createSession(userID)

	return { message: 'Event Created' };
});

type ModelShape<T> = T extends (new (...args: Array<any>) => infer U) ? U : never;

export const createdEvents = query(async () => {
	const userID = await getUserID();
	if (!validUserID(userID)) return;

	const events = Events.find(([, record]) => record.creator === userID);
	if (!events || !events.length) return;

	const model = events[0]
	type EventJSON = typeof model.json

	return events.reduce<Array<EventJSON>>((list, event) => [...list, event.json], []);
});

export const moderatingEvents = query(async () => {
	const userID = await getUserID();
	if (!validUserID(userID)) return;

	return Events.find(([, record]) => record.moderators.includes(userID)) ?? undefined;
});

export const attendingEvents = query(async () => {
	const userID = await getUserID();
	if (!validUserID(userID)) return;

	return (
		Events.find(([, record]) => {
			for (const attendee of record.attendees) {
				if (attendee.user && attendee.user === userID) return true;
			}
			return false;
		}) ?? undefined
	);
});
