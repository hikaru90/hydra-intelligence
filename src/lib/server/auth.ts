/**
 * Better Auth instance using Postgres via Drizzle.
 * Uses PG_CONNECTION_STRING and BETTER_AUTH_* env.
 */
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { getRequestEvent } from '$app/server';
import { env } from '$env/dynamic/private';
import { db } from '$lib/server/db';
import * as schema from '$lib/db/schema';
import { sendMail } from '$lib/server/mail';

export const auth = betterAuth({
	baseURL: env.BETTER_AUTH_URL,
	database: drizzleAdapter(db, {
		provider: 'pg',
		schema: {
			user: schema.user,
			session: schema.session,
			account: schema.account,
			verification: schema.verification,
		},
	}),
	emailAndPassword: {
		enabled: true,
		requireEmailVerification: true,
	},
	emailVerification: {
		sendOnSignUp: true,
		sendOnSignIn: true,
		sendVerificationEmail: async ({ user, url }) => {
			void sendMail({
				to: user.email,
				template: 'verifyEmail',
				vars: { name: user.name ?? user.email, link: url },
			});
		},
	},
	plugins: [sveltekitCookies(getRequestEvent)],
});
