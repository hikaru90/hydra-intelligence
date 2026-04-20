import type { PageServerLoad, Actions } from './$types.js';
import { redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { formSchema } from './schema';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) {
		throw redirect(302, '/');
	}
	return {
		form: await superValidate(zod(formSchema)),
	};
};

export const actions: Actions = {
	register: async () => ({ form: await superValidate(zod(formSchema)) }),
};
