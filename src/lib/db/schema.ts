/**
 * Drizzle schema: PocketBase-derived (users, products, orders, etc.) + Better Auth (user, session, account, verification).
 */
import {
	pgTable,
	text,
	timestamp,
	boolean,
	doublePrecision,
	index,
} from 'drizzle-orm/pg-core';

// --- Better Auth tables (used by better-auth with drizzleAdapter provider: "pg") ---
export const user = pgTable('user', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	email: text('email').notNull(),
	emailVerified: boolean('emailVerified').notNull(),
	image: text('image'),
	createdAt: timestamp('createdAt', { withTimezone: true }).notNull(),
	updatedAt: timestamp('updatedAt', { withTimezone: true }).notNull(),
});

export const session = pgTable('session', {
	id: text('id').primaryKey(),
	userId: text('userId')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	token: text('token').notNull(),
	expiresAt: timestamp('expiresAt', { withTimezone: true }).notNull(),
	ipAddress: text('ipAddress'),
	userAgent: text('userAgent'),
	createdAt: timestamp('createdAt', { withTimezone: true }).notNull(),
	updatedAt: timestamp('updatedAt', { withTimezone: true }).notNull(),
});

export const account = pgTable('account', {
	id: text('id').primaryKey(),
	userId: text('userId')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	accountId: text('accountId').notNull(),
	providerId: text('providerId').notNull(),
	accessToken: text('accessToken'),
	refreshToken: text('refreshToken'),
	accessTokenExpiresAt: timestamp('accessTokenExpiresAt', { withTimezone: true }),
	refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt', { withTimezone: true }),
	scope: text('scope'),
	idToken: text('idToken'),
	password: text('password'),
	createdAt: timestamp('createdAt', { withTimezone: true }).notNull(),
	updatedAt: timestamp('updatedAt', { withTimezone: true }).notNull(),
});

export const verification = pgTable('verification', {
	id: text('id').primaryKey(),
	identifier: text('identifier').notNull(),
	value: text('value').notNull(),
	expiresAt: timestamp('expiresAt', { withTimezone: true }).notNull(),
	createdAt: timestamp('createdAt', { withTimezone: true }).notNull(),
	updatedAt: timestamp('updatedAt', { withTimezone: true }).notNull(),
});

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
