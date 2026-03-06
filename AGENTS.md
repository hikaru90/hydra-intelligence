# Agent instructions

## Database / PocketBase schema

Before executing any assignment that involves database structures, collections, or PocketBase schema:

1. **Get the latest schema.** Either:
   - Call `GET /api/schema` (requires an authenticated user with `role: "admin"`) or run `npm run pb:fetch:schema` to regenerate `docs/schema.json`, then read `docs/schema.json`, or
   - Read the existing `docs/schema.json` if it is already up to date.

2. **Use that schema as the source of truth** for collection names, field names, types, and rules when writing or changing code, migrations, or docs.

Do not rely on memory or earlier context for schema details; always confirm against the current schema first.
