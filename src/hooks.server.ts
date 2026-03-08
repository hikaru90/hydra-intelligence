import { sequence } from '@sveltejs/kit/hooks';
import type { Handle } from '@sveltejs/kit';
import { svelteKitHandler } from 'better-auth/svelte-kit';
import { building } from '$app/environment';
import { redirect } from '@sveltejs/kit';
import { auth } from '$lib/server/auth';

const authHandle: Handle = async ({ event, resolve }) => {
	const session = await auth.api.getSession({ headers: event.request.headers });
	if (session) {
		event.locals.session = session.session;
		event.locals.user = session.user;
	}

	const publicRoutes = [
		'/login',
		'/register',
		'/logout',
		'/reset-password',
		'/api/auth',
		'/api/receiveUplink',
		'/api/comments',
		'/api/schema',
	];
	const isPublicRoute = publicRoutes.some((route) => event.url.pathname.startsWith(route));

	if (event.url.pathname === '/logout') {
		event.locals.user = undefined;
		event.locals.session = undefined;
		throw redirect(303, '/api/auth/sign-out?callbackURL=/login');
	}

	if (!event.locals.user && !isPublicRoute) {
		const from = event.url.pathname + event.url.search;
		throw redirect(303, `/login?redirectTo=${encodeURIComponent(from)}`);
	}

	return svelteKitHandler({ event, resolve, auth, building });
};

const localeHandle: Handle = async ({ event, resolve }) => {
	const { paraglideMiddleware } = await import('$src/paraglide/server');
	return paraglideMiddleware(event.request, ({ request: localizedRequest, locale }) => {
		event.request = localizedRequest;
		return resolve(event, {
			transformPageChunk: ({ html }) => {
				return html.replace('%lang%', locale);
			},
		});
	});
};

export const handle = sequence(authHandle, localeHandle);
