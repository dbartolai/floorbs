# Floorbs

Mobile-first MVP for a floorball tournament live board. Public users can view live scores, schedule, standings, results, leaders, and the tournament feed. Trusted scorers use a 6-digit code to update scores and post feed updates.

## Stack

- Next.js App Router + TypeScript
- Tailwind CSS
- Supabase Postgres, migrations, seed data, and RLS
- Vercel-compatible API routes for protected writes

## Local Dev

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

The app renders seeded demo data automatically when Supabase env vars are not configured. The fallback scorer code is `123456`.

## Supabase Setup

Apply the schema and seed data from:

- `supabase/migrations/20260531000000_initial_floorbs_schema.sql`
- `supabase/seed.sql`

Then copy `.env.example` to `.env.local` and set:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SECRET_KEY=
SCORER_SESSION_SECRET=
```

Legacy `NEXT_PUBLIC_SUPABASE_ANON_KEY` and `SUPABASE_SERVICE_ROLE_KEY` are also supported.

## Demo Scorer Flow

1. Go to `/admin`.
2. Enter `123456`.
3. Select a game.
4. Tap score +/- buttons, mark live/final, or create a feed post.

Public reads use RLS policies. Writes only run through protected Next.js API routes after scorer cookie verification.
