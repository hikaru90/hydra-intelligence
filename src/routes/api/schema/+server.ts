import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import PocketBase from 'pocketbase';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { env } from '$env/dynamic/private';

export const GET: RequestHandler = async ({ locals }) => {
	const user = locals.user;
	if (!user || user.role !== 'admin') {
		return json({ error: 'Forbidden: admin role required' }, { status: 403 });
	}

	const email = env.PB_ADMIN_EMAIL;
	const password = env.PB_ADMIN_PASSWORD;
	if (!email || !password) {
		return json(
			{ error: 'Schema export not configured: PB_ADMIN_EMAIL and PB_ADMIN_PASSWORD required' },
			{ status: 503 }
		);
	}

	const pbUrl = env.PUBLIC_PB_URL;
	if (!pbUrl) {
		return json(
			{ error: 'Schema export not configured: PUBLIC_PB_URL required' },
			{ status: 503 }
		);
	}

	try {
		const pb = new PocketBase(pbUrl);
		await pb.collection('_superusers').authWithPassword(email, password);
		const collections = await pb.collections.getFullList({ sort: '-created' });

		const payload = { generatedAt: new Date().toISOString(), collections };

		const docsDir = path.join(process.cwd(), 'docs');
		await mkdir(docsDir, { recursive: true });
		const filePath = path.join(docsDir, 'schema.json');
		await writeFile(filePath, JSON.stringify(payload, null, 2), 'utf-8');

		return json({ ok: true, path: 'docs/schema.json' }, { status: 200 });
	} catch (err) {
		const message = err instanceof Error ? err.message : 'Unknown error';
		console.error('Schema export failed:', err);
		return json({ error: 'Schema export failed', details: message }, { status: 500 });
	}
};
