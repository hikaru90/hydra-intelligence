import PocketBase from 'pocketbase';
import { writable } from 'svelte/store';
import { env } from '$env/dynamic/public';

export const pb = new PocketBase(env.PUBLIC_PB_URL ?? '');

// export const currentUser = writable(pb.authStore.model);
// export const isAuthenticated = writable(pb.authStore.isValid);

// // Subscribe to auth store changes
// pb.authStore.onChange(() => {
//     currentUser.set(pb.authStore.model);
//     isAuthenticated.set(pb.authStore.isValid);
// }); 