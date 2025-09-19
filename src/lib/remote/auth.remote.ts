import { command, getRequestEvent, query } from '$app/server';
import { Profiles, SessionCookies, Users } from '$lib/server/neisandb';
import { hash } from 'bcrypt';
import { LoginSchema, RegisterSchema } from './auth.utils';
import { COOKIE_ENCRYPTION_KEY, PASSWORD_PEPPER, SESSION_COOKIE_KEY } from '$env/static/private';
import { Status } from '$lib/utils/endpoint/status';
import { error } from '@sveltejs/kit';
import { SessionCookieSchema, UserIDSchema, validUserID } from './$utils';
import { decrypt, encrypt } from '$lib/utils/encryption/helpers';

const PROD = import.meta.env.MODE === 'production';

export const register = command(
	RegisterSchema,
	async ({ last, first, middle, prefermiddle, email, phone, password }) => {
		const user = Users.create({
			email,
			hashedpassword: await hash(password + PASSWORD_PEPPER, 10)
		});
		if (!user.success) {
			error(
				Status.CONFLICT,
				'general' in user.errors ? user.errors.general : 'Failed to Create User'
			);
		}

		const profile = Profiles.create({ last, first, middle, prefermiddle, email, phone });
		if (!profile.success) {
			error(
				Status.CONFLICT,
				'general' in profile.errors ? profile.errors.general : 'Failed to Create Profile'
			);
		}

		return { message: `Account Created!` };
	}
);

export const login = command(LoginSchema, async ({ email, password }) => {
	const user = Users.findOne({ email });
	const profile = Profiles.findOne({ email });
	if (!user || !profile) {
		error(Status.UNAUTHORIZED, { message: 'Invalid Email Address/Password' });
	}

	const authenticated = await user.authenticate(password);
	if (!authenticated) {
		user.attempts++;
		const save = Users.save(user);
		if (!save.success) {
			error(Status.INTERNAL_SERVER_ERROR, 'Failed to Authenticate User');
		}

		error(Status.UNAUTHORIZED, { message: 'Invalid Email Address/Password' });
	}

	user.attempts = 0;
	const save = Users.save(user);
	if (!save.success) {
		error(Status.INTERNAL_SERVER_ERROR, 'Failed to Authenticate User');
	}

	await createSession(user.id);

	return { message: `Welcome, ${profile.shortname}!` };
});

export const createSession = command(UserIDSchema, async (userID) => {
	const client = getRequestEvent().getClientAddress();

	const existing =
		SessionCookies.find(({ doc }) => doc.userID === userID || doc.client === client) ?? [];
	if (existing.length > 1) {
		for (const session of existing) {
			const deleted = SessionCookies.delete(session);
			if (!deleted.success) {
				if (!PROD) console.error(deleted.errors);
				error(Status.INTERNAL_SERVER_ERROR, 'Unable to Authenticate User');
			}
			existing.splice(existing.indexOf(session), 1);
		}
	}

	const session = existing.at(0);
	if (!session) {
		const create = SessionCookies.create({ userID, client });
		if (!create.success) {
			if (!PROD) console.error(create.errors);
			error(Status.INTERNAL_SERVER_ERROR, 'Unable to Authenticate User');
		}
		return;
	}

	session.refresh();
	const save = SessionCookies.save(session);
	if (!save.success) {
		if (!PROD) console.error(save.errors);
		error(Status.INTERNAL_SERVER_ERROR, 'Unable to Authenticate User');
	}
});

export const logout = command(async () => {
	const client = getRequestEvent().getClientAddress();

	const userID = await getUserID();
	if (!validUserID(userID)) return;

	const sessions = SessionCookies.find(({ doc }) => doc.userID === userID || doc.client === client);
	if (!sessions) return;

	for (const session of sessions) {
		const deleted = SessionCookies.delete(session);
		if (!deleted.success) {
			if (!PROD) console.error(deleted.errors);
			error(Status.INTERNAL_SERVER_ERROR, 'Unable to Authenticate User');
		}
	}

	return { message: 'Logged Out' };
});

export const getSession = query(async () => {
	const client = getRequestEvent().getClientAddress();

	const session = SessionCookies.findOne({ client });
	if (!session) return;

	if (session.isExpired) {
		if (!PROD) console.log('Session Expired');
		const deleted = SessionCookies.delete(session);
		if (!deleted.success) {
			if (!PROD) console.error(deleted.errors);
			error(Status.INTERNAL_SERVER_ERROR, 'Unable to Authenticate User');
		}
		return;
	}

	session.refresh();
	const save = SessionCookies.save(session);
	if (!save.success) {
		if (!PROD) console.error(save.errors);
		error(Status.INTERNAL_SERVER_ERROR, 'Unable to Authenticate User');
	}

	return session.json
});

export const authenticated = query(async () => {
	const session = await getSession();
	return !!session;
});

export const getUserID = query(async () => {
	const session = await getSession();
	if (!session) return;

	return session.userID;
});

export const getProfile = query(async () => {
	const userID = await getUserID();
	if (!validUserID(userID)) return;

	return Profiles.findOne(userID);
});

export const getUserName = query(async () => {
	const session = await getSession();
	if (!session) return;

	const profile = Profiles.findOne(session.userID);
	if (!profile) return;

	return profile.shortname;
});
