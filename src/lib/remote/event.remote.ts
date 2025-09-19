import { command, query } from '$app/server';
import { Events } from '$lib/server/neisandb';
import { createSession, getUserID, logout } from './auth.remote';
import { Status } from '$lib/utils/endpoint/status';
import { error } from '@sveltejs/kit';
import { validUserID } from './$utils';
import {
	AttendEventFormSchema,
	CreateEventSchema,
	EventAccessFormSchema
} from '$lib/schemas/events';
import { decrypt, encrypt } from '$lib/utils/encryption/helpers';
import { EVENT_ACCESS_CODE_ENCRYPTION_KEY } from '$env/static/private';
import z from 'zod/v4';

export const createEvent = command(CreateEventSchema, async (data) => {
	const userID = await getUserID();
	if (!validUserID(userID)) {
		await logout();
		error(Status.UNAUTHORIZED, 'User Not Authenticated');
	}

	const event = Events.create({ ...data, creator: userID });
	if (!event.success) {
		error(
			Status.INTERNAL_SERVER_ERROR,
			'general' in event.errors ? event.errors.general : 'Failed to Create Event'
		);
	}

	await createSession(userID);

	return { message: 'Event Created' };
});

export const getCreatedEvents = query(async () => {
	const userID = await getUserID();
	if (!validUserID(userID)) return [];

	return (Events.find(({ doc }) => doc.creator === userID) ?? [])
		.sort((a, b) => (a.date < b.date ? -1 : 1))
		.map((event) => event.json);
});

export const createdEvents = query(async () => {
	const userID = await getUserID();
	if (!validUserID(userID)) return [];

	const events = Events.find(({ doc }) => doc.creator === userID);
	if (!events || !events.length) return [];

	const model = events[0];
	type EventJSON = typeof model.json;

	return events.reduce<Array<EventJSON>>((list, event) => [...list, event.json], []);
});

export const getModeratingEvents = query(async () => {
	const userID = await getUserID();
	if (!validUserID(userID)) return [];

	return (Events.find(({ doc }) => doc.moderators.includes(userID)) ?? [])
		.sort((a, b) => (a.date < b.date ? -1 : 1))
		.map((event) => event.json);
});

export const getAttendingEvents = query(async () => {
	const userID = await getUserID();
	if (!validUserID(userID)) return [];

	return (
		Events.find(({ doc }) => {
			for (const attendee of doc.attendees) {
				if (!import.meta.env.PROD) console.log(attendee);
				if (validUserID(attendee.user) && attendee.user === userID) return true;
			}
			return false;
		}) ?? []
	)
		.sort((a, b) => (a.date < b.date ? -1 : 1))
		.map((event) => event.json);
});

export const getEventAccessCode = command(z.number().min(0), async (eventID) => {
	const event = Events.findOne(eventID);
	if (!event) return;

	const decrypted = `${event.id}:${event.title}`;
	return { code: encrypt(decrypted, EVENT_ACCESS_CODE_ENCRYPTION_KEY) };
});

export const getEvent = command(EventAccessFormSchema, async ({ code }) => {
	const decrypted = decrypt(code, EVENT_ACCESS_CODE_ENCRYPTION_KEY);
	const [id] = decrypted.split(':');
	return Events.findOne(parseInt(id))?.json;
});

export const attendEvent = command(AttendEventFormSchema, async (data) => {
	const userID = await getUserID();

	const event = Events.findOne(data.eventID);
	if (!event) {
		error(Status.NOT_FOUND, 'Event Not Found');
	}

	if (userID) {
		const existing = event.attendees.find(({ user }) => user === userID);
		if (existing) {
			error(Status.CONFLICT, 'User Already Attending Event');
		}
	}

	event.attendees.push({ user: userID, total: data.attendees, items: data.items });
	const save = Events.save(event);
	if (!save.success) {
		error(Status.INTERNAL_SERVER_ERROR, 'Failed to Submit Attendance');
	}

	return { message: 'Attendance Confirmed' };
});
