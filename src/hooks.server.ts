import PocketBase from 'pocketbase';
import { sequence } from "@sveltejs/kit/hooks";
import type { Handle } from "@sveltejs/kit";
import { paraglideMiddleware } from "$src/paraglide/server";
import { redirect } from '@sveltejs/kit';

const authHandle: Handle = async ({ event, resolve }) => {
	// Initialize PocketBase for this request
	event.locals.pb = new PocketBase('https://pbhydra.clustercluster.de');
	
	// Load auth from cookie
	event.locals.pb.authStore.loadFromCookie(event.request.headers.get('cookie') || '');

	// Define public routes that don't require authentication
	const publicRoutes = ['/login', '/register', '/logout', '/reset-password', '/api/receiveUplink', '/api/comments'];
	const isPublicRoute = publicRoutes.some(route => event.url.pathname.startsWith(route));

	// Handle logout requests
	if (event.url.pathname === '/logout') {
		event.locals.pb.authStore.clear();
		event.locals.user = undefined;
		throw redirect(303, '/login');
	}

	// Check if user is authenticated
	if (event.locals.pb.authStore.isValid) {
		// Verify the token is still valid and refresh if needed
		try {
			// This will throw if the token is invalid
			if (event.locals.pb.authStore.model) {
				event.locals.user = structuredClone(event.locals.pb.authStore.model) as unknown as App.User;
				
				// Optional: Refresh auth periodically (uncomment if needed)
				// await event.locals.pb.collection('users').authRefresh();
			}
		} catch (error) {
			// Token is invalid, clear auth
			console.log('Auth token invalid, clearing auth store');
			event.locals.pb.authStore.clear();
			event.locals.user = undefined;
			
			if (!isPublicRoute) {
				const from = event.url.pathname + event.url.search;
				throw redirect(303, `/login?redirectTo=${encodeURIComponent(from)}`);
			}
		}
	} else {
		event.locals.user = undefined;
		
		// Redirect to login if accessing protected route
		if (!isPublicRoute) {
			const from = event.url.pathname + event.url.search;
			throw redirect(303, `/login?redirectTo=${encodeURIComponent(from)}`);
		}
	}

	const response = await resolve(event);

	// Set the auth cookie
	response.headers.set(
		"set-cookie",
		event.locals.pb.authStore.exportToCookie({
			secure: event.url.protocol === 'https:',
			sameSite: 'lax',
			httpOnly: false // Allow client-side access for the store
		})
	);

	return response;
};

const localeHandle: Handle = async ({ event, resolve }) => {
	return paraglideMiddleware(event.request, ({ request: localizedRequest, locale }) => {
		event.request = localizedRequest;
		return resolve(event, {
			transformPageChunk: ({ html }) => {
				return html.replace("%lang%", locale);
			},
		});
	});
};

export const handle = sequence(authHandle, localeHandle);
