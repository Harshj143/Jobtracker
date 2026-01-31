# 💼 Job Hunt Tracker

A premium, glassmorphism-inspired job application tracker built with React. Track your jobs, recruiters, and companies with ease, all synced to the cloud.

## 🚀 Features
- **Modern Dashboard**: High-level stats of your application progress.
- **Smart Follow-ups**: Automatically highlights jobs you haven't heard back from in 4+ days.
- **Ghosting Detection**: Auto-tags applications as "Ghosted" after 30 days of inactivity.
- **Company & Recruiter Hubs**: Dedicated spaces to manage your network.
- **Cloud Sync**: Powered by Supabase for cross-device data persistence.
- **Manual Backup**: Export/Import your data as JSON anytime.

## 🛠️ Setup & Deployment

### 1. Supabase Backend
1. Create a project at [Supabase](https://supabase.com).
2. Run this SQL in the **SQL Editor**:
```sql
create table user_sync (
  user_id uuid references auth.users not null primary key,
  payload jsonb not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table user_sync enable row level security;
create policy "Users can update their own sync data" 
  on user_sync for all using (auth.uid() = user_id);
```
3. Disable **Email Confirmation** in `Authentication -> Providers -> Email` for instant access.

### 2. Vercel Environment Variables
Add these to your project settings to enable automatic sync on all devices:
- `VITE_SUPABASE_URL`: Your project API URL.
- `VITE_SUPABASE_ANON_KEY`: Your project's `anon` public key.

## 💻 Tech Stack
- **Frontend**: React, Vite
- **Styling**: Vanilla CSS (Custom Glassmorphism)
- **Backend**: Supabase (Auth & Database)
- **Deployment**: Vercel
