# Netlify deploy checklist – do these in order

Use this after your code is on GitHub. Do each step yourself (only you can log in to Netlify and Supabase).

---

## 1. Deploy on Netlify

1. Go to **https://app.netlify.com** and sign in (or sign up with GitHub).
2. Click **“Add new site”** → **“Import an existing project”**.
3. Click **“Deploy with GitHub”** and authorize Netlify if asked.
4. Choose your repo: **RIKASH04/Easy-learn**.
5. Set these and leave the rest as default:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
6. **Before clicking Deploy**, open **“Add environment variables”** or **“Show advanced”** and add Step 2 below.  
   If you already deployed, add the variables in Step 2 and then **Trigger deploy** again.
7. Click **“Deploy site”** and wait until it finishes.
8. Copy your site URL (e.g. `https://something.netlify.app`). You’ll need it in Step 3.

---

## 2. Add env vars on Netlify

If you didn’t add them during “Add new site”, do this now:

1. In Netlify: your site → **Site configuration** → **Environment variables**.
2. Click **“Add a variable”** or **“New variable”**.
3. Add **first variable**:
   - **Key:** `VITE_SUPABASE_URL`
   - **Value:** paste your Supabase Project URL (from your `.env` or Supabase → Project Settings → API).
   - Example: `https://abcdefgh.supabase.co`
4. Add **second variable**:
   - **Key:** `VITE_SUPABASE_ANON_KEY`
   - **Value:** paste your Supabase anon key (from your `.env` or Supabase → API → anon public).
5. Save.
6. Go to **Deploys** → **“Trigger deploy”** → **“Deploy site”** (so the new build uses these variables).

---

## 3. Add Netlify URL in Supabase (for login/Google)

1. Go to **https://supabase.com/dashboard** and open your project.
2. Left sidebar: **Authentication** → **URL Configuration**.
3. Under **Redirect URLs**, add your Netlify URL from Step 1, e.g.:
   - `https://something.netlify.app`
4. Click **Save**.

---

## 4. Test the live site

1. Open your Netlify URL in the browser.
2. You should see the Easy Learn landing page (no “Supabase not configured”).
3. Try **Sign up** or **Login** (email or Google). If Google doesn’t work, double-check Step 3 and that you redeployed after adding env vars in Step 2.

---

**Quick recap**

| Step | Where        | What to do |
|------|--------------|------------|
| 1    | Netlify      | Import GitHub repo, set build command and publish directory, deploy. |
| 2    | Netlify      | Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`, then trigger a new deploy. |
| 3    | Supabase     | Authentication → URL Configuration → add your Netlify URL under Redirect URLs. |
| 4    | Browser      | Open Netlify URL and test login. |

Only you can do these steps because they require your Netlify and Supabase logins.
