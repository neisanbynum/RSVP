import { Database } from '@neisanworks/neisandb';
import { UserModel, UserSchema } from './models/user';
import { ProfileModel, ProfileSchema } from './models/profile';
import { EventModel, EventSchema } from './models/event';
import { SessionCookieModel } from './models/session';
import { SessionCookieSchema } from '$lib/schemas/session';

const db = new Database({ folder: 'src/lib/server/neisandb/data', autoload: true });

export const Users = db.collection({
	name: 'users',
	schema: UserSchema,
	model: UserModel,
	uniques: ['email']
});

export const Profiles = db.collection({
    name: 'profiles',
    schema: ProfileSchema,
    model: ProfileModel,
    uniques: ['email', 'phone']
})

export const Events = db.collection({
    name: 'events',
    schema: EventSchema,
    model: EventModel
})

export const SessionCookies = db.collection({
    name: "session_cookies",
    schema: SessionCookieSchema,
    model: SessionCookieModel,
    uniques: ['client', 'userID']
})
