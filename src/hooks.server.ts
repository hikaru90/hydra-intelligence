import PocketBase from 'pocketbase';
import { sequence } from "@sveltejs/kit/hooks";
import type { Handle } from "@sveltejs/kit";
import { paraglideMiddleware } from "$src/paraglide/server";

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
	event.locals.pb.authStore.loadFromCookie(event.request.headers.get('cookie') || '');


	if (event.locals.pb.authStore.isValid) {
		event.locals.user = structuredClone(event.locals.pb.authStore.model);
	}

  const response = await resolve(event);

  response.headers.set(
    "set-cookie",
    event.locals.pb.authStore.exportToCookie()
  );

  return response;
};

export const handle = sequence(first, second);
