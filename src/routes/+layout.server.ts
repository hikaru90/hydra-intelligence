import type { LayoutServerLoad } from './$types';
// import { getInitialLocale } from '$scripts/helpers';
// import { getCookie } from '$scripts/helpers';

export const load = (async ({ fetch, url, locals }) => {
  return {
    url: url.pathname,
		user: locals.user,
  };

}) satisfies LayoutServerLoad;