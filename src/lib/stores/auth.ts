// store.js
import { writable } from "svelte/store";
import { browser } from '$app/environment';
import { pb } from "$lib/pocketbase";

// Initialize the store with a default value
export const user = writable<App.User | undefined>(undefined);

// Subscribe to auth changes from PocketBase
if (browser) {
  pb.authStore.onChange(() => {
    if (pb.authStore.isValid && pb.authStore.model) {
      user.set(pb.authStore.model as unknown as App.User);
    } else {
      user.set(undefined);
    }
  });
}

user.subscribe((value) => {
  console.log('user changed', value);
});