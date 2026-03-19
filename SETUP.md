# 🚀 Knowledge Workspace — Full Setup Guide

Complete this checklist to get the app running locally with Supabase.

## Phase 1: Supabase Project Setup (10 minutes)

### Step 1: Create Supabase Project

1. Visit **https://app.supabase.com**
2. Sign in or create a free account
3. Click **"New Project"**
4. Fill in:
   - **Name**: `knowledge-workspace`
   - **Database Password**: Save this somewhere secure
   - **Region**: Choose closest to you
5. Click **Create new project**
6. ⏳ Wait ~2 minutes for project to initialize

### Step 2: Get Your Credentials

Once your project is ready:

1. Go to **Settings** → **API** (left sidebar)
2. Copy these values:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Go to **Settings** → **API** → **Service Role Secret**
   - Copy this → `SUPABASE_SERVICE_ROLE_KEY`

### Step 3: Update `.env.local`

Edit `C:\Users\yitzi\Documents\מחברת עבודה\.env.local`:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Vercel
VERCEL_ENV=development
VERCEL_URL=http://localhost:3000
```

**⚠️ Important:**
- Never commit `.env.local` to git (already in .gitignore)
- Service role key is SECRET — keep it secure
- Public key is fine to expose (used in browser)

---

## Phase 2: Deploy Database Schema (2 minutes)

### Step 4: Push Schema to Supabase

```bash
cd "C:\Users\yitzi\Documents\מחברת עבודה"

# Install dotenv if needed
npm install -D dotenv-cli

# Push schema to your database
npx dotenv -e .env.local -- npx drizzle-kit push
```

**Expected output:**
```
✅ Tables created:
  - users
  - pages
  - documents
  - links
  - agents
  - agent_exports
  - audit_logs
```

### Step 5: Verify in Supabase Dashboard

1. Go to https://app.supabase.com
2. Select your project
3. Click **Table Editor** (left sidebar)
4. Should see all 7 tables listed

---

## Phase 3: Test Locally (5 minutes)

### Step 6: Start Dev Server

```bash
npm run dev
```

Visit: **http://localhost:3000**

### Step 7: Test the Flow

1. Click **"Get Started"** button
2. You should be redirected to login page
3. Click **"Sign up"** to create account
4. Fill in form:
   - Name: Your name
   - Email: test@example.com
   - Password: testpassword123
5. Click **"Sign Up"**
6. Should redirect to **`/workspace`** page
7. Try creating a page:
   - Title: "First Page"
   - Click **"Create"**
8. Should see page in list
9. Try deleting it

**If anything fails:** Check browser console (F12) for errors

---

## Phase 4: Verify Database (2 minutes)

### Step 8: Check Data in Supabase

1. Go to https://app.supabase.com
2. Select your project
3. Click **Table Editor**
4. Click **users** table
5. Should see your test user (email: test@example.com)
6. Click **pages** table
7. Should see "First Page" (if you created it)

---

## Phase 5: Prepare for Vercel Deployment

### Step 9: Link to Vercel

```bash
cd "C:\Users\yitzi\Documents\מחברת עבודה"
vercel link
```

Follow prompts to select/create a project.

### Step 10: Set Environment Variables on Vercel

```bash
# Add Supabase credentials to Vercel
vercel env add NEXT_PUBLIC_SUPABASE_URL
# Paste: https://xxxxx.supabase.co

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
# Paste: eyJxxx...

vercel env add SUPABASE_SERVICE_ROLE_KEY
# Paste: eyJxxx...
```

### Step 11: Deploy to Production

```bash
vercel deploy --prod
```

After deploy:
- Visit the URL provided
- Test signup/login flow
- Check your Supabase project — data should sync

---

## ✅ Troubleshooting

### "Cannot find module '@/db'"
```bash
# Restart dev server
npm run dev
```

### "DATABASE_URL not set"
```bash
# Make sure .env.local exists and has credentials
cat .env.local

# Re-source environment
npx dotenv -e .env.local -- npx drizzle-kit push
```

### "CORS error on signup"
- Supabase → Settings → Auth → Site URL
- Add `http://localhost:3000` (local) and your Vercel URL (production)

### "Emails not verifying"
- Supabase → Settings → Auth → Providers
- Email: Turn ON (should be by default)
- Confirm email required: toggle as needed

### "User logs in but data doesn't show"
- Check `.env.local` has correct credentials
- Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 🎉 Success Checklist

- [ ] Supabase project created
- [ ] Credentials in `.env.local`
- [ ] Schema pushed (`npm run db:push`)
- [ ] Dev server runs (`npm run dev`)
- [ ] Can sign up at http://localhost:3000/signup
- [ ] Can see pages in `/workspace`
- [ ] Can create pages
- [ ] Can delete pages
- [ ] Data appears in Supabase dashboard
- [ ] Linked to Vercel (`vercel link`)
- [ ] Env vars set on Vercel
- [ ] Deployed to production (`vercel deploy --prod`)

---

## 📚 Next Steps After Setup

Once the above is complete:

1. **Build Page Editor** — Rich text editor for page content
2. **Add Sidebar** — Page tree navigation
3. **Implement Links** — Connect pages together
4. **Build Agent Builder** — Step-based UI for creating agents
5. **Add Observability** — Logging and monitoring

---

## 🆘 Need Help?

If you get stuck:
1. Check browser console (F12) for JavaScript errors
2. Check Vercel logs: `vercel logs`
3. Check Supabase logs: Project → Logs
4. Verify credentials are correct in `.env.local`

Good luck! 🚀
