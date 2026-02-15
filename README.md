# Easy Learn

A learning platform with IQ test, learning hub, roadmap, coding practice, and leaderboard. Built with React, Vite, Tailwind, Framer Motion, and Supabase.

---

## What you need before starting

- **Node.js 18+** installed on your computer
- A **Supabase** account (free at [supabase.com](https://supabase.com))
- A **GitHub** account (to deploy on Netlify)

---

# Part 1: Run the app locally

Follow these steps in order. After this, the app will run on your computer with email/password login.

---

## Step 1: Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and sign in.
2. Click **“New project”**.
3. Choose your organization (or create one).
4. Enter a **project name** (e.g. `easy-learn`).
5. Set a **database password** and save it somewhere safe.
6. Pick a **region** close to you.
7. Click **“Create project”** and wait until it’s ready.

---

## Step 2: Run the database schema

This creates all the tables and security rules the app needs.

1. In the Supabase dashboard, click **“SQL Editor”** in the left sidebar.
2. Click **“New query”**.
3. Open the file **`supabase/schema.sql`** from this project in your code editor.
4. Copy **everything** in that file (Ctrl+A, Ctrl+C).
5. Paste it into the Supabase SQL Editor.
6. Click **“Run”** (or press Ctrl+Enter).
7. You should see a success message. If you see any error, check that you copied the full file.

---

## Step 3: Get your Supabase URL and key

1. In Supabase, click the **gear icon** (⚙️) in the left sidebar for **Project Settings**.
2. Click **“API”** in the left menu under Project Settings.
3. You’ll see:
   - **Project URL** (e.g. `https://abcdefgh.supabase.co`)
   - **Project API keys** → **anon public** (a long key starting with `eyJ...`)
4. Keep this page open; you’ll need both values in the next step.

---

## Step 4: Create your local `.env` file

1. In the **easy-learn** project folder, find the file **`.env.example`**.
2. Copy it and rename the copy to **`.env`** (exactly, with the dot at the start).
3. Open **`.env`** in your editor.
4. Replace the placeholder values with your real values from Step 3:
   - `VITE_SUPABASE_URL` = your **Project URL** (e.g. `https://abcdefgh.supabase.co`)
   - `VITE_SUPABASE_ANON_KEY` = your **anon public** key
5. Save the file.  
   **Important:** Do not commit `.env` to Git (it’s already in `.gitignore`).

Example `.env`:

```
VITE_SUPABASE_URL=https://abcdefgh.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE2...
```

---

## Step 5: Install and run the app

1. Open a terminal in the **easy-learn** folder.
2. Run:
   ```bash
   npm install
   npm run dev
   ```
3. Open the URL shown (usually **http://localhost:5173**) in your browser.
4. You should see the Easy Learn landing page. Try **Sign up** with email and password to confirm everything works.

At this point **email/password login works**. For **Google login**, do Part 2.

---

# Part 2: Enable Google login (optional)

If you skip this, users can still sign up and log in with email and password.

---

## Step 2.1: Turn on Google in Supabase

1. In Supabase, go to **Authentication** → **Providers** (left sidebar).
2. Find **Google** and switch it **ON**.
3. Leave the Supabase tab open; you’ll paste Client ID and Secret here after the next step.

---

## Step 2.2: Create Google OAuth credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Create or select a project (e.g. “Easy Learn”).
3. In the left menu: **APIs & Services** → **Credentials**.
4. Click **“Create credentials”** → **“OAuth client ID”**.
5. If asked, set the **OAuth consent screen** (User type: External, add app name and your email, save).
6. Back to **Create OAuth client ID**:
   - Application type: **Web application**.
   - Name: e.g. **Easy Learn**.
   - Under **Authorized redirect URIs**, click **“Add URI”** and add:
     ```
     https://YOUR_SUPABASE_REF.supabase.co/auth/v1/callback
     ```
     Replace `YOUR_SUPABASE_REF` with the part from your Supabase URL.  
     Example: if your URL is `https://abcdefgh.supabase.co`, use `https://abcdefgh.supabase.co/auth/v1/callback`.
7. Click **Create**.
8. Copy the **Client ID** and **Client secret** and paste them into Supabase **Authentication** → **Providers** → **Google**, then click **Save**.

---

## Step 2.3: Add redirect URLs in Supabase

Supabase must allow your app URLs for login redirects.

1. In Supabase: **Authentication** → **URL Configuration**.
2. Find **Redirect URLs**.
3. Add these one per line (or as your UI allows):
   - `http://localhost:5173`
   - `http://localhost:5173/`
   - Your **Netlify site URL** (you’ll get this after deploying), e.g. `https://your-site-name.netlify.app`
4. Click **Save**.

After this, Google login should work locally. For production (Netlify), make sure the Netlify URL is in the list and that you’ve added env vars on Netlify (see Part 3).

---

# Part 3: Deploy on Netlify (step by step)

---

## Step 3.1: Push your code to GitHub

1. Create a new repository on [GitHub](https://github.com) (e.g. `easy-learn`).
2. In your **easy-learn** folder, run (replace with your repo URL):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/easy-learn.git
   git push -u origin main
   ```
   Make sure **`.env` is not** in the repo (it should be in `.gitignore`).

---

## Step 3.2: Connect the site to Netlify

1. Go to [netlify.com](https://netlify.com) and sign in (e.g. with GitHub).
2. Click **“Add new site”** → **“Import an existing project”**.
3. Choose **GitHub** and authorize Netlify if asked.
4. Select your **easy-learn** repository.
5. You’ll see **Build settings**. Set:
   - **Base directory:** leave empty (or `easy-learn` if the repo root is one level above the app).
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
6. **Do not deploy yet.** Click **“Add environment variables”** or **“Show advanced”** and add variables first (Step 3.3).

---

## Step 3.3: Add environment variables on Netlify

If you skip this, the live site will show “Supabase not configured” and login won’t work.

1. In the same **Build settings** screen (or later: **Site** → **Site configuration** → **Environment variables**).
2. Click **“Add a variable”** or **“New variable”**.
3. Add the first variable:
   - **Key:** `VITE_SUPABASE_URL`
   - **Value:** your Supabase Project URL (same as in your `.env`), e.g. `https://abcdefgh.supabase.co`
   - **Scopes:** leave default (e.g. “All” or “Builds”).
4. Add the second variable:
   - **Key:** `VITE_SUPABASE_ANON_KEY`
   - **Value:** your Supabase **anon public** key (same as in your `.env`).
5. Save. Then click **“Deploy site”** (or **“Deploy”**).

---

## Step 3.4: Wait for the first deploy

1. Netlify will run `npm install` and `npm run build` using the env vars you added.
2. When the deploy finishes, Netlify will show your site URL, e.g. `https://random-name-123.netlify.app`.
3. Open that URL. The app should load. If you still see “Supabase not configured”, go to **Troubleshooting** below.

---

## Step 3.5: Add the Netlify URL in Supabase (for Google login)

1. Copy your **full Netlify site URL** (e.g. `https://random-name-123.netlify.app`).
2. In Supabase: **Authentication** → **URL Configuration** → **Redirect URLs**.
3. Add that URL (with or without a trailing slash, as allowed by the UI).
4. Click **Save**.

Now Google login should work on the live Netlify site.

---

## Step 3.6: If you added env vars after the first deploy

Environment variables are read **at build time**. If you added or changed them after the first deploy:

1. In Netlify: **Deploys** tab.
2. Click **“Trigger deploy”** → **“Deploy site”** (or **“Clear cache and deploy site”**).
3. Wait for the new deploy to finish, then test the site again.

---

# Troubleshooting

### “Supabase not configured” on Netlify

- The app was built **without** the Supabase env vars.
- **Fix:** In Netlify go to **Site configuration** → **Environment variables** and add:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
  with the same values as in your `.env`. Then trigger a **new deploy** (Deploys → Trigger deploy → Deploy site).

### Google login works locally but not on Netlify

- **Fix 1:** Add your **exact** Netlify URL to Supabase **Authentication** → **URL Configuration** → **Redirect URLs** and save.
- **Fix 2:** Make sure the env vars are set on Netlify and you redeployed after adding them.

### Email/password works but Google says “provider is not enabled”

- Google is not enabled in Supabase.
- **Fix:** Supabase → **Authentication** → **Providers** → turn **Google** ON and add your Google OAuth Client ID and Client secret (see Part 2).

### Build fails on Netlify

- Check the **Build log** in the Deploys tab.
- Common issues: wrong **Build command** (should be `npm run build`) or wrong **Publish directory** (should be `dist`). Base directory: leave empty if your `package.json` is in the repo root.

---

# Quick reference

| What              | Where / Command                          |
|-------------------|------------------------------------------|
| Supabase URL/Key  | Supabase → Project Settings → API        |
| Local env file    | `.env` in project root (from `.env.example`) |
| Run locally      | `npm install` then `npm run dev`         |
| Build            | `npm run build` → output in `dist/`      |
| Netlify build    | Build command: `npm run build`           |
| Netlify publish  | Publish directory: `dist`                |
| Netlify env vars | Site configuration → Environment variables |
| Redirect URLs     | Supabase → Authentication → URL Configuration |

---

# Project structure

```
easy-learn/
├── src/
│   ├── components/   # Layout, ProtectedRoute, ErrorBoundary
│   ├── contexts/     # AuthContext
│   ├── data/         # IQ questions
│   ├── lib/          # supabase.js
│   ├── pages/        # All pages (Landing, Login, Dashboard, etc.)
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── supabase/
│   └── schema.sql    # Database schema + RLS + seed data
├── .env.example
├── index.html
├── package.json
└── vite.config.js
```

---

License: MIT. 