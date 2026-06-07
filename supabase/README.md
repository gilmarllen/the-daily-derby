# Supabase

Schema and seed data for The Daily Derby live here as version-controlled SQL.
The Next.js app reads/writes through the clients in `src/lib/supabase/`.

## One-time setup (links this repo to your hosted project)

```bash
npx supabase login                       # opens browser, stores access token
npx supabase link --project-ref <ref>    # <ref> is in your dashboard URL
```

Then copy `.env.example` → `.env.local` and fill in the URL + keys from
**Dashboard → Project Settings → API**.

## Everyday workflow

| Command            | What it does                                                       |
| ------------------ | ------------------------------------------------------------------ |
| `npm run db:push`  | Apply local migrations to the linked hosted project.               |
| `npm run db:diff`  | Generate a new migration from changes (prompts for a name).        |
| `npm run db:types` | Regenerate `src/lib/supabase/types.ts` from the live schema.       |
| `npm run db:reset` | Drop & recreate the **local** dev DB, replaying migrations + seed. |

## Conventions

- One change = one migration file in `migrations/`. Never edit a migration that
  has already been pushed; add a new one.
- Schema changes made in the Supabase dashboard are **not** tracked here. If you
  make one there, run `npm run db:diff` to capture it as a migration.
- `seed.sql` is idempotent and runs on `db:reset`. To seed the hosted project
  once, run it manually against the connection string.
