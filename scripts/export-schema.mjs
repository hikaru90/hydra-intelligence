/**
 * Fetches the PocketBase schema and writes docs/schema.json.
 * Run with: npm run pb:fetch:schema (or node --env-file=.env scripts/export-schema.mjs)
 * Requires: PUBLIC_PB_URL, PB_ADMIN_EMAIL, PB_ADMIN_PASSWORD in .env
 */
import PocketBase from 'pocketbase';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const pbUrl = process.env.PUBLIC_PB_URL;
const email = process.env.PB_ADMIN_EMAIL;
const password = process.env.PB_ADMIN_PASSWORD;

if (!pbUrl || !email || !password) {
	console.error('Missing env: PUBLIC_PB_URL, PB_ADMIN_EMAIL, PB_ADMIN_PASSWORD');
	process.exit(1);
}

const pb = new PocketBase(pbUrl);
try {
	await pb.collection('_superusers').authWithPassword(email, password);
} catch (err) {
	if (err?.status === 400) {
		console.error('');
		console.error('PocketBase rejected the credentials. PB_ADMIN_EMAIL and PB_ADMIN_PASSWORD must be');
		console.error('the PocketBase admin account (login at ' + pbUrl + '/_/ ), not an app user.');
		console.error('');
	}
	throw err;
}
const collections = await pb.collections.getFullList({ sort: '-created' });

const payload = { generatedAt: new Date().toISOString(), collections };

const docsDir = path.join(root, 'docs');
await mkdir(docsDir, { recursive: true });
const filePath = path.join(docsDir, 'schema.json');
await writeFile(filePath, JSON.stringify(payload, null, 2), 'utf-8');

console.log('Schema written to docs/schema.json');
