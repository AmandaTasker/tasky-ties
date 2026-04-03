# 🍽️ Tasky Ties — Setup Guide

Get your app live in about 45 minutes. All free. No credit card needed.

---

## What you're setting up

| Tool | What it does | Cost |
|------|-------------|------|
| **GitHub** | Stores your code | Free |
| **Supabase** | Database + Google sign-in | Free |
| **Vercel** | Hosts your website at a real URL | Free |

---

## Step 1 — Create your GitHub repo

1. Go to [github.com](https://github.com) and sign in (or create a free account)
2. Click the **+** in the top right → **New repository**
3. Name it `tasky-ties`, set it to **Public**, hit **Create repository**
4. Follow the instructions GitHub shows you to push your code up

> ⚠️ Make sure `.env` is in your `.gitignore` before pushing — it already is by default in this project.

---

## Step 2 — Set up Supabase (your database + auth)

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Click **New Project** — name it `tasky-ties`, pick any region
3. Wait about 60 seconds for it to set up

### Create your database tables

In the left sidebar, click **SQL Editor**, paste the block below, and hit **Run**:

```sql
-- Events table
create table events (
  code text primary key,
  data jsonb not null,
  owner_id uuid references auth.users(id),
  created_at timestamp with time zone default now(),
  expires_at timestamp with time zone not null
);

-- Guest list table
create table event_guests (
  event_code text references events(code) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  joined_at timestamp with time zone default now(),
  primary key (event_code, user_id)
);

-- Row Level Security: only members can see their own events
alter table events enable row level security;
alter table event_guests enable row level security;

create policy "Owners can create events" on events
  for insert to authenticated with check (auth.uid() = owner_id);

create policy "Members can read their events" on events
  for select using (
    auth.uid() = owner_id or
    exists (select 1 from event_guests where event_code = code and user_id = auth.uid())
  );

create policy "Owners can update events" on events
  for update using (auth.uid() = owner_id);

create policy "Owners can delete events" on events
  for delete using (auth.uid() = owner_id);

create policy "Authenticated users can join events" on event_guests
  for insert to authenticated with check (auth.uid() = user_id);

create policy "Members can view guest lists" on event_guests
  for select using (
    exists (
      select 1 from events e
      where e.code = event_code
      and (e.owner_id = auth.uid() or user_id = auth.uid())
    )
  );

create policy "Guests can remove themselves" on event_guests
  for delete using (auth.uid() = user_id);
```

### Set up auto-delete of expired events

Events are deleted automatically 1 week after the event's date. To enable this:

1. In Supabase, go to **Database → Extensions**
2. Search for **pg_cron** and enable it
3. Go back to **SQL Editor** and run:

```sql
select cron.schedule(
  'delete-expired-events',
  '0 3 * * *',
  $$ delete from events where expires_at < now(); $$
);
```

This runs a cleanup every night at 3am. Done!

---

## Step 3 — Enable Google Sign-In

1. In Supabase, go to **Authentication → Providers**
2. Click **Google** and toggle it **on**
3. You'll need a Google OAuth Client ID and Secret. Here's how to get them:
   - Go to [console.cloud.google.com](https://console.cloud.google.com)
   - Create a new project (or use an existing one)
   - Go to **APIs & Services → Credentials → Create Credentials → OAuth Client ID**
   - Choose **Web application**
   - Under **Authorized redirect URIs**, add your Supabase callback URL — Supabase shows this to you on the Google provider page, it looks like: `https://xxxx.supabase.co/auth/v1/callback`
   - Copy the **Client ID** and **Client Secret** back into Supabase
4. Hit **Save**

---

## Step 4 — Add your Supabase keys

Go to **Project Settings → API** and copy:
- **Project URL** (looks like `https://xxxx.supabase.co`)
- **anon public** key (long string of letters)

In your project folder, open `.env` and fill it in:

```
VITE_SUPABASE_URL=paste_your_project_url_here
VITE_SUPABASE_ANON_KEY=paste_your_anon_key_here
```

---

## Step 5 — Install dependencies & test locally

Make sure you have Node.js installed, then from inside the `tasky-ties` folder:

```bash
npm install
npm run dev
```

Open `http://localhost:5173` — sign in with Google, create a test event, and make sure it saves!

---

## Step 6 — Deploy to Vercel (your free live URL)

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **Add New Project** → import your `tasky-ties` repo
3. Before deploying, click **Environment Variables** and add:
   - `VITE_SUPABASE_URL` → your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` → your Supabase anon key
4. Hit **Deploy** 🚀

Vercel gives you a URL like `https://tasky-ties.vercel.app` — that's your real link!

### One more thing after deploying

Go back to Supabase → **Authentication → URL Configuration** and add your Vercel URL to the **Redirect URLs** list:

```
https://tasky-ties.vercel.app
```

This lets Google sign-in redirect back to your live app properly.

---

## Step 7 — (Optional) Get a custom domain

Want `taskaties.com` instead of the Vercel URL?

1. Buy it on [Namecheap](https://namecheap.com) (~$10/year)
2. In Vercel → your project → **Domains** → add your domain
3. Vercel walks you through the DNS settings — takes about 10 min
4. Add your custom domain to Supabase's Redirect URLs list too

---

## You're live! 🎉

Create an event, tap **Share Invite**, text the link to your family. They tap it, sign in with Google, and they're in — no codes, no confusion.

Events automatically disappear 1 week after the event date.

---

## Troubleshooting

**Google sign-in not working?**
- Make sure the Supabase callback URL is added to your Google OAuth credentials
- Make sure your Vercel URL is in Supabase's Redirect URLs list

**Events aren't saving?**
- Double-check your `.env` variables match exactly what Supabase shows
- Make sure you ran all the SQL to create the tables

**Vercel deploy failing?**
- Check that you added the environment variables in Vercel's settings
- Check the build logs — Vercel shows you exactly what went wrong

**Need help?** Bring the error message back to Claude 🐯
