// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			session?: import('better-auth').Session;
			user?: User;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
		interface User {
			id: string;
			name: string;
			email: string;
			emailVerified: boolean;
			image?: string | null;
			createdAt: Date;
			updatedAt: Date;
			role?: string;
		}
	}
}

export {};
