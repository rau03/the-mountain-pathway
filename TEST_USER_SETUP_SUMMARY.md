# 🧪 Test User Setup - Complete Guide

## 📋 What You'll Do

This guide helps you create a verified test user in Supabase so you can test the complete journey save/load functionality of The Mountain Pathway application.

---

## 🎯 Quick Path (5-10 minutes)

### 1️⃣ Get Your Supabase Credentials (2 min)

Visit: **https://app.supabase.com** → Your Project → Settings → API

Copy these two values:

- `SUPABASE_URL` - Your project URL (from Settings → API)
- `SUPABASE_SERVICE_ROLE_KEY` - Your service role key (from Settings → API)

### 2️⃣ Create Test User (1 min)

**Option A: Node Script (Recommended)**

```bash
SUPABASE_URL="your_url" \
SUPABASE_SERVICE_ROLE_KEY="your_key" \
node scripts/create-test-user.js
```

**Option B: Dashboard (Visual)**

- Go to Supabase Dashboard → Authentication → Users
- Click "Create a new user"
- Email: `testuser@mountainpathway.local`
- Password: `TestPassword123!`
- ✅ Check "Auto confirm user"
- Click Create

### 3️⃣ Run Dev Server (1 min)

```bash
npm run dev
```

### 4️⃣ Test the App (2-5 min)

1. Go to http://localhost:3000
2. Click "Begin Your Pathway"
3. Go through all 9 steps (takes 2-5 minutes)
4. Click "Log in to save"
5. Sign in with:
   - Email: `testuser@mountainpathway.local`
   - Password: `TestPassword123!`
6. Click "Save journey" and enter a title
7. ✅ Journey saved!

---

## 📊 What Gets Tested

| Feature                      | Status               |
| ---------------------------- | -------------------- |
| Anonymous journey completion | ✅                   |
| Single-click navigation      | ✅                   |
| Auth modal integration       | ✅                   |
| User authentication          | ✅ _with this setup_ |
| Journey persistence          | ✅ _with this setup_ |
| Journey retrieval            | ✅ _with this setup_ |
| Row-level security           | ✅ _with this setup_ |

---

## 🔑 Test Credentials

After running the script, you'll have:

```
Email:    testuser@mountainpathway.local
Password: TestPassword123!
```

These are automatically created with email pre-confirmed (no verification needed).

---

## 📁 Files Created for You

Four helpful files have been created in your project:

1. **`scripts/create-test-user.js`** - The Node.js script to create users
2. **`TESTING.md`** - Detailed testing walkthrough
3. **`SUPABASE_SETUP.md`** - Database schema and troubleshooting
4. **`scripts/CREATE_TEST_USER_GUIDE.md`** - Methods comparison

Read these files for detailed information!

---

## ⚠️ Important Security Notes

- **Service Role Key** = Admin access. Keep it secret!
- Never commit it to version control
- Only use in secure server-side environments
- The `.local` domain is safe for local testing only

---

## 🐛 Troubleshooting

**"Email is invalid"**

- Use exactly: `testuser@mountainpathway.local`

**"Invalid login credentials"**

- Check password: `TestPassword123!` (with capital T and numbers)

**"Script fails: Missing env vars"**

- Make sure both SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set

**"Save button doesn't appear after login"**

- Refresh the page
- Check browser console for errors

---

## 🚀 After Testing

1. **Verify saved data in Supabase:**

   - Go to SQL Editor
   - Run: `SELECT * FROM journeys;`
   - You should see your journey

2. **Test loading journeys:**

   - Click "Account" button (top-right)
   - Click "View Saved Journeys"
   - Your journey should appear

3. **Optional: Clean up**
   - Delete test user from Supabase Dashboard
   - Or run: `DELETE FROM auth.users WHERE email = 'testuser@mountainpathway.local';`

---

## 📞 Next Steps

1. **Now:** Follow the Quick Path above (5-10 minutes)
2. **Complete testing:** Run through the entire flow
3. **Verify:** Check Supabase Dashboard to confirm data saved
4. **Report:** Test results should show:
   - ✅ Journey saved to database
   - ✅ Journey loadable from "View Saved Journeys"
   - ✅ Row-level security working (other users can't see your journey)

---

## 📚 Full Documentation

For complete details, see:

- `TESTING.md` - Full testing guide with all steps
- `SUPABASE_SETUP.md` - Technical details and schema
- `scripts/CREATE_TEST_USER_GUIDE.md` - Comparison of all methods

---

**Ready?** Start with Step 1 above! ⬆️
