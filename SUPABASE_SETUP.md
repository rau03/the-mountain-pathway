# Supabase Setup & Verified Test User Creation

## Quick Start

To create a verified test user and test the save/load functionality, follow these steps:

### 1. Gather Your Supabase Credentials

**Location:** Supabase Dashboard → Your Project → Settings → API

You need:

- **Project URL** (looks like: `https://xxxxxxx.supabase.co`)
- **Service Role Key** (a long string starting with `eyJhbGc...`)

⚠️ **Security Note:** Service Role Key has admin privileges. Never commit to git or share publicly.

### 2. Create Test User

Choose one method:

#### Option A: Using Node Script (Fastest)

```bash
cd /Users/christopherrau/the-mountain-pathway

SUPABASE_URL="https://your-project.supabase.co" \
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key" \
node scripts/create-test-user.js
```

#### Option B: Using Supabase Dashboard (Visual)

1. Go to https://app.supabase.com → Your Project
2. Click **Authentication** → **Users**
3. Click **"Create a new user"**
4. Enter:
   - Email: `testuser@mountainpathway.local`
   - Password: `TestPassword123!`
5. ✅ Check "Auto confirm user"
6. Click "Create user"

#### Option C: Using Supabase CLI

```bash
supabase auth create-user \
  --email testuser@mountainpathway.local \
  --password TestPassword123!
```

### 3. Test the Complete Flow

```bash
# Terminal 1: Start development server
npm run dev

# Open browser to http://localhost:3000
# Then follow the testing steps below...
```

**Testing Checklist:**

- [ ] Homepage loads without legacy header
- [ ] Click "Begin Your Pathway"
- [ ] Navigate through all 9 steps (single clicks work)
- [ ] Add text to at least one step
- [ ] Reach Summary screen
- [ ] Click "Log in to save" button
- [ ] Enter credentials:
  - Email: `testuser@mountainpathway.local`
  - Password: `TestPassword123!`
- [ ] After login, "Log in to save" changes to "Save journey"
- [ ] Click "Save journey"
- [ ] Enter a title
- [ ] Click Save
- [ ] ✅ Journey appears in Supabase database

### 4. Verify Saved Data

**In Supabase Dashboard:**

1. Click **SQL Editor**
2. Run this query (replace UUID with your user's ID):
   ```sql
   SELECT * FROM journeys
   WHERE user_id = '00000000-0000-0000-0000-000000000000';
   ```
3. You should see your saved journey

Or use the **View Saved Journeys** feature in the app:

1. Click "Account" button (top right)
2. Click "View Saved Journeys"
3. Your journey should appear in the list

---

## Database Schema

The app uses two tables:

### `journeys` table

```sql
id (uuid)              -- Primary key
user_id (uuid)         -- Foreign key to auth.users
title (text)           -- Journey name
current_step (integer) -- Last completed step
is_completed (boolean) -- Journey status
created_at (timestamp) -- Created date
updated_at (timestamp) -- Last updated
```

### `journey_steps` table

```sql
id (uuid)              -- Primary key
journey_id (uuid)      -- Foreign key to journeys
step_number (integer)  -- Step index (0-9)
step_key (text)        -- Step identifier
prompt_text (text)     -- The question/prompt
user_response (text)   -- User's answer
created_at (timestamp)
updated_at (timestamp)
```

### Row Level Security (RLS)

- Users can only see their own journeys
- Users can only edit their own journeys
- Users can only delete their own journeys
- Public read/write is blocked

---

## Troubleshooting

### "Email is invalid"

- Make sure you use exactly: `testuser@mountainpathway.local`
- The `.local` domain is reserved for local testing

### "Invalid login credentials"

- Double-check password: `TestPassword123!`
- Ensure user is confirmed (green checkmark in dashboard)

### "No Save button appears"

- Refresh the page after logging in
- Check browser console for errors
- Verify user is authenticated in browser DevTools

### "Journey didn't save"

- Check network tab in DevTools for API errors
- Verify RLS policies are correctly set up
- Check Supabase logs for errors

### Script fails: "Missing environment variables"

- Both `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` must be set
- Check spelling (case-sensitive)

---

## Files Related to Auth & Save

- `src/lib/supabaseClient.ts` - Supabase client initialization
- `src/components/AuthModal.tsx` - Authentication UI
- `src/components/SaveJourneyModal.tsx` - Save journey dialog
- `src/lib/journeyApi.ts` - Journey CRUD operations
- `src/lib/store/useStore.ts` - App state management
- `supabase-two-table-setup.sql` - Database schema

---

## Next Steps

After verifying the save/load functionality works:

1. Test with real email (not `.local` domain)
2. Test across different browsers
3. Test journey deletion
4. Test journey editing/updating
5. Test cross-device access

---

**Documentation Updated:** November 16, 2025
