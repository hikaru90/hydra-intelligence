import { z } from 'zod';
import { m } from '$src/paraglide/messages';


export const formSchema = z.object({
	email: z.string().email({ message: m.validEmailError() }),
	password: z
		.string()
		.min(6, { message: m.tooShortError() })
		.max(30, { message: m.tooLongError() })
});
export type FormSchema = typeof formSchema;
