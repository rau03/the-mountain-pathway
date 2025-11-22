# 🌐 Domain Setup Guide - GoDaddy → Vercel

**Domain:** themountainpathway.com  
**Registrar:** GoDaddy  
**Hosting:** Vercel

---

## 📋 Quick Overview

You'll:

1. Add domain to Vercel project
2. Configure DNS in GoDaddy (2 options)
3. Test the domain works
4. Update your environment variable

**Time Required:** ~10-15 minutes

---

## Step 1: Add Domain to Vercel Project

### 1a. Go to Vercel Dashboard

1. Visit https://vercel.com/dashboard
2. Click on your project (the-mountain-pathway)
3. Click **Settings** (top nav)
4. Click **Domains** (left sidebar)

### 1b. Add Domain

1. Click **Add Domain**
2. Type: `themountainpathway.com`
3. Click **Add**

**Vercel will now show you two options:**

- **Option A:** Change nameservers (recommended, easier)
- **Option B:** Add DNS records manually

Choose one below 👇

---

## Step 2: Option A - Use Vercel's Nameservers (Recommended ⭐)

**Easier, fully managed by Vercel**

### 2a. Get Nameservers from Vercel

After adding the domain, Vercel shows you 4 nameservers:

```
ns1.vercel-dns.com
ns2.vercel-dns.com
ns3.vercel-dns.com
ns4.vercel-dns.com
```

📌 **Keep this page open** - you'll need these values

### 2b. Update GoDaddy Nameservers

1. Go to **GoDaddy.com** → Sign in
2. Click **My Products**
3. Find **themountainpathway.com** → Click **DNS** (or Settings icon)
4. Look for "Nameservers" section
5. Click **Change** or **Edit**
6. Select **I'll use other nameservers**
7. Enter the 4 Vercel nameservers:
   ```
   ns1.vercel-dns.com
   ns2.vercel-dns.com
   ns3.vercel-dns.com
   ns4.vercel-dns.com
   ```
8. Click **Save**

⏱️ **Wait 24-48 hours** for DNS propagation (usually faster, but can take up to 48h)

### 2c. Verify in Vercel

Back in Vercel, you should see:

- ✅ Domain status: "Valid Configuration"

---

## Step 2 (Alt): Option B - Manual DNS Records

**If you prefer more control or have other services using GoDaddy DNS**

### 2b-Alt. Get DNS Records from Vercel

1. In Vercel Domain settings, you'll see:

   ```
   Type: A
   Name: @
   Value: 76.76.19.165

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

2. Copy these values

### 2c-Alt. Add Records to GoDaddy

1. Go to **GoDaddy.com** → My Products
2. Find **themountainpathway.com** → Click **DNS** (or Manage DNS)
3. Look for **DNS Records** or **A Records** section
4. Delete any existing A records for `@`
5. Add new records:

   **Record 1:**

   - Type: A
   - Host: @ (or leave blank)
   - Points to: 76.76.19.165
   - TTL: 600 (default)

   **Record 2:**

   - Type: CNAME
   - Host: www
   - Points to: cname.vercel-dns.com
   - TTL: 600 (default)

6. Click **Save**

⏱️ **Wait 15 minutes to 1 hour** for DNS to update

---

## Step 3: Test Your Domain

### 3a. Wait for DNS Propagation

Use this tool to check: https://dns.google/ or https://mxtoolbox.com/

Search for: `themountainpathway.com`

✅ **When ready, you'll see:**

- A record points to Vercel
- CNAME record is correct

### 3b. Test in Browser

1. Open: https://themountainpathway.com
2. Should load your Mountain Pathway app
3. No warnings or errors

✅ **Success if:**

- Page loads
- URL shows: https://themountainpathway.com
- Padlock icon (secure)

---

## Step 4: Update Environment Variable

Now update your Vercel environment variable:

### 4a. In Vercel Dashboard

1. Go to **Settings** → **Environment Variables**
2. Find: `NEXT_PUBLIC_SITE_URL`
3. Change from: `https://your-old-vercel-url.vercel.app`
4. Change to: `https://themountainpathway.com`
5. Click **Save**

### 4b. Trigger a Redeployment

1. Go to **Deployments** (top nav)
2. Find the latest deployment
3. Click **...** menu → **Redeploy**
4. Vercel rebuilds with new env var

✅ **Wait ~2 minutes for deployment to complete**

---

## Step 5: Final Verification

### 5a. Test Authentication Callback

1. Visit: https://themountainpathway.com
2. Click "Log in to save"
3. Go through signup/login flow
4. After login, should redirect to: https://themountainpathway.com (not error)

✅ **Auth redirect should work now!**

### 5b. Test All Flows

- [ ] Homepage loads
- [ ] Can start journey
- [ ] Can complete journey
- [ ] Can login/signup
- [ ] Can save journey
- [ ] No console errors

---

## 🎉 You're Done!

Your domain is now connected!

**Your app is live at:** https://themountainpathway.com ✅

---

## 📋 DNS Propagation Checklist

- [ ] Added domain to Vercel project
- [ ] Chose Option A (nameservers) or Option B (manual)
- [ ] Updated GoDaddy DNS settings
- [ ] Waited for propagation (15 min - 48h)
- [ ] Verified domain loads in browser
- [ ] Updated NEXT_PUBLIC_SITE_URL env var
- [ ] Redeployed on Vercel
- [ ] Tested auth login/logout
- [ ] Tested save/load journey
- [ ] Shared with beta testers

---

## 🚨 Troubleshooting

### Domain not loading (shows GoDaddy page)

**Cause:** DNS not propagated yet
**Fix:** Wait 15-48 hours, then try again. Check status at dns.google

### "Invalid configuration" in Vercel

**Cause:** DNS records not correct
**Fix:**

- Option A: Check nameservers in GoDaddy match Vercel exactly
- Option B: Check A and CNAME records in GoDaddy DNS

### Auth login fails / redirects to old URL

**Cause:** NEXT_PUBLIC_SITE_URL not updated
**Fix:**

1. Update env var to https://themountainpathway.com
2. Redeploy project
3. Wait 2 min for deployment

### SSL certificate error

**Cause:** Certificate still provisioning
**Fix:** Wait 5-10 minutes and refresh

---

## 📚 Reference Links

- **Vercel Docs:** https://vercel.com/docs/project-configuration/domains
- **GoDaddy DNS Help:** https://www.godaddy.com/help
- **Check DNS:** https://dns.google
- **SSL Status:** https://crt.sh

---

## ✅ Summary

**Quick checklist:**

1. Add domain to Vercel ✓
2. Point GoDaddy DNS to Vercel ✓
3. Wait for propagation ✓
4. Update env var ✓
5. Redeploy ✓
6. Test ✓

**You're ready for beta!** 🚀

---

_Created: November 22, 2025_
