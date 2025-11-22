# ⚡ Domain Setup - 3 Steps (5 Minutes)

**themountainpathway.com → Vercel**

---

## Step 1️⃣ Add Domain to Vercel (2 min)

```
1. Go to: https://vercel.com/dashboard
2. Click: Your Project → Settings → Domains
3. Click: Add Domain
4. Type: themountainpathway.com
5. Click: Add
```

**Result:** Vercel shows you nameservers or DNS records

---

## Step 2️⃣ Update GoDaddy DNS (2 min)

### Option A: Easiest ⭐

```
1. Go to: https://godaddy.com → My Products
2. Find: themountainpathway.com → DNS (or Settings)
3. Find: Nameservers
4. Click: Change
5. Enter these 4 nameservers from Vercel:
   - ns1.vercel-dns.com
   - ns2.vercel-dns.com
   - ns3.vercel-dns.com
   - ns4.vercel-dns.com
6. Save
```

⏱️ Wait 15-48 hours for DNS to update

---

### Option B: If you need more control

```
1. Go to: https://godaddy.com → My Products
2. Find: themountainpathway.com → DNS
3. Add these records from Vercel:

   A Record:
   - Host: @
   - Value: 76.76.19.165

   CNAME Record:
   - Host: www
   - Value: cname.vercel-dns.com
4. Save
```

⏱️ Wait 15-60 minutes for DNS to update

---

## Step 3️⃣ Update Environment Variable (1 min)

```
1. Go to: Vercel Dashboard → Settings → Environment Variables
2. Find: NEXT_PUBLIC_SITE_URL
3. Change to: https://themountainpathway.com
4. Save
5. Go to: Deployments
6. Click menu (...) on latest → Redeploy
7. Wait ~2 min for deployment
```

---

## ✅ Test It Works

```
1. Open: https://themountainpathway.com
2. Should load your app ✓
3. Try logging in and saving a journey ✓
```

---

## 🎉 Done!

Your domain is live: https://themountainpathway.com

Ready for beta testers! 🚀

---

**Issues?** See `DOMAIN_SETUP_GUIDE.md` for detailed troubleshooting.
