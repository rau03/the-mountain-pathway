# Testing Guide - The Mountain Pathway

## End-to-End Testing: Save/Load Journey Flow

This guide walks you through testing the complete journey save and load functionality.

### Prerequisites

- Development server running (`npm run dev`)
- Access to Supabase project credentials
- Node.js installed locally

### Step 1: Create a Verified Test User

The authentication system requires users to confirm their email before they can save journeys. To bypass this in development/testing, use the Admin API script.

#### Get Your Supabase Credentials

1. Go to your **Supabase Dashboard** → https://app.supabase.com
2. Select your project
3. Go to **Settings** → **API**
4. Copy the following:
   - **Project URL** (for `SUPABASE_URL`)
   - **Service Role Key** (for `SUPABASE_SERVICE_ROLE_KEY`) - ⚠️ **Keep this secret!**

⚠️ **Important:** The Service Role Key should only be used in secure server-side environments. Never commit it to version control.

#### Run the Script

```bash
SUPABASE_URL="https://your-project-url.supabase.co" \
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key" \
node scripts/create-test-user.js
```

The script will output:

```
✅ Test user created successfully!

📋 User Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Email:  testuser@mountainpathway.local
ID:     <user-uuid>
Status: Email Confirmed ✓
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔑 Login Credentials:
Username: testuser@mountainpathway.local
Password: TestPassword123!
```

### Step 2: Test the Journey Flow

1. **Open the App**

   - Navigate to `http://localhost:3000`
   - You should see the landing page without the legacy header ✓

2. **Start a Journey**

   - Click "Begin Your Pathway"
   - Complete all 9 steps (add some text to at least one step for testing)
   - Click Next after each step

3. **Reach the Summary Screen**

   - You should see "Journey Complete"
   - Your entered content should be displayed

4. **Log In to Save**

   - Click the "Log in to save" button in top-right
   - Auth Modal should open
   - Click on "Already have an account? Sign in"
   - Enter credentials:
     - Email: `testuser@mountainpathway.local`
     - Password: `TestPassword123!`

5. **Save the Journey**

   - After successful login, the modal should close
   - The "Log in to save" button should change to "Save journey"
   - Click "Save journey"
   - Enter a title for your journey (e.g., "Test Journey 1")
   - Click Save
   - You should see a success message or the button text should change to "Update journey"

6. **Verify in Database**

   - Go to Supabase Dashboard
   - Navigate to **SQL Editor**
   - Run this query:
     ```sql
     SELECT * FROM journeys WHERE user_id = '<user-uuid-from-script-output>';
     ```
   - You should see your saved journey

7. **Test Journey Load (Optional)**
   - On the Summary screen, click "Account" button
   - Click "View Saved Journeys"
   - Your saved journey should appear in the list
   - Click on it to load it

### Common Issues & Solutions

**Issue:** "Invalid login credentials" when signing in

- **Solution:** Make sure you're using the exact credentials from the script output

**Issue:** "Email address is invalid"

- **Solution:** Use the email format from the script: `testuser@mountainpathway.local`

**Issue:** Save Journey button doesn't appear after logging in

- **Solution:** Check that the session state updated correctly. Try refreshing the page.

**Issue:** Script fails with "Missing environment variables"

- **Solution:** Ensure both `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are set before running the script

### What Gets Tested

✅ Anonymous journey completion  
✅ Single-click navigation through all steps  
✅ Auth modal functionality  
✅ User account creation & login  
✅ Journey data persistence  
✅ Database row-level security (RLS)  
✅ Journey retrieval & display

### Cleanup (Optional)

To delete the test user after testing:

1. Go to Supabase Dashboard
2. Navigate to **Authentication** → **Users**
3. Find `testuser@mountainpathway.local`
4. Click the three-dot menu and delete

Or run a SQL query:

```sql
DELETE FROM auth.users WHERE email = 'testuser@mountainpathway.local';
```

---

**Last Updated:** November 16, 2025
