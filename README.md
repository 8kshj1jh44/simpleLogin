# One Login

**Out-simple them.**

One Login is a one-screen money tracker for Australian tradies. Finish a job, tap one big yellow button, type who, what and how much, and you're done. Your profit for the month is the biggest thing on the screen: green when you're in the black, red when you're not. There are no menus, no settings and nothing to learn. It's built to be used on site, one-handed, in full sun, in under 30 seconds.

## The 30-second flow

1. Open the app from your home screen. You're already signed in.
2. Tap **✓ Job done**.
3. Type the customer ("Smith") → Next → the job ("Hot water system") → Next → the price ("1850").
4. Tap **Add $1,850**. The sheet closes, your phone buzzes, the profit counts up, and you see *"Nice one. +$1,850 in."* Made a typo? Tap **Undo**.

Spent money at Bunnings? Tap **+ Expense**: what, how much, done.

## Stack

- **Next.js 16** (App Router, TypeScript, Server Actions). Session refresh lives in `proxy.ts`, which is what Next 16 calls middleware.
- **Supabase**: Auth, Postgres with row-level security, Realtime
- **Tailwind CSS v4**, **Motion**, **Phosphor icons**, **zod**, Geist (self-hosted, so the build needs no network)
- Light and dark themes follow the phone setting. Light is the default because it reads best in direct sun.

## How it works

| Concern | Where |
| --- | --- |
| Schema, RLS, realtime | `supabase/migrations/0001_init.sql` |
| Session refresh + route guard | `proxy.ts` → `lib/supabase/proxy.ts` |
| First paint with real totals | `app/page.tsx` (Server Component, Sydney-month query) |
| Optimistic add / undo / realtime | `hooks/use-entries.ts` |
| Insert + delete (validated with zod) | `app/actions.ts` |
| Money (integer cents, en-AU AUD) | `lib/money.ts` |
| Month boundaries in Australia/Sydney | `lib/time.ts` |

- Money is stored and summed as **integer cents**. Floats never touch a total.
- "This month" means the current calendar month in **Australia/Sydney**, including daylight-saving changes.
- Entry ids are generated on the client, so the optimistic row, the server row and the realtime event all share one id. Nothing ever shows up twice.
- A failed insert rolls back and shows a toast with **Retry**.

## Setup

**Requirements:** Node 22+ and a Supabase project (the free tier is fine).

1. **Install**
   ```bash
   npm install
   ```
2. **Create a Supabase project** at [supabase.com](https://supabase.com/dashboard).
3. **Run the migration.** Open *SQL Editor* in the Supabase dashboard, paste in `supabase/migrations/0001_init.sql` and run it. If you use the CLI instead: `npx supabase link` then `npx supabase db push`.
4. **Set env vars.** Copy `.env.example` to `.env.local`, because Next.js never reads `.env.example` itself. Fill it in from *Project Settings → API Keys*:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://<ref>.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
   SUPABASE_SECRET_KEY=sb_secret_...   # used by the seed script only, never shipped to the browser
   ```
   Projects with legacy keys can use `NEXT_PUBLIC_SUPABASE_ANON_KEY` and `SUPABASE_SERVICE_ROLE_KEY` instead.
5. **Seed the demo account.** This creates `demo@onelogin.app` and 8 entries for the current month, so the demo starts in the black:
   ```bash
   npm run seed:demo
   ```
   Running `supabase db reset` against a local Supabase stack does the same thing through `supabase/seed.sql`.
6. **Run it**
   ```bash
   npm run dev
   ```
   Open http://localhost:3000 and tap **Try the demo**.

To add real users, create them in the Supabase dashboard under *Authentication → Users*.

## Deploy to Vercel

1. Push this repo to GitHub.
2. In Vercel, click **Add New → Project** and import the repo. The framework is detected automatically.
3. Under **Environment Variables**, add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. The secret key isn't needed at runtime, so leave it out.
4. Click **Deploy**.
5. In Supabase, go to *Authentication → URL Configuration* and set **Site URL** to your Vercel URL.

On a phone, open the deployed URL and choose **Add to Home Screen**. It launches full-screen like a native app.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Local dev server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run seed:demo` | Create/reset the demo user and its entries |
