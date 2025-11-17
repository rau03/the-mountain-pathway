#!/usr/bin/env node

/**
 * Create a Verified Test User in Supabase
 *
 * This script uses the Supabase Admin API to create a verified test user
 * without requiring email confirmation.
 *
 * Usage:
 * SUPABASE_URL=your_url SUPABASE_SERVICE_ROLE_KEY=your_key node scripts/create-test-user.js
 */

const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error("❌ Error: Missing environment variables");
  console.error("Please set:");
  console.error("  - SUPABASE_URL");
  console.error("  - SUPABASE_SERVICE_ROLE_KEY");
  console.error("\nUsage:");
  console.error(
    "  SUPABASE_URL=your_url SUPABASE_SERVICE_ROLE_KEY=your_key node scripts/create-test-user.js"
  );
  process.exit(1);
}

async function createTestUser() {
  console.log("🔐 Initializing Supabase Admin Client...");

  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

  try {
    console.log("👤 Creating verified test user...");

    const { data, error } = await supabase.auth.admin.createUser({
      email: "testuser@mountainpathway.local",
      password: "TestPassword123!",
      email_confirm: true, // Auto-confirm the email
      user_metadata: {
        role: "test_user",
        created_via: "create-test-user script",
      },
    });

    if (error) {
      console.error("❌ Error creating user:", error.message);
      process.exit(1);
    }

    console.log("\n✅ Test user created successfully!\n");
    console.log("📋 User Details:");
    console.log("━".repeat(50));
    console.log(`Email:  ${data.user.email}`);
    console.log(`ID:     ${data.user.id}`);
    console.log(`Status: Email Confirmed ✓`);
    console.log("━".repeat(50));
    console.log("\n🔑 Login Credentials:");
    console.log(`Username: testuser@mountainpathway.local`);
    console.log(`Password: TestPassword123!`);
    console.log(
      "\n✨ You can now use these credentials to test the save/load flow!"
    );
    console.log("\n📝 Next Steps:");
    console.log("1. Start the dev server: npm run dev");
    console.log("2. Go to http://localhost:3000");
    console.log("3. Complete a journey");
    console.log('4. Click "Log in to save"');
    console.log("5. Sign in with the credentials above");
    console.log('6. Click "Save Journey" button on summary screen');
    console.log("7. Verify journey is saved in Supabase");
  } catch (error) {
    console.error("❌ Unexpected error:", error);
    process.exit(1);
  }
}

createTestUser();
