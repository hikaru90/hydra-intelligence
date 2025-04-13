import { z } from 'zod';
import { get } from 'svelte/store';
import { m } from '$src/paraglide/messages';


export const formSchema = z.object({
	firstName: z
		.string()
		.min(3, { message: m.tooShortError() })
		.max(30, { message: m.tooLongError() }),
	lastName: z
		.string()
		.min(3, { message: m.tooShortError() })
		.max(30, { message: m.tooLongError() }),
	email: z.string().email({ message: m.validEmailError() }),
	password: z
		.string()
		.min(6, { message: m.tooShortError() })
		.max(30, { message: m.tooLongError() })
});
export type FormSchema = typeof formSchema;
