import { json } from '@sveltejs/kit';
import { ORDER_EMAIL_ADDRESS } from '$env/static/private';
import type { RequestHandler } from './$types';
import { sendMail } from '$lib/server/mail';

const corsHeaders = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Methods': 'POST, OPTIONS',
	'Access-Control-Allow-Headers': 'Content-Type',
};

function escapeHtml(value: unknown): string {
	if (value === null || value === undefined) return '';
	return String(value)
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
}

export const OPTIONS: RequestHandler = async () => {
	return new Response(null, { status: 204, headers: corsHeaders });
};

export const POST: RequestHandler = async ({ request }) => {
	const contentType = request.headers.get('content-type') ?? '';
	if (!contentType.includes('application/json')) {
		return json(
			{ success: false, error: 'Expected Content-Type: application/json' },
			{ status: 415, headers: corsHeaders },
		);
	}

	let body: Record<string, unknown>;
	try {
		body = await request.json();
	} catch {
		return json({ success: false, error: 'Invalid JSON' }, { status: 400, headers: corsHeaders });
	}

	const firstName = typeof body.firstName === 'string' ? body.firstName.trim() : '';
	const lastName = typeof body.lastName === 'string' ? body.lastName.trim() : '';
	const email = typeof body.email === 'string' ? body.email.trim() : '';
	const organisation =
		typeof body.organisation === 'string' ? body.organisation.trim() : '';
	const message = typeof body.message === 'string' ? body.message.trim() : '';
	const product = typeof body.product === 'string' ? body.product.trim() : '';
	const configuration =
		typeof body.configuration === 'string' ? body.configuration.trim() : '';
	const total = typeof body.total === 'string' ? body.total.trim() : '';

	if (!email || !firstName || !lastName) {
		return json(
			{ success: false, error: 'Missing required fields: firstName, lastName, email' },
			{ status: 400, headers: corsHeaders },
		);
	}

	const text = [
		`Name: ${firstName} ${lastName}`,
		`Email: ${email}`,
		`Organisation: ${organisation || '—'}`,
		`Product: ${product || '—'}`,
		`Configuration: ${configuration || '—'}`,
		`Total: ${total || '—'}`,
		'',
		'Message:',
		message || '—',
	].join('\n');

	const html = `
<p><strong>Name:</strong> ${escapeHtml(firstName)} ${escapeHtml(lastName)}</p>
<p><strong>Email:</strong> ${escapeHtml(email)}</p>
<p><strong>Organisation:</strong> ${escapeHtml(organisation) || '—'}</p>
<p><strong>Product:</strong> ${escapeHtml(product) || '—'}</p>
<p><strong>Configuration:</strong> ${escapeHtml(configuration) || '—'}</p>
<p><strong>Total:</strong> ${escapeHtml(total) || '—'}</p>
<p><strong>Message:</strong></p>
<p>${escapeHtml(message).replace(/\n/g, '<br/>') || '—'}</p>
`.trim();

	const orderRecipient = ORDER_EMAIL_ADDRESS?.trim();
	if (!orderRecipient) {
		console.error('orders API: ORDER_EMAIL_ADDRESS is not set');
		return json(
			{ success: false, error: 'Order processing is not configured' },
			{ status: 503, headers: corsHeaders },
		);
	}

	try {
		await sendMail({
			to: orderRecipient,
			subject: `Shop order: ${product || 'Product'} — ${firstName} ${lastName}`,
			html,
			text,
			headers: { 'Reply-To': email },
		});
	} catch (err) {
		console.error('orders API: sendMail failed', err);
		return json({ success: false, error: 'Failed to submit order' }, { status: 500, headers: corsHeaders });
	}

	return json({ success: true }, { headers: corsHeaders });
};
