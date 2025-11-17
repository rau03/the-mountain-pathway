# Create Test User - Two Methods

## Method 1: Using the Node.js Script (Recommended)

```bash
# Set your Supabase credentials
export SUPABASE_URL="https://your-project.supabase.co"
export SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Run the script
node scripts/create-test-user.js
```

**Pros:**

- Easy one-command execution
- Clear output with all credentials
- Can be run from anywhere in the project

**Cons:**

- Need to manage environment variables

---

## Method 2: Using Supabase Dashboard (Manual)

### Step 1: Go to Supabase Dashboard

1. Navigate to https://app.supabase.com
2. Select your project
3. Click **Authentication** → **Users** in the left sidebar

### Step 2: Create User Manually

1. Click **"Create a new user"** button
2. Fill in the form:
   - **Email:** `testuser@mountainpathway.local`
   - **Password:** `TestPassword123!`
   - **Confirm password:** `TestPassword123!`
3. **Important:** Check the box **"Auto confirm user"** to skip email verification
4. Click **"Create user"**

### Step 3: Verify Creation

You should see the new user in the users list with a green checkmark indicating confirmed email.

**Pros:**

- No script needed
- Visual confirmation
- Easy to manage multiple test users

**Cons:**

- Manual process
- More steps

---

## Method 3: Using Supabase CLI

If you have the Supabase CLI installed:

```bash
# Install CLI (if not already installed)
npm install -g supabase

# Login to your account
supabase login

# Create a user using the CLI
supabase auth create-user --email testuser@mountainpathway.local --password TestPassword123!
```

**Pros:**

- Direct CLI control
- Can be scripted in CI/CD pipelines

**Cons:**

- Requires CLI installation
- May require additional setup

---

## Choosing Your Method

| Method         | Ease   | Speed  | Recommended For                      |
| -------------- | ------ | ------ | ------------------------------------ |
| Node.js Script | Easy   | Fast   | Developers, CI/CD                    |
| Dashboard      | Medium | Medium | One-off testing, visual confirmation |
| Supabase CLI   | Medium | Fast   | CLI enthusiasts, automation          |

**For this project, we recommend Method 1 (Node.js Script)** for consistent, repeatable test user creation.

---

## After Creating the Test User

1. Note down the email: `testuser@mountainpathway.local`
2. Note down the password: `TestPassword123!`
3. Open http://localhost:3000 (make sure dev server is running)
4. Follow the testing steps in `TESTING.md`

---
