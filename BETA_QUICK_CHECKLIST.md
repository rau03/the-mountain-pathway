# ⚡ Beta Launch Quick Checklist

**5 minutes to go!**

---

## ✅ Before You Deploy

```bash
# 1. Make sure build works
npm run build

# 2. Test locally
npm start
# Visit http://localhost:3000
# Test: signup, login, save journey, logout
```

- [ ] Build succeeds
- [ ] No console errors (F12)
- [ ] Can sign up
- [ ] Can login
- [ ] Can save journey

---

## 📋 Environment Variables Required

Set these in your deployment platform (Vercel, Netlify, etc.):

```
NEXT_PUBLIC_SUPABASE_URL = <your-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY = <your-anon-key>
NEXT_PUBLIC_SITE_URL = <your-app-url>
```

**Where to get them:** Supabase Dashboard → Settings → API

- [ ] Supabase URL set
- [ ] Anon key set
- [ ] Site URL set
- [ ] Deployed successfully

---

## 🎯 Core Flows to Test After Deployment

1. **New User Signup** (5 min)

   - [ ] Visit app
   - [ ] Click "Begin" → complete journey
   - [ ] Click "Log in to save" → "Sign up"
   - [ ] Create account with real email
   - [ ] Verify email if needed
   - [ ] Save the journey

2. **Login Flow** (3 min)

   - [ ] Click "Log in to save"
   - [ ] Enter credentials
   - [ ] Should show "Account" button after login
   - [ ] Click "View Saved Journeys" - journey appears

3. **Mobile Test** (2 min)
   - [ ] Open on phone or use Chrome DevTools (F12 → mobile)
   - [ ] Can tap buttons
   - [ ] Modal fits screen
   - [ ] Layout looks good

**Total: ~10 minutes**

---

## 🚨 Go/No-Go

### GO ✅ if:

- ✅ Signup/login works
- ✅ Can save journey
- ✅ Can view saved journey
- ✅ Mobile responsive
- ✅ No red console errors

### NO-GO ❌ if:

- ❌ Save fails
- ❌ Can't login
- ❌ Mobile broken
- ❌ Auth not configured

---

## 📤 Send to Beta Testers

**What to share:**

1. App URL
2. `BETA_TEST_READINESS.md` (full guide)
3. Contact email for bugs
4. Expectations: "This is beta - please report bugs!"

**What NOT to share:**

- ❌ API keys
- ❌ Database credentials
- ❌ Code (unless open source)

---

## 📊 Monitor During Beta

Watch for:

- [ ] Any login failures
- [ ] Save/load errors in browser console
- [ ] Performance issues
- [ ] User feedback about UX

**Check:** Supabase Dashboard → Logs for any API errors

---

## 🎉 You're Ready!

**Status: GO FOR BETA** 🚀

Questions? See:

- Full analysis: `PRE_BETA_ANALYSIS.md`
- Deployment guide: `BETA_DEPLOYMENT_GUIDE.md`
- Testing guide: `BETA_TEST_READINESS.md`

---

_Last updated: November 22, 2025_
