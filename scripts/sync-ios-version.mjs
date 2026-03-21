import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

const pbxprojPath = path.join(projectRoot, "ios", "App", "App.xcodeproj", "project.pbxproj");
const packageJsonPath = path.join(projectRoot, "package.json");

const pbxproj = await readFile(pbxprojPath, "utf8");

const marketingMatch = pbxproj.match(/MARKETING_VERSION = ([^;]+);/);
const buildMatch = pbxproj.match(/CURRENT_PROJECT_VERSION = ([^;]+);/);

if (!marketingMatch) {
  throw new Error("Could not find MARKETING_VERSION in iOS project.");
}

if (!buildMatch) {
  throw new Error("Could not find CURRENT_PROJECT_VERSION in iOS project.");
}

const marketingVersion = marketingMatch[1].trim();
const buildNumber = buildMatch[1].trim();

const packageJsonRaw = await readFile(packageJsonPath, "utf8");
const packageJson = JSON.parse(packageJsonRaw);
const previousVersion = packageJson.version;

packageJson.version = marketingVersion;

await writeFile(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`, "utf8");

console.log(`iOS MARKETING_VERSION: ${marketingVersion}`);
console.log(`iOS CURRENT_PROJECT_VERSION: ${buildNumber}`);

if (previousVersion !== marketingVersion) {
  console.log(`Updated package.json version: ${previousVersion} -> ${marketingVersion}`);
} else {
  console.log(`package.json version already in sync: ${marketingVersion}`);
}
