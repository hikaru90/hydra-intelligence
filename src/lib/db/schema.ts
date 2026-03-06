/**
 * Drizzle schema derived from PocketBase (docs/schema.json).
 * Tables: comments, measurements, orders, products, users.
 */
import {
	pgTable,
	text,
	timestamp,
	boolean,
	doublePrecision,
	index,
} from 'drizzle-orm/pg-core';

// --- users (PocketBase _pb_users_auth_) ---
export const users = pgTable(
	'users',
	{
		id: text('id').primaryKey(),
		password: text('password').notNull(),
		tokenKey: text('token_key').notNull(),
		email: text('email').notNull(),
		emailVisibility: boolean('email_visibility'),
		verified: boolean('verified'),
		firstName: text('first_name'),
		lastName: text('last_name'),
		avatar: text('avatar'),
		street: text('street'),
		number: text('number'),
		postcode: text('postcode'),
		city: text('city'),
		role: text('role'),
		created: timestamp('created', { withTimezone: true }),
		updated: timestamp('updated', { withTimezone: true }),
	},
	(table) => [
		index('idx_users_token_key').on(table.tokenKey),
		index('idx_users_email').on(table.email),
	]
);

// --- products ---
export const products = pgTable('products', {
	id: text('id').primaryKey(),
	slug: text('slug'),
	name: text('name'),
	price: doublePrecision('price'),
	created: timestamp('created', { withTimezone: true }),
	updated: timestamp('updated', { withTimezone: true }),
});

// --- orders (customer -> users, product -> products) ---
export const orders = pgTable(
	'orders',
	{
		id: text('id').primaryKey(),
		customer: text('customer').references(() => users.id),
		product: text('product').references(() => products.id),
		deployed: boolean('deployed'),
		lon: doublePrecision('lon'),
		lat: doublePrecision('lat'),
		label: text('label'),
		devEui: text('dev_eui'),
		created: timestamp('created', { withTimezone: true }),
		updated: timestamp('updated', { withTimezone: true }),
	},
	(table) => [index('idx_orders_dev_eui').on(table.devEui)]
);

// --- measurements (device -> orders) ---
export const measurements = pgTable(
	'measurements',
	{
		id: text('id').primaryKey(),
		device: text('device').references(() => orders.id),
		ldr1: doublePrecision('ldr1'),
		ldr2: doublePrecision('ldr2'),
		temp: doublePrecision('temp'),
		batt: doublePrecision('batt'),
		timestamp: timestamp('timestamp', { withTimezone: true }),
		created: timestamp('created', { withTimezone: true }),
		updated: timestamp('updated', { withTimezone: true }),
	},
	(table) => [
		index('idx_measurements_device_timestamp').on(table.device, table.timestamp),
	]
);

// --- comments ---
export const comments = pgTable('comments', {
	id: text('id').primaryKey(),
	username: text('username'),
	message: text('message'),
	page: text('page'),
	created: timestamp('created', { withTimezone: true }),
	updated: timestamp('updated', { withTimezone: true }),
});
