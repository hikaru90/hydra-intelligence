// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			pb: import('pocketbase').default;
			user: User | undefined;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
		interface User {
			id: string;
			email: string;
			firstName?: string;
			lastName?: string;
			verified: boolean;
			created: string;
			updated: string;
		}
	}
}

export {};
