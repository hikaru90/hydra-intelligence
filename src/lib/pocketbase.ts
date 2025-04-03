import PocketBase from 'pocketbase';
import { writable } from 'svelte/store';

export const pb = new PocketBase('https://pbhydra.clustercluster.de');

export const currentUser = writable(pb.authStore.model);
export const isAuthenticated = writable(pb.authStore.isValid);

// Subscribe to auth store changes
pb.authStore.onChange(() => {
    currentUser.set(pb.authStore.model);
    isAuthenticated.set(pb.authStore.isValid);
}); 