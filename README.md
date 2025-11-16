# hackNYU — Policy explorer demo

Short demo app built with Next.js and Supabase for exploring bills, companies, industries and related policies. The app provides search and listing pages, simple authentication (Supabase), and example JSON data in `public/` so you can run and test the app locally without a database.

## Quick links

- Source: https://hack-nyu-rosy.vercel.app/
- Local demo data: `public/bills.json`, `public/companies.json`, `public/industries.json`

## Team

- Daniel Furmanov danielfurmanov@hotmail.com
- Maksim Pikovskiy pikmak2001@gmail.com
- Phone Khant Kyaw Swa phonekhantkyawswa555@gmail.com
- Taylor (Xiaoyan) Li DAXIAN1221@GMAIL.COM

## Application description

PolicySignal automates policy-driven investment research. Our platform scrapes Congressional bills, uses AI to analyze keywords and legislative patterns, identifies affected industries with impact scores, and recommends prime investment candidates.

## Setup (from scratch)

Prerequisites

- Node.js 18+ and npm (or yarn/pnpm)
- Git (to clone the repo)

Optional (only required if you want a real Supabase backend)

- Supabase project (see https://supabase.com)

1. Clone the repository

```bash
git clone https://github.com/MaksimPikovskiy/hackNYU.git
cd hackNYU
```

2. Install dependencies

```bash
npm install
# or: yarn install
# or: pnpm install
```

3. Environment variables

Create a `.env.local` file in the project root (same folder as `package.json`). The app can run with the included demo JSON files, but if you want auth and a live Supabase backend, set the following:

```env
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-publishable-or-anon-key>
# Optional: NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY for server-side calls (keep secret)
```

Notes:

- With no Supabase env vars present the app uses local demo data under `public/` for companies, industries, and bills.
- Do not commit secrets. Add `.env.local` to `.gitignore` (Next.js templates do this by default).

## Run (development)

Start the dev server:

```bash
npm run dev
# or: yarn dev
# or: pnpm dev
```

Open https://hack-nyu-rosy.vercel.app/main in a browser.

## Build and Run (production)

Build and start:

```bash
npm run build
npm run start
# or use yarn/pnpm equivalents
```

## Usage

- The main entry is `app/main/page.tsx` (authenticated and protected areas under `app/main` and `app/protected`).
- Public/demo data is in `public/*.json`.
- API route handlers are under `app/api/` (e.g. `app/api/bills/route.ts`). These routes provide JSON endpoints used by the UI.
- Auth pages are in `app/auth/*` and Supabase client code is in `lib/supabase/`.

Common tasks

- Rebuild shadcn components: edit `components.json` then follow shadcn/ui docs if you change UI primitives.
- Run lint/typecheck:

```bash
npm run lint
npm run typecheck
```

## Project layout (key files)

- `app/` — Next.js App Router pages and API routes
- `components/` — React components and UI
- `lib/supabase/` — Supabase client, server helpers, middleware
- `public/` — Demo JSON data used when Supabase is not configured
- `package.json` — scripts and dependencies

## Troubleshooting

- If the server doesn't start, ensure Node.js version is 18+ and dependencies installed.
- If API routes error and you use Supabase, check `.env.local` values and Supabase project API keys.

## License

This project use MIT license. See `LICENSE`.
