# 📋 Knowledge Workspace — Complete Setup Checklist

Follow this checklist to run your project from zero to production in **45 minutes**.

---

## Phase 1: Create Supabase Project (10 minutes)

### Create Project

- [ ] Visit https://app.supabase.com
- [ ] Sign in or create free account
- [ ] Click "New Project"
- [ ] Fill in:
  - Name: `knowledge-workspace`
  - Database password: Save securely
  - Region: Choose your location
- [ ] Click "Create new project"
- [ ] ⏳ Wait ~2 minutes for initialization

### Get Credentials

Once project is ready:

- [ ] Go to Settings → API (left sidebar)
- [ ] Copy:
  - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
  - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - **service_role secret** → `SUPABASE_SERVICE_ROLE_KEY`

---

## Phase 2: Configure Local Environment (5 minutes)

### Create `.env.local`

- [ ] Open: `C:\Users\yitzi\Documents\מחברת עבודה\.env.local`
- [ ] Paste your Supabase credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...
NEXT_PUBLIC_APP_URL=http://localhost:3000
VERCEL_ENV=development
VERCEL_URL=http://localhost:3000
```

- [ ] Save the file
- [ ] ⚠️ Make sure `.env.local` is in `.gitignore` (already is)

---

## Phase 3: Deploy Database Schema (5 minutes)

### Run Setup Script

```bash
# Open PowerShell in project directory
cd "C:\Users\yitzi\Documents\מחברת עבודה"

# Run the setup script
.\RUN_SETUP.ps1
```

**Expected output:**
```
✅ .env.local found
✅ Credentials configured
✅ Dependencies installed
✅ Database schema deployed
✅ TypeScript verified

🎉 Setup Complete!
```

If script fails:
- [ ] Check error message
- [ ] Verify `.env.local` has all 3 credentials
- [ ] Verify Supabase project is fully initialized
- [ ] Try running again

---

## Phase 4: Test Locally (10 minutes)

### Start Dev Server

```bash
npm run dev
```

You should see:
```
> next dev

  ▲ Next.js 16.0.0
  - Local:        http://localhost:3000
```

### Test Complete Flow

- [ ] Visit http://localhost:3000
- [ ] See landing page
- [ ] Click "Get Started" button
- [ ] Redirected to login page ✅
- [ ] Click "Sign up here"
- [ ] Fill in signup form:
  - Name: Test User
  - Email: test@example.com
  - Password: Test123!
- [ ] Click "Sign Up"
- [ ] See "Account created!" message
- [ ] Redirected to login page ✅
- [ ] Enter credentials and login
- [ ] Redirected to workspace ✅
- [ ] See "Welcome, test@example.com" ✅
- [ ] Try creating a page:
  - Title: "My First Page"
  - Click "Create"
- [ ] See page in list ✅
- [ ] Try deleting the page
- [ ] Page removed from list ✅
- [ ] Click "Logout"
- [ ] Redirected to home page ✅

### Verify in Supabase

- [ ] Visit https://app.supabase.com
- [ ] Select your project
- [ ] Click Table Editor
- [ ] Check `users` table:
  - [ ] See test@example.com user
- [ ] Check `pages` table:
  - [ ] See "My First Page" (if you didn't delete it)

---

## Phase 5: Prepare for Production Deployment (5 minutes)

### Initialize Git

```bash
git init
git add .
git commit -m "chore: initial commit - knowledge workspace setup"
```

### Create GitHub Repository (Optional but Recommended)

- [ ] Visit https://github.com/new
- [ ] Create repository: `knowledge-workspace`
- [ ] Add remote:
  ```bash
  git remote add origin https://github.com/YOUR_USERNAME/knowledge-workspace.git
  git branch -M main
  git push -u origin main
  ```

---

## Phase 6: Deploy to Vercel (5 minutes)

### Link to Vercel

```bash
vercel login
vercel link
```

Follow prompts:
- [ ] Select team
- [ ] Create new project
- [ ] Project name: `knowledge-workspace`

### Set Environment Variables

```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL
# Paste: https://your-project.supabase.co

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
# Paste: eyJxxx...

vercel env add SUPABASE_SERVICE_ROLE_KEY
# Paste: eyJxxx...
```

### Configure Supabase for Production

In Supabase dashboard:

- [ ] Go to Settings → Auth
- [ ] Find "Site URL" and add your Vercel URL:
  - Example: `https://knowledge-workspace-abc123.vercel.app`
- [ ] Find "Redirect URLs" and add:
  ```
  https://knowledge-workspace-abc123.vercel.app/workspace
  https://knowledge-workspace-abc123.vercel.app/login
  https://knowledge-workspace-abc123.vercel.app/signup
  ```
- [ ] Save

### Deploy to Production

```bash
vercel deploy --prod
```

You'll get a production URL. Save it! Example:
```
Production: https://knowledge-workspace-abc123.vercel.app
```

---

## Phase 7: Verify Production (5 minutes)

### Test Production URL

Visit your production URL and repeat the local tests:

- [ ] Landing page loads
- [ ] Signup works
- [ ] Login works
- [ ] Pages CRUD works
- [ ] Logout works

### Check Supabase

- [ ] Visit https://app.supabase.com
- [ ] Select your project
- [ ] Check `users` table for production test account
- [ ] Confirm data synced from production

---

## Phase 8: Optional - GitHub Actions CI/CD (5 minutes)

### Create GitHub Secrets

In GitHub repo → Settings → Secrets and variables → Actions:

- [ ] Create `VERCEL_TOKEN`:
  1. Visit https://vercel.com/account/tokens
  2. Create token
  3. Copy and paste in GitHub
- [ ] Create `VERCEL_ORG_ID`:
  1. Check `.vercel/project.json` in your repo
  2. Copy `orgId` value
- [ ] Create `VERCEL_PROJECT_ID`:
  1. Check `.vercel/project.json` in your repo
  2. Copy `projectId` value

### Test GitHub Actions

```bash
git add .
git commit -m "chore: add GitHub Actions secrets"
git push origin main
```

- [ ] Go to GitHub → Actions tab
- [ ] Should see deployment workflow running
- [ ] Wait for it to complete
- [ ] Verify production updated

---

## ✅ Final Verification

- [ ] Signup/login works locally ✅
- [ ] Pages CRUD works locally ✅
- [ ] Data in Supabase ✅
- [ ] Production URL deployed ✅
- [ ] Production signup/login works ✅
- [ ] Production pages work ✅
- [ ] GitHub Actions configured (if applicable) ✅

---

## 🎉 SUCCESS!

Your Knowledge Workspace is now:

✅ **Live in production**
✅ **Connected to Supabase**
✅ **Fully functional with authentication**
✅ **Ready for users**

---

## Next Steps

### Phase 2 Features (After Production Confirmed)

1. **Rich Text Editor**
   - Build Markdown editor for page content
   - Real-time preview
   - Auto-save

2. **Sidebar Navigation**
   - Display page tree structure
   - Create nested pages
   - Drag-and-drop reordering

3. **Page Linking System**
   - Connect related pages
   - Backlink references
   - Link preview on hover

4. **Agent Builder UI**
   - Step-based workflow
   - Tool configuration
   - Agent export

5. **Observability**
   - Vercel Analytics
   - Error tracking
   - Performance monitoring

---

## Troubleshooting Quick Reference

| Issue | Solution |
|-------|----------|
| `.env.local` errors | Verify all 3 Supabase values present |
| Database push fails | Wait 2 min for Supabase project init |
| Auth not working | Check Supabase Site URL + Redirect URLs |
| Pages not showing | Verify `SUPABASE_SERVICE_ROLE_KEY` set |
| Build fails on Vercel | Check `vercel logs <url>` for details |
| Can't login on production | Supabase auth needs 5 min to propagate |

---

## Time Estimate

- Phase 1 (Supabase): 10 min
- Phase 2 (Environment): 5 min
- Phase 3 (Database): 5 min
- Phase 4 (Local test): 10 min
- Phase 5 (Git prep): 5 min
- Phase 6 (Vercel deploy): 5 min
- Phase 7 (Verification): 5 min
- Phase 8 (GitHub Actions): 5 min

**Total: ~50 minutes**

---

## Support Resources

- **Supabase Docs**: https://supabase.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Vercel Docs**: https://vercel.com/docs
- **Project README**: `README.md` in root directory
- **Setup Guide**: `SETUP.md` in root directory
- **Deployment Guide**: `DEPLOY.md` in root directory

---

## 🚀 Ready to Launch?

Start with Phase 1 and work through each section. You'll have a production-ready app in less than an hour!

Good luck! 💪
