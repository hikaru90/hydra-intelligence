import PocketBase from 'pocketbase';
import { sequence } from "@sveltejs/kit/hooks";
import type { Handle } from "@sveltejs/kit";
import { paraglideMiddleware } from "$src/paraglide/server";
import { redirect } from '@sveltejs/kit';

const second: Handle = async ({ event, resolve }) => {
	return paraglideMiddleware(event.request, ({ request: localizedRequest, locale }) => {
		event.request = localizedRequest;
    return resolve(event, {
			transformPageChunk: ({ html }) => {
				return html.replace("%lang%", locale);
      },
    });
  });
}

const first: Handle = async ({ event, resolve }) => {
  event.locals.pb = new PocketBase('https://pbhydra.clustercluster.de');
	const userFromCookie = event.locals.pb.authStore.loadFromCookie(event.request.headers.get('cookie') || '');

  const publicRoutes = ['/login', '/register', '/logout', '/reset-password', '/api/receiveUplink'];
  const isPublicRoute = publicRoutes.some(route => event.url.pathname.startsWith(route));

	if (event.locals.pb.authStore.isValid) {
		event.locals.user = structuredClone(event.locals.pb.authStore.model);
	}else{
    event.locals.user = undefined;
    // Only redirect if it's not a public route
    if (!isPublicRoute) {
      const from = event.url.pathname + event.url.search;
      throw redirect(303, `/login?redirectTo=${encodeURIComponent(from)}`);
    }
  }

  const response = await resolve(event);

  response.headers.set(
    "set-cookie",
    event.locals.pb.authStore.exportToCookie()
  );

  return response;
};

export const handle = sequence(first, second);
