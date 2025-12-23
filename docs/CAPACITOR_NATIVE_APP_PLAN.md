# The Mountain Pathway: Native App Development Plan

**Status:** Backlog (Post-Launch)  
**Target:** iOS & Android native apps via Capacitor  
**Created:** December 23, 2025

---

## Overview

[Capacitor](https://capacitorjs.com/) is an open-source native runtime that wraps your existing web app into native iOS and Android apps. It allows you to ship to the App Stores while maintaining a single codebase.

### Why Capacitor?

| Advantage                      | Benefit for The Mountain Pathway                       |
| ------------------------------ | ------------------------------------------------------ |
| Use existing codebase          | Your Next.js/React app works as-is                     |
| Web + Mobile from one codebase | PWA + iOS + Android simultaneously                     |
| Native APIs                    | Access device features (notifications, haptics, audio) |
| App Store distribution         | Publish to Apple App Store & Google Play               |
| No new language needed         | Stay in TypeScript/React                               |

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                  YOUR CODEBASE                          │
│            (Next.js / React / TypeScript)               │
└─────────────────────────────────────────────────────────┘
                          │
          ┌───────────────┼───────────────┐
          ▼               ▼               ▼
    ┌──────────┐    ┌──────────┐    ┌──────────┐
    │   WEB    │    │   iOS    │    │ Android  │
    │  Vercel  │    │ App Store│    │ Play Store│
    └──────────┘    └──────────┘    └──────────┘
         │               │               │
         ▼               ▼               ▼
  themountain     iPhone/iPad      Android
  pathway.com        App           Phones
```

**Important:** Your web app (www.themountainpathway.com) stays exactly as it is. Capacitor creates additional native app builds from the same code.

---

## Development Workflow (Feature Branch)

### Step 1: Create Feature Branch

```bash
git checkout main
git pull origin main
git checkout -b feature/capacitor-native-app
```

### Step 2: Install Capacitor

```bash
npm install @capacitor/cli @capacitor/core
npx cap init "The Mountain Pathway" "com.themountainpathway.app"
```

### Step 3: Add Native Platforms

```bash
npm install @capacitor/ios @capacitor/android
npx cap add ios
npx cap add android
```

### Step 4: Update .gitignore

Add these to prevent large build files from being committed:

```
# Capacitor native builds
ios/App/Pods/
android/.gradle/
android/app/build/
```

### Step 5: Build and Sync

```bash
npm run build         # Build Next.js
npx cap sync          # Copy to native projects
```

### Step 6: Open in Native IDEs

```bash
npx cap open ios      # Opens Xcode
npx cap open android  # Opens Android Studio
```

### Step 7: Merge When Ready

```bash
git checkout main
git merge feature/capacitor-native-app
git push origin main
```

---

## Next.js Static Export Configuration

For Capacitor, you need to export your Next.js app as static HTML:

```javascript
// next.config.js
const nextConfig = {
  output: "export", // Generates static HTML for Capacitor
};
```

**Note:** This disables server-side features (API routes, SSR). Your app is mostly client-side already, so this should work well.

---

## Native Features to Add

| Feature             | Plugin                            | Use Case                               |
| ------------------- | --------------------------------- | -------------------------------------- |
| Local Notifications | `@capacitor/local-notifications`  | Timer completion alert                 |
| Haptics             | `@capacitor/haptics`              | Subtle vibration on step transitions   |
| Keep Awake          | `@capacitor-community/keep-awake` | Prevent screen sleep during meditation |
| Background Audio    | `@capacitor-community/audio`      | Ambient music in background            |
| Share               | `@capacitor/share`                | Share journey summary                  |
| Splash Screen       | `@capacitor/splash-screen`        | Custom branded launch screen           |

---

## Platform Detection Code

Detect which platform the app is running on:

```typescript
import { Capacitor } from "@capacitor/core";

// Check platform
const isNative = Capacitor.isNativePlatform();
const platform = Capacitor.getPlatform(); // 'ios', 'android', or 'web'

// Example: Only show "Rate this app" on mobile
{
  isNative && <RateAppButton />;
}

// Example: Only show PWA install prompt on web
{
  platform === "web" && <InstallPWABanner />;
}
```

---

## Development Requirements

| Platform    | Requirements                                                |
| ----------- | ----------------------------------------------------------- |
| **iOS**     | Mac with Xcode, Apple Developer Account ($99/year)          |
| **Android** | Android Studio (any OS), Google Play Console ($25 one-time) |

---

## Files Added to Repository

```
the-mountain-pathway/
├── ios/                    # Xcode project (NEW)
│   └── App/
├── android/                # Android Studio project (NEW)
│   └── app/
├── capacitor.config.ts     # Capacitor config (NEW)
├── src/                    # Your existing code (unchanged)
├── package.json            # + Capacitor deps
└── ...
```

---

## Deployment Workflow (After Setup)

```bash
# Deploy to web (Vercel) - unchanged
git push origin main  # Vercel auto-deploys

# Build for mobile (separate process)
npm run build         # Build Next.js
npx cap sync          # Copy to native projects
npx cap open ios      # Open Xcode, build & submit to App Store
npx cap open android  # Open Android Studio, build & submit to Play Store
```

---

## Timeline Suggestion

| Phase            | Duration     | Description                       |
| ---------------- | ------------ | --------------------------------- |
| Launch Web       | Now          | Ship www.themountainpathway.com   |
| Validate         | 1-2 weeks    | Gather user feedback, fix bugs    |
| Start Capacitor  | After stable | Create feature branch, install    |
| Build & Test     | 2-4 weeks    | iOS/Android development & testing |
| Submit to Stores | 1-2 weeks    | App review process                |

---

## Resources

- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Capacitor Plugins](https://capacitorjs.com/docs/plugins)
- [Capacitor with Next.js Guide](https://capacitorjs.com/docs/getting-started)
- [Apple Developer Program](https://developer.apple.com/programs/)
- [Google Play Console](https://play.google.com/console/)

---

## Notes

- Your web app (Vercel) and native apps (App Stores) are completely independent deployments
- Web updates are instant; mobile updates go through app store review (1-7 days)
- Consider adding "Update Available" prompts in native apps to encourage updates
