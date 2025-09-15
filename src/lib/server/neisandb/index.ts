import { Database } from '@neisanworks/neisandb';
import { UserModel, UserSchema } from './models/user';
import { ProfileModel, ProfileSchema } from './models/profile';
import { EventModel, EventSchema } from './models/event';

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
