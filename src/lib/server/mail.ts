/**
 * App-wide mail utility: sendMail(to, template, vars) using useSend.
 * Use this for all outgoing emails. Import from $lib/server/mail in server code only.
 */
import { sendEmail } from '$lib/server/usesend';

function interpolate(str: string, vars: Record<string, string>): string {
	return str.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] ?? '');
}

export type MailTemplate = {
	subject: string;
	html: string;
	text?: string;
};

const TEMPLATES: Record<string, MailTemplate> = {
	welcome: {
		subject: 'Welcome to {{appName}}',
		html: '<p>Hi {{name}},</p><p>Welcome to {{appName}}.</p>',
		text: 'Hi {{name}}, Welcome to {{appName}}.',
	},
	verifyEmail: {
		subject: 'Verify your email',
		html: '<p>Hi {{name}},</p><p>Click the link below to verify your email:</p><p><a href="{{link}}">{{link}}</a></p>',
		text: 'Hi {{name}}, verify your email: {{link}}',
	},
	resetPassword: {
		subject: 'Reset your password',
		html: '<p>Hi {{name}},</p><p>Reset your password by clicking:</p><p><a href="{{link}}">{{link}}</a></p><p>This link expires in {{expiresIn}}.</p>',
		text: 'Hi {{name}}, reset your password: {{link}} (expires {{expiresIn}})',
	},
	generic: {
		subject: '{{subject}}',
		html: '<p>{{body}}</p>',
		text: '{{body}}',
	},
};

/**
 * Register or override a template by name. Use for app-specific templates.
 */
export function registerTemplate(name: string, template: MailTemplate): void {
	TEMPLATES[name] = template;
}

export type SendMailOptions = {
	to: string;
	from?: string;
	headers?: Record<string, string>;
} & (
	| { template: string; vars?: Record<string, string> }
	| { subject: string; html: string; text?: string }
);

/**
 * Send an email using a named template with variables, or with raw subject/html/text.
 *
 * @example Template
 *   await sendMail({ to: 'u@example.com', template: 'welcome', vars: { name: 'User', appName: 'Hydra' } });
 *
 * @example Raw
 *   await sendMail({ to: 'u@example.com', subject: 'Hi', html: '<p>Hello</p>', text: 'Hello' });
 */
export async function sendMail(options: SendMailOptions) {
	let subject: string;
	let html: string;
	let text: string | undefined;

	if ('template' in options) {
		const t = TEMPLATES[options.template];
		if (!t) {
			throw new Error(`Unknown mail template: ${options.template}`);
		}
		const vars = options.vars ?? {};
		subject = interpolate(t.subject, vars);
		html = interpolate(t.html, vars);
		text = t.text ? interpolate(t.text, vars) : undefined;
	} else {
		subject = options.subject;
		html = options.html;
		text = options.text;
	}

	return sendEmail({
		to: options.to,
		from: options.from,
		subject,
		html,
		text,
		headers: options.headers,
	});
}
