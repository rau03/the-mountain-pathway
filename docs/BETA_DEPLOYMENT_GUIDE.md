# 🚀 Beta Deployment Guide

Quick reference for deploying to beta testers.

---

## Step 1: Set Up Environment Variables

Your deployment platform (Vercel, Netlify, etc.) needs these three variables:

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_SITE_URL
```

### Where to Find These Values

1. **Go to Supabase Dashboard** → https://app.supabase.com
2. **Select your project**
3. **Click Settings → API**
4. Copy:
   - **NEXT_PUBLIC_SUPABASE_URL** = "Project URL" field
   - **NEXT_PUBLIC_SUPABASE_ANON_KEY** = Under "Project API keys" → "anon" key

### NEXT_PUBLIC_SITE_URL

This is your deployment URL (used for OAuth redirect):

- **Local Dev:** `http://localhost:3000`
- **Vercel:** `https://your-app.vercel.app`
- **Custom Domain:** `https://yourdomain.com`

---

## Step 2: Verify Supabase is Configured

Before deploying, ensure your Supabase project has:

- ✅ Authentication enabled
- ✅ `journeys` table created
- ✅ `journey_steps` table created
- ✅ Row-level security (RLS) policies configured

See `SUPABASE_SETUP.md` for schema details.

---

## Step 3: Build & Deploy

### Local Testing

```bash
# Install dependencies
npm install

# Build
npm run build

# Start production server locally
npm start

# Visit http://localhost:3000
```

### Deploy to Vercel (Recommended)

```bash
# Push to GitHub, then Vercel auto-deploys
# Or use Vercel CLI:
npm i -g vercel
vercel
```

---

## Step 4: Test Core Flows

Before sending to beta testers, verify:

- [ ] Sign up works
- [ ] Login works
- [ ] Save journey works
- [ ] Load journey works
- [ ] Logout works
- [ ] Mobile responsive
- [ ] No console errors (F12)

---

## Step 5: Share with Beta Testers

Send them:

1. **App URL** (your deployment link)
2. **Getting Started Guide** (see BETA_TEST_READINESS.md)
3. **Contact email** for bug reports

---

## Quick Troubleshooting

| Issue                           | Solution                                      |
| ------------------------------- | --------------------------------------------- |
| "Authentication not configured" | Check env vars are set in deployment platform |
| Users can't save journeys       | Verify Supabase project is accessible         |
| All users see same journeys     | RLS policies not configured correctly         |
| Session lost on page refresh    | Check browser cookies are enabled             |

See `BETA_TEST_READINESS.md` for detailed troubleshooting.

---

**You're ready to go!** 🎉
