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
			collectionId?: string;
			collectionName?: string;
			email: string;
			emailVisibility?: boolean;
			verified: boolean;
			firstName?: string;
			lastName?: string;
			avatar?: string;
			street?: string;
			number?: string;
			postcode?: string;
			city?: string;
			role?: string;
			created: string;
			updated: string;
		}
	}
}

export {};
