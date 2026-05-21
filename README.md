# Wabisabi blog — Multi-user Platform

React + Vite + Supabase blogging platform with auth, profiles, and multi-user support.

---

## 🚀 Run locally

```bash
npm install
npm run dev
```

## ☁️ Deploy to Vercel

```bash
npx vercel
```

After deploying, go to **Google Cloud Console → Credentials → your OAuth client**
and add your Vercel URL (e.g. `https://sakura-blog.vercel.app`) to:
- Authorised JavaScript origins
- Authorised redirect URIs → `https://sakura-blog.vercel.app` (Supabase handles the callback)

Also add your Vercel URL in **Supabase → Authentication → URL Configuration → Site URL**.

---

## Required SQL (run in Supabase SQL Editor)

```sql
-- Run this if you haven't already
alter table posts add column if not exists user_id uuid references auth.users(id) on delete cascade;
alter table posts add column if not exists author_name text;
alter table posts add column if not exists author_emoji text;

create table if not exists profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  username text unique,
  full_name text,
  bio text,
  avatar_emoji text default '🌸',
  created_at timestamptz default now()
);

drop policy if exists "public access" on posts;
create policy "anyone can read posts" on posts for select using (true);
create policy "users can insert own posts" on posts for insert with check (auth.uid() = user_id);
create policy "users can update own posts" on posts for update using (auth.uid() = user_id);
create policy "users can delete own posts" on posts for delete using (auth.uid() = user_id);

alter table profiles enable row level security;
create policy "anyone can read profiles" on profiles for select using (true);
create policy "users can insert own profile" on profiles for insert with check (auth.uid() = id);
create policy "users can update own profile" on profiles for update using (auth.uid() = id);
```

---

## ✨ Features

- 🔐 Google OAuth + email/password sign up
- 🌸 Auto-created profile on first login
- ✏️ Write, edit, delete your own notes
- 👤 Profile pages for every writer
- 🌍 All notes visible to everyone
- 🔍 Search + tag filter on blog page
- 📱 Works on every device

