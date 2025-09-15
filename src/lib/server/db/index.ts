import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema';
import { DATABASE_URL } from '$env/static/private';

if (!DATABASE_URL) throw new Error('DATABASE_URL is not set');

const client = new Database(DATABASE_URL);

// const database = drizzle(client, { schema });

export const db = drizzle({ connection: { source: DATABASE_URL, timeout: 250 }, schema });
