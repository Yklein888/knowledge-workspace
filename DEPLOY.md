# 🚀 Knowledge Workspace — Deployment to Vercel

Complete this checklist to deploy your app to production.

## Prerequisites

✅ Local setup complete (ran `RUN_SETUP.ps1`)
✅ Testing complete (signup/login/pages work locally)
✅ Git repository initialized

## Phase 1: Vercel Setup (5 minutes)

### Step 1: Link to Vercel

```bash
cd "C:\Users\yitzi\Documents\מחברת עבודה"
vercel link
```

Follow the prompts to:
- Select your team
- Create new project or select existing
- Project name: `knowledge-workspace`

### Step 2: Set Environment Variables on Vercel

```bash
# Add Supabase credentials to Vercel
vercel env add NEXT_PUBLIC_SUPABASE_URL
# Paste: https://your-project.supabase.co

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
# Paste: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

vercel env add SUPABASE_SERVICE_ROLE_KEY
# Paste: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Step 3: Configure Supabase for Production

In Supabase dashboard:

1. Go to **Settings** → **Auth**
2. Under **Site URL** add your Vercel URL:
   - `https://your-project.vercel.app`
3. Under **Redirect URLs** add:
   - `https://your-project.vercel.app/workspace`
   - `https://your-project.vercel.app/login`
   - `https://your-project.vercel.app/signup`

## Phase 2: Deploy (2 minutes)

### Step 4: Deploy to Production

```bash
vercel deploy --prod
```

You'll get a production URL. Example: `https://knowledge-workspace-abc123.vercel.app`

### Step 5: Verify Deployment

Visit your production URL and test:
- [ ] Landing page loads
- [ ] Click "Get Started" → redirects to login
- [ ] Sign up works
- [ ] Login works
- [ ] Pages CRUD works
- [ ] Logout works
- [ ] Data persists in Supabase

## Phase 3: Setup GitHub Actions (Optional but Recommended)

### Step 6: Create GitHub Secrets

In GitHub repo → Settings → Secrets and variables → Actions:

```
VERCEL_TOKEN=<your-vercel-token>
VERCEL_ORG_ID=<from-vercel-dashboard>
VERCEL_PROJECT_ID=<from-.vercel/project.json>
```

Get these values:
- `VERCEL_TOKEN`: https://vercel.com/account/tokens
- `VERCEL_ORG_ID`: From `.vercel/project.json` (already created when you ran `vercel link`)
- `VERCEL_PROJECT_ID`: From `.vercel/project.json`

### Step 7: Test GitHub Actions

```bash
git add .
git commit -m "chore: setup GitHub Actions"
git push origin main
```

Go to GitHub → Actions tab. Should see deployment workflow running.

## Phase 4: Custom Domain (Optional)

If you want to use a custom domain:

### In Vercel:

1. Go to Project Settings → Domains
2. Add your domain
3. Follow the DNS configuration instructions

### In Supabase:

1. Update Site URL in Settings → Auth to your custom domain
2. Test signup/login again

## Troubleshooting

### "Vercel command not found"

```bash
npm install -g vercel
vercel login
```

### "Build fails on Vercel"

Check logs:
```bash
vercel logs <your-url>
```

Common issues:
- Missing environment variables (verify in Project Settings → Environment Variables)
- Database connection error (verify Supabase credentials)
- Build timeout (usually fine, retry deploy)

### "Auth not working on production"

In Supabase Settings → Auth:
- [ ] Confirm Site URL is set to your production URL
- [ ] Confirm redirect URLs include your production paths
- [ ] Wait ~5 minutes for changes to propagate

### "Pages not showing in workspace"

- Check Supabase connection with `vercel logs`
- Verify `SUPABASE_SERVICE_ROLE_KEY` is set in Vercel
- Check Supabase table permissions

## ✅ Success Checklist

- [ ] Project linked to Vercel
- [ ] Environment variables set on Vercel
- [ ] Production deployed
- [ ] Signup works on production
- [ ] Login works on production
- [ ] Pages CRUD works on production
- [ ] Supabase sees production data
- [ ] Custom domain configured (if applicable)
- [ ] GitHub Actions setup (if applicable)

## 🎉 Production Ready!

Your Knowledge Workspace is now live!

### Next Steps:

1. **Share your URL** — Invite users to test
2. **Monitor** — Check Vercel logs and Supabase dashboards
3. **Iterate** — Build more features:
   - Rich text editor
   - Sidebar navigation
   - Page linking
   - Agent builder
   - Email notifications

---

## Rollback (If needed)

```bash
vercel rollback
```

This reverts to the previous production deployment.

---

## Support

If you encounter issues:

1. Check Vercel logs: `vercel logs <url>`
2. Check Supabase logs: Project → Logs
3. Review error messages carefully
4. Verify environment variables
5. Test locally again with the same credentials
