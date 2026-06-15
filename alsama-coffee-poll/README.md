# Alsama Coffee Poll

A live public poll — "How do you like your coffee?" — built with Next.js, Supabase, and styled to match the Alsama brand.

## Setup

### 1. Supabase

1. Create a new Supabase project at supabase.com
2. Open the **SQL Editor** and run the contents of `supabase-schema.sql`
3. From **Project Settings → API**, copy your **Project URL** and **anon/public key**

### 2. Environment variables

Copy `.env.local.example` to `.env.local` and fill in your values:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJh...
```

### 3. Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000

---

## Deploy to Vercel

1. Push this repo to GitHub
2. Import the project in Vercel (vercel.com/new)
3. In **Project Settings → Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy — no other configuration needed

---

## How it works

- Visitors see four coffee option cards; clicking one selects it
- Submitting saves the vote via a Next.js API route to Supabase
- The page immediately switches to a live results view with animated progress bars
- Results auto-refresh every 4 seconds so everyone watching sees updates in real time
