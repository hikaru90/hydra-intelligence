import type { PageServerLoad, Actions } from './$types.js';
import { redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { formSchema } from './schema';

export const load: PageServerLoad = async ({ locals, url }) => {
	if (locals.user) {
		const redirectTo = url.searchParams.get('redirectTo');
		throw redirect(302, redirectTo || '/');
	}
	return {
		form: await superValidate(zod(formSchema)),
		redirectTo: url.searchParams.get('redirectTo'),
	};
};

export const actions: Actions = {
	login: async () => ({ form: await superValidate(zod(formSchema)) }),
};
