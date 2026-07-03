# J+ Jaidad Group — Premium Real Estate Platform

A full-stack, enterprise-grade real estate management platform built with React 19, TypeScript, Vite, Tailwind CSS v4, and Supabase.

## Quick Start

```bash
npm install
cp .env.example .env   # add your Supabase keys
npm run dev
```

## Setup

1. Create Supabase project at supabase.com
2. Run `supabase/migrations/001_schema.sql` in SQL Editor
3. Run `supabase/migrations/002_seed.sql` for demo data
4. Create admin user in Supabase → Authentication → Users
5. Add env vars: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

## Routes

- `/` — Home (hero, properties, stats, testimonials)
- `/properties` — Property listings with filters
- `/properties/:slug` — Property detail
- `/about`, `/contact`, `/blog`, `/gallery` — Public pages
- `/admin` — Admin dashboard (login required)

## Deploy

Connect repo to Vercel, set env vars, deploy.
