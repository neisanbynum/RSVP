import { command, getRequestEvent, query } from '$app/server';
import { error } from '@sveltejs/kit';
import { Status } from '$lib/utils/endpoint/status';
import { hash } from 'bcrypt';
import { COOKIE_ENCRYPTION_KEY, PASSWORD_PEPPER, SESSION_COOKIE_KEY } from '$env/static/private';
import { UserIDSchema, SessionCookieSchema, validUserID } from './$utils';
import { LoginSchema, RegisterSchema } from './auth.utils';
import { Profiles, Users } from '$lib/server/neisandb';
import { decrypt, encrypt } from '$lib/utils/encryption/helpers';

export const createSession = command(UserIDSchema, async (id) => {
	const { cookies, getClientAddress } = getRequestEvent();
	const validate = await SessionCookieSchema.safeParseAsync({
		userID: id,
		client: getClientAddress()
	});
	if (!validate.success) {
		error(Status.INTERNAL_SERVER_ERROR, 'Unable to Authenticate User');
	}

	const PROD = import.meta.env.MODE === 'production';
	const encrypted = encrypt(JSON.stringify(validate.data), COOKIE_ENCRYPTION_KEY);
	cookies.set(SESSION_COOKIE_KEY, encrypted, {
		httpOnly: true,
		path: '/',
		expires: new Date(Date.now() + 1000 * 60 * 60)
		// sameSite: PROD ? 'strict' : 'none',
		// secure: PROD ? true : false
	});
});

export const logout = command(() => {
	const { cookies } = getRequestEvent();
	cookies.delete(SESSION_COOKIE_KEY, { path: '/' });
});

export const login = command(LoginSchema, async (data) => {
	const user = Users.findOne({ email: data.email });
	const profile = Profiles.findOne({ email: data.email });
	if (!user || !profile) {
		error(Status.UNAUTHORIZED, { message: 'Invalid Email Address/Password' });
	}

	const authenticated = await user.authenticate(data.password);
	if (!authenticated) {
		user.attempts++;
		const save = Users.save(user);
		if (!save.success) {
			if (import.meta.env.DEV) console.error(save.errors);
			error(Status.INTERNAL_SERVER_ERROR, 'Failed to Update User');
		}

		error(Status.UNAUTHORIZED, { message: 'Invalid Email Address/Password' });
	}

	user.attempts = 0;
	const save = Users.save(user);
	if (!save.success) {
		if (import.meta.env.DEV) console.error(save.errors);
		error(Status.INTERNAL_SERVER_ERROR, 'Failed to Update User');
	}

	await createSession(user.id);

	return { message: `Welcome, ${profile.shortname}!` };
});

export const register = query(
	RegisterSchema,
	async ({ last, first, middle, prefermiddle, email, phone, password }) => {
		const saveuser = Users.create({
			email,
			hashedpassword: await hash(password + PASSWORD_PEPPER, 10),
			attempts: 0
		});
		if (!saveuser.success) {
			if (import.meta.env.DEV) console.error(saveuser.errors);
			error(Status.CONFLICT, 'Existing Account Associated w/ Email Address');
		}

		const saveprofile = Profiles.create({
			last,
			first,
			middle: middle ?? undefined,
			prefermiddle,
			email,
			phone
		});
		if (!saveprofile.success) {
			if (import.meta.env.DEV) console.error(saveprofile.errors);
			error(Status.CONFLICT, 'Existing Account Associated w/ Email Address/Phone Number');
		}

		return { message: `Account Created!` };
	}
);

export const getUserID = query(async () => {
	const { cookies } = getRequestEvent();
	const encrypted = cookies.get(SESSION_COOKIE_KEY);
	if (!encrypted) return;

	const decrypted = decrypt(encrypted, COOKIE_ENCRYPTION_KEY);
	const validate = await SessionCookieSchema.safeParseAsync(JSON.parse(decrypted));
	if (!validate.success) {
		return;
	}

	return validate.data.userID;
});

export const userName = query(async () => {
	const userID = await getUserID();
	if (!validUserID(userID)) {
		return;
	}

	const profile = Profiles.findOne(userID);
	if (!profile) {
		return;
	}

	if (import.meta.env.DEV) {
		console.log({ function: "userName", userID, name: profile.shortname })
	}

	return profile.shortname;
});
