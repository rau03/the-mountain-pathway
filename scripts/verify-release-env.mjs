#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const projectRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const envLocalPath = path.join(projectRoot, ".env.local");

function parseEnvFile(content) {
  const parsed = {};
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const eqIndex = line.indexOf("=");
    if (eqIndex <= 0) continue;
    const key = line.slice(0, eqIndex).trim();
    let value = line.slice(eqIndex + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    parsed[key] = value;
  }
  return parsed;
}

function hasDevLikeValue(value) {
  return /localhost|127\.0\.0\.1|\.local/i.test(value);
}

const envFromFile = fs.existsSync(envLocalPath)
  ? parseEnvFile(fs.readFileSync(envLocalPath, "utf8"))
  : {};
const mergedEnv = { ...envFromFile, ...process.env };

const requiredKeys = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "NEXT_PUBLIC_SITE_URL",
];

const missing = requiredKeys.filter((key) => !mergedEnv[key] || !String(mergedEnv[key]).trim());
if (missing.length > 0) {
  console.error("❌ Release env check failed: missing required variables:");
  for (const key of missing) console.error(`  - ${key}`);
  process.exit(1);
}

const siteUrl = String(mergedEnv.NEXT_PUBLIC_SITE_URL).trim();
const allowedSiteUrls = new Set([
  "https://themountainpathway.com",
  "https://www.themountainpathway.com",
]);

if (hasDevLikeValue(siteUrl)) {
  console.error("❌ Release env check failed: NEXT_PUBLIC_SITE_URL is not production-safe.");
  console.error(`   Current value: ${siteUrl}`);
  process.exit(1);
}

if (!allowedSiteUrls.has(siteUrl)) {
  console.error("❌ Release env check failed: NEXT_PUBLIC_SITE_URL is not an approved production URL.");
  console.error(`   Current value: ${siteUrl}`);
  console.error("   Allowed: https://themountainpathway.com or https://www.themountainpathway.com");
  process.exit(1);
}

for (const key of requiredKeys) {
  const value = String(mergedEnv[key]).trim();
  if (hasDevLikeValue(value)) {
    console.error(`❌ Release env check failed: ${key} contains a development/local value.`);
    process.exit(1);
  }
}

console.log("✅ Release env check passed.");
