#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const projectRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");

const targetPaths = [
  path.join(projectRoot, "src"),
  path.join(projectRoot, "scripts", "build-capacitor.sh"),
  path.join(projectRoot, "capacitor.config.ts"),
];

const riskPatterns = [
  { label: "localhost/dev host", regex: /\blocalhost\b|127\.0\.0\.1|\.local\b/i },
  { label: "known test email", regex: /testuser@mountainpathway\.local/i },
  { label: "known test password", regex: /TestPassword123!/ },
];

const includeExtensions = new Set([".ts", ".tsx", ".js", ".mjs", ".json", ".sh"]);

function shouldSkipFile(filePath) {
  const normalized = filePath.replaceAll(path.sep, "/");
  if (
    normalized.endsWith(".test.ts") ||
    normalized.endsWith(".test.tsx") ||
    normalized.endsWith(".spec.ts") ||
    normalized.endsWith(".spec.tsx")
  ) {
    return true;
  }
  return false;
}

function collectFiles(entryPath) {
  if (!fs.existsSync(entryPath)) return [];
  const stat = fs.statSync(entryPath);
  if (stat.isFile()) return [entryPath];

  const files = [];
  for (const name of fs.readdirSync(entryPath)) {
    const fullPath = path.join(entryPath, name);
    const fullStat = fs.statSync(fullPath);
    if (fullStat.isDirectory()) {
      files.push(...collectFiles(fullPath));
      continue;
    }
    if (!includeExtensions.has(path.extname(fullPath))) continue;
    if (shouldSkipFile(fullPath)) continue;
    files.push(fullPath);
  }
  return files;
}

const filesToScan = targetPaths.flatMap(collectFiles);
const findings = [];

for (const filePath of filesToScan) {
  const content = fs.readFileSync(filePath, "utf8");
  const lines = content.split(/\r?\n/);
  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (
      trimmed.startsWith("#") ||
      trimmed.startsWith("//") ||
      trimmed.startsWith("/*") ||
      trimmed.startsWith("*")
    ) {
      return;
    }
    for (const pattern of riskPatterns) {
      if (pattern.regex.test(line)) {
        findings.push({
          file: path.relative(projectRoot, filePath),
          line: index + 1,
          label: pattern.label,
          text: line.trim(),
        });
      }
    }
  });
}

if (findings.length > 0) {
  console.error("❌ Release safety scan failed. Potential release blockers found:");
  for (const finding of findings) {
    console.error(`- ${finding.file}:${finding.line} [${finding.label}] ${finding.text}`);
  }
  process.exit(1);
}

console.log("✅ Release safety scan passed.");
