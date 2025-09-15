import { command, getRequestEvent, query } from '$app/server';
import z from "zod/v4"
import { db } from '../server/db';
import { profiles, users } from '../server/db/schema';
import { eq } from 'drizzle-orm';
import { error } from '@sveltejs/kit';
import { Status } from '$lib/utils/endpoint/status';
import { compare, hash } from 'bcrypt';
import { COOKIE_ENCRYPTION_KEY, PASSWORD_PEPPER, SESSION_COOKIE_KEY } from '$env/static/private';
import { UserIDSchema, SessionCookieSchema } from './$utils';
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
	if (!PROD) console.log(import.meta.env.MODE);
	const encrypted = encrypt(JSON.stringify(validate.data), COOKIE_ENCRYPTION_KEY);
	cookies.set(SESSION_COOKIE_KEY, encrypted, {
		httpOnly: true,
		path: '/',
		expires: new Date(Date.now() + 1000 * 60 * 10),
		// sameSite: PROD ? 'strict' : 'none',
		// secure: PROD ? true : false
	});
	if (!PROD) console.log(cookies.get(SESSION_COOKIE_KEY));

	if (!PROD) console.log(validate.data);
});

export const login = command(LoginSchema, async (data) => {
	const user = Users.findOne({ email: data.email });
	const profile = Profiles.findOne({ email: data.email });
	if (!user || !profile) {
		error(Status.UNAUTHORIZED, { message: 'Invalid Email Address/Password' });
	}

	console.log({ user, profile });

	const authenticated = await user.authenticate(data.password);
	if (!authenticated) {
		user.attempts++
		const save = Users.save(user);
		if (!save.success) {
			console.error(save.errors);
			error(Status.INTERNAL_SERVER_ERROR, 'Failed to Update User');
		}

		error(Status.UNAUTHORIZED, { message: 'Invalid Email Address/Password' });
	}

	user.attempts = 0
	const save = Users.save(user)
	if (!save.success) {
		console.error(save.errors);
		error(Status.INTERNAL_SERVER_ERROR, "Failed to Update User");
	}

	// const entry = db
	// 	.select()
	// 	.from(users)
	// 	.leftJoin(profiles, eq(users.id, profiles.id))
	// 	.where(eq(users.email, data.email))
	// 	.get();
	// if (!entry || !entry.profiles) {
	// 	error(Status.UNAUTHORIZED, { message: 'Invalid Email Address/Password' });
	// }
	// console.log(entry);

	// const {
	// 	users: { id, password, attempts: pastattempts },
	// 	profiles: { last, first, middle, prefermiddle }
	// } = entry;

	// if (!(await compare(data.password + PASSWORD_PEPPER, password))) {
	// 	const attempts = (pastattempts ?? 0) + 1;
	// 	await db.update(users).set({ attempts }).where(eq(users.id, id));
	// 	error(attempts >= 3 ? Status.LOCKED : Status.UNAUTHORIZED, {
	// 		message: attempts >= 3 ? 'Login Attempts Exceeded' : 'Invalid Email Address/Password'
	// 	});
	// }

	// await db.update(users).set({ attempts: 0 }).where(eq(users.id, id));

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
			console.error(saveuser.errors);
			error(Status.CONFLICT, 'Existing Account Associated w/ Email Address');
		}

		const saveprofile = Profiles.create({
			last,
			first,
			middle: middle ?? undefined,
			prefermiddle,
			email,
			phone
		})
		if (!saveprofile.success) {
			console.error(saveprofile.errors);
			error(Status.CONFLICT, 'Existing Account Associated w/ Email Address/Phone Number');
		}

		// const existingEmail = db.select().from(profiles).where(eq(profiles.email, email)).get();
		// if (existingEmail) {
		// 	error(Status.CONFLICT, 'Existing Account Associated w/ Email Address');
		// }

		// const existingPhone = db.select().from(profiles).where(eq(profiles.phone, phone)).get();
		// if (existingPhone) {
		// 	error(Status.CONFLICT, 'Existing Account Associated w/ Phone Number');
		// }

		// const userID = await db
		// 	.insert(users)
		// 	.values({ email, password: await hash(password + PASSWORD_PEPPER, 10) })
		// 	.returning({ userID: users.id });
		// await db
		// 	.insert(profiles)
		// 	.values({ id: userID[0].userID, last, first, middle, prefermiddle, email, phone });

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
		cookies.delete(SESSION_COOKIE_KEY, { path: '/' });
		return;
	}

	return validate.data.userID
})

export const userName = query(async () => {
	const { cookies } = getRequestEvent();
	const encrypted = cookies.get(SESSION_COOKIE_KEY);
	if (!encrypted) return;

	const decrypted = decrypt(encrypted, COOKIE_ENCRYPTION_KEY);
	const validate = await SessionCookieSchema.safeParseAsync(JSON.parse(decrypted));
	if (!validate.success) {
		cookies.delete(SESSION_COOKIE_KEY, { path: '/' });
		return;
	}
	console.log({ cookieData: validate.data });

	const profile = Profiles.findOne(validate.data.userID)
	if (!profile) return;

	return profile.shortname
})
