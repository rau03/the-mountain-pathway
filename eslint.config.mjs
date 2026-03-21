import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      // Generated iOS artifacts (never lint machine output)
      "ios/DerivedData/**",
      "ios/App/Pods/**",
      "ios/App/App.xcworkspace/**",
      "ios/App/App/public/**",
      "ios/App/build/**",
      "ios/App/App.xcodeproj/**/xcuserdata/**",
      "ios/App/App.xcodeproj/project.xcworkspace/xcuserdata/**",
      "ios/App/CapApp-SPM/.build/**",
      "ios/App/CapApp-SPM/.swiftpm/**",
      "scripts/**",
      "next-env.d.ts",
    ],
  },
];

export default eslintConfig;
