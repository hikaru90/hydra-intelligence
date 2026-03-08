import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export const user = writable<App.User | undefined>(undefined);

if (browser) {
	// Session is populated from layout server data (data.user). After client-side sign-in,
	// navigate so the layout reloads and data.user is updated.
}
