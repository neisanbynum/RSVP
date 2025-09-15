import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
	id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
	email: text().notNull(),
	password: text().notNull(),
	attempts: integer({ mode: 'number' }).default(0)
});
export type User = typeof users.$inferSelect;
export type InsertedUser = typeof users.$inferInsert;

export const profiles = sqliteTable('profiles', {
	id: integer({ mode: 'number' })
		.primaryKey()
		.references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
	last: text().notNull(),
	first: text().notNull(),
	middle: text(),
	prefermiddle: integer({ mode: 'boolean' }).notNull().default(false),
	email: text().notNull(),
	phone: text().notNull()
});
export type Profile = typeof profiles.$inferSelect;

export const events = sqliteTable('events', {
	id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
	title: text('title').notNull(),
	creator: text('creator')
		.notNull()
		.references(() => profiles.id)
});
export type Event = typeof events.$inferSelect;

export const EventProfileJoins = {
	user: integer({ mode: 'number' })
		.notNull()
		.references(() => profiles.id),
	event: integer({ mode: 'number' })
		.notNull()
		.references(() => events.id)
};

export const eventModerators = sqliteTable('eventModerators', EventProfileJoins);
export type EventModerator = typeof eventModerators.$inferSelect;

export const eventAttendantDecisions = sqliteTable('eventAttendantDecisions', EventProfileJoins);
export type EventAttendantDecision = typeof eventAttendantDecisions.$inferSelect;

export const eventAttendantResponsibilities = sqliteTable('eventAttendantResponsibilities', {
	...EventProfileJoins,
	desc: text().notNull()
});
export type EventAttendantResponsibility = typeof eventAttendantResponsibilities.$inferSelect;
