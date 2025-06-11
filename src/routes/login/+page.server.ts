import type { PageServerLoad, Actions } from './$types.js';
import { fail, redirect } from '@sveltejs/kit';
import { setError, superValidate, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { formSchema } from './schema';

const redirectAfterLogin = (event: { url: URL }) => {
	// Check if there's a redirect URL in the query params
	const redirectTo = event.url.searchParams.get('redirectTo');
	
	if (redirectTo) {
		throw redirect(302, redirectTo);
	} else {
		throw redirect(302, '/');
	}
};

export const load: PageServerLoad = async ({ locals, url }) => {
	// If user is already logged in, redirect them
	if (locals.user) {
		const redirectTo = url.searchParams.get('redirectTo');
		throw redirect(302, redirectTo || '/');
	}
	
	return {
		form: await superValidate(zod(formSchema))
	};
};

export const actions: Actions = {
	default: async (event) => {
		try {
			const form = await superValidate(event, zod(formSchema));
			if (!form.valid) {
				return fail(400, { form });
			}

			try {
				// Authenticate with PocketBase
				await event.locals.pb
					.collection('users')
					.authWithPassword(form.data.email, form.data.password);
				
				// Check if user is verified
				if (!event.locals.pb?.authStore?.model?.verified) {
					event.locals.pb.authStore.clear();
					return setError(form, 'email', 'Please verify your email before logging in');
				}
				
				// Update locals.user (this will be handled by hooks.server.ts on next request)
				event.locals.user = structuredClone(event.locals.pb.authStore.model) as unknown as App.User;
				
			} catch (err) {
				console.log('Authentication error:', err);
				return setError(form, 'password', 'Invalid email or password');
			}

			// Redirect after successful login
			redirectAfterLogin(event);

		} catch (err) {
			console.log('Login action error:', err);
			return fail(500, { form });
		}
	}
};
