/**
 * useSend email client for server-side use.
 * See https://docs.usesend.com/get-started/nodejs
 *
 * Env: USESEND_API_KEY (required), USESEND_FROM_ADDRESS (default from), USESEND_APP_URL (optional, for self-hosted)
 */
import { UseSend } from 'usesend-js';
import { env } from '$env/dynamic/private';

const apiKey = env.USESEND_API_KEY;
const baseUrl = env.USESEND_APP_URL;
const defaultFrom = env.USESEND_FROM_ADDRESS;

if (!apiKey) {
	throw new Error('USESEND_API_KEY is not set');
}

export const usesend = new UseSend(apiKey, baseUrl || undefined);

export type SendEmailOptions = {
	to: string;
	from?: string;
	subject: string;
	html: string;
	text?: string;
	headers?: Record<string, string>;
};

/**
 * Send a single email via useSend.
 * Uses USESEND_FROM_ADDRESS when "from" is not provided (must be a verified domain).
 *
 * Note: usesend-js returns `{ data, error }` on HTTP errors instead of rejecting; we throw so callers can handle failures.
 */
export async function sendEmail(options: SendEmailOptions) {
	const from = options.from ?? defaultFrom;
	if (!from) {
		throw new Error('USESEND_FROM_ADDRESS is not set and no "from" was provided');
	}
	const result = (await usesend.emails.send({ ...options, from })) as {
		data: unknown;
		error: unknown;
	};

	if (result.error) {
		console.error('useSend emails.send error:', result.error);
		const err = result.error as { message?: string; error?: { message?: string; code?: string } };
		const msg =
			err.message ??
			err.error?.message ??
			err.error?.code ??
			JSON.stringify(result.error);
		throw new Error(`useSend: ${msg}`);
	}

	return result.data;
}
