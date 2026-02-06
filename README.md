# CareerFlow - Job Tracker 🚀

A premium, modern job application tracker designed to streamline your career hunt. Built with React + Vite, featuring a sleek glassmorphism UI and powerful organization tools.

### ✨ Features
- **Job Tracker**: Log and monitor all your job applications with auto-ghosting detection.
- **YC Startup Hub**: Browse thousands of YC startups, copy founder emails, and track initial/follow-up outreach.
- **Company Tracking**: Build a targeted list of your dream companies.
- **Recruiter Vault**: Store contact details for recruiters and hiring managers.
- **Apply Later**: Bookmark interesting job links to apply to when you're ready.
- **Cloud Sync (Supabase)**: Real-time data synchronization across all devices.
- **Manual Backups**: Reliable JSON import/export for full data control.
- **Modern UI**: Dark mode with glassmorphism effects and optimized mobile experience.

### 🛠️ Tech Stack
- **Frontend**: React, Vanilla CSS
- **Backend & Sync**: Supabase (Auth + Database)
- **Tooling**: Vite, npm

### 🚀 Getting Started
1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Create a `.env` file based on `.env.example` and add your Supabase credentials.
4. Run `npm run dev` to start the development server.
5. Setup the `user_sync` table in Supabase (see Walkthrough for SQL).

### 📱 Mobile Setup
Access your deployed link or local IP on your phone. Go to **Settings** in the app, enter your Supabase URL/Key, and log in to sync your data instantly!
