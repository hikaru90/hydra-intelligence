/**
 * Postgres connection via Drizzle. Use only in server code (e.g. +server.ts, +page.server.ts).
 * Reads PG_CONNECTION_STRING from env.
 */
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { env } from '$env/dynamic/private';
import * as schema from '$lib/db/schema';

const connectionString = env.PG_CONNECTION_STRING;
if (!connectionString) {
	throw new Error('PG_CONNECTION_STRING is not set');
}

const pool = new Pool({ connectionString });
export const db = drizzle(pool, { schema });
