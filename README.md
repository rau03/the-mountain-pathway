# The Mountain Pathway

> *Climb inward. Look upward.*

**The Mountain Pathway** is a faith-centered journaling and discipleship iOS and web app that guides users through a structured 9-step reflective experience designed to deepen their walk with God.

Feeling spiritually stuck or overwhelmed? Step onto a clearer path with God through The Mountain Pathway. In a world full of noise, this is a sacred space for guided reflection, honest prayer, and Spirit-led clarity. Whether you are navigating fear, frustration, uncertainty, or simply longing for deeper intimacy with God, The Mountain Pathway helps you process what you are carrying and place it in His hands.

This is more than writing in a journal. It is a pathway for discipleship — one step at a time.

---

## Live App

| Platform | Link |
|----------|------|
| iOS App Store | [Download on the App Store](https://apps.apple.com/app/the-mountain-pathway/id6759012874) |
| Web App | [themountainpathway.com](https://themountainpathway.com) |

---

## Developer

**Chris Rau** — Solo developer, end-to-end ownership
[webdevbyrau.com](https://www.webdevbyrau.com) · [github.com/rau03](https://github.com/rau03)

---

## What You Can Do With Mountain Pathway

- Reflect on your current season with intentional, guided questions
- Practice journaling that helps you hear God more clearly
- Move through discipleship-focused steps that build trust, surrender, and obedience
- Develop a consistent rhythm of prayer and spiritual reflection
- Save your journey and return to it as God continues your story
- Contact the team directly through the in-app contact form

---

## The 9-Step Journey

| Step | Name | Focus |
|------|------|-------|
| 1 | Trailhead — Center Your Heart | A moment of stillness and silence |
| 2 | Ascent — Ground Yourself in Scripture | Listening to His Word |
| 3 | Ascent — Name the Issue | Define your focus |
| 4 | Overlook — Unpack Your Thoughts | Truths and misperceptions |
| 5 | Overlook — Acknowledge Your Feelings | From head to heart |
| 6 | Summit Path — Articulate Your Hope | Uncover the deep longing |
| 7 | Summit Path — Pause and Invite | Welcome Jesus |
| 8 | Summit Path — Discern the Next Step | Choose your path forward |
| 9 | Summit — Commit in Prayer | Offer it all to Him |

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | TailwindCSS |
| UI | React, Framer Motion |
| Database | Supabase (PostgreSQL + RLS) |
| Auth | Supabase Auth |
| State | Zustand (with persist, version 4) |
| Native iOS | Capacitor iOS |
| Email | Resend |
| PDF Generation | jsPDF |
| Testing | Vitest (56 tests, 16 test files) |

---

## Project Structure

```
src/
├── app/                        # Next.js App Router pages and API routes
│   └── api/
│       ├── auth/               # Account deletion route
│       └── contact/            # Contact form email route (Resend)
├── components/                 # React components
│   ├── HomeClient.tsx          # Desktop full-bleed layout with crossfade
│   ├── MobileJourneyLayout.tsx # Mobile layout with background crossfade
│   ├── MobileSaveFooter.tsx    # Mobile journey footer
│   ├── DesktopSaveFooter.tsx   # Desktop journey footer
│   ├── HeaderDesktop.tsx       # Desktop header
│   ├── TimerScreen.tsx         # Step 1 — silence timer with chime
│   ├── InputScreen.tsx         # Steps 2–9 — text input
│   ├── ReflectionScreen.tsx    # Reflection steps
│   ├── SummaryScreen.tsx       # Step 9 summary, PDF, Journey Complete
│   ├── LandingPage.tsx         # Landing page
│   ├── ContactFormModal.tsx    # In-app contact form modal
│   ├── OfflineBanner.tsx       # Global offline detection banner
│   └── SavedJourneysView.tsx   # Saved journeys modal
├── hooks/
│   ├── useJourneyBackground.ts # Per-step background image + alignment
│   ├── useHomeSessionSync.ts   # Auth session sync
│   ├── useOnlineStatus.ts      # Online/offline detection
│   └── useReconnectEffect.ts   # Auto-reconnect callback hook
├── lib/
│   ├── journeyApi.ts           # Supabase journey API calls (timeout-wrapped)
│   ├── pathway-data.ts         # 9-step content + image alignment data
│   ├── withTimeout.ts          # Promise.race timeout utility
│   └── capacitorUtils.ts       # isNativeApp, openExternalUrl, openEmail
└── store/
    └── useStore.ts             # Zustand store with persist (version 4)

ios/
└── App/
    ├── Podfile                 # CocoaPods — core Capacitor + Filesystem
    └── CapApp-SPM/
        └── Package.swift       # Swift Package Manager plugin registration

public/
├── singlechime.wav             # Timer completion chime audio
└── audio/                      # Background ambient audio tracks
```

---

## Key Architecture Decisions

**Capacitor WebView**
Capacitor wraps the Next.js web app in a native iOS WebView. One source code change covers both web and iOS automatically. No separate native codebase.

**Zustand Persist — Auth-Aware (v4)**
The Zustand store's `partialize()` function is auth-aware. Guest (unauthenticated) users only persist audio preferences — never journal entry data. Authenticated users get full persistence. A v3→v4 migration automatically clears any previously leaked guest data on next app open.

**Full-Bleed Background System**
Desktop web uses a two-layer CSS crossfade (800ms) that mirrors the mobile `MobileJourneyLayout` pattern. Each step has a `desktopAlignment` field in `pathway-data.ts` for precise per-step image focal point positioning. Mobile uses a separate `mobileAlignment` field.

**PDF Share (iOS)**
PDFs are written to `Directory.Cache` via `@capacitor/filesystem`, then shared via `Share.share({ files: [uri] })`. This produces a proper file attachment rather than dumping base64 into an email body.

**Supabase Request Timeouts**
All Supabase API calls are wrapped with `withTimeout()` (15s default via `Promise.race`). Calls fail gracefully with a clear error message instead of hanging indefinitely on slow or lost connections.

**Offline Detection**
A global `OfflineBanner` component mounted in the root layout detects connectivity via `navigator.onLine` and window `online`/`offline` events. Shows an amber banner when offline, a green confirmation on reconnect. The `useReconnectEffect` hook automatically refreshes stale data when the connection restores.

**In-App Contact Form**
A modal contact form (matching app styling exactly) sends messages via Resend to `hello@themountainpathway.com`. Works on web and iOS WebView. Available from the landing page and the Journey Complete screen.

**Timer Completion Chime**
A gentle meditation chime (`singlechime.wav`) plays when the Step 1 silence timer reaches zero. The Audio element is primed during the "Begin Silence" tap to satisfy iOS audio unlock requirements. Plays independently of the background music toggle.

**Auto-Save**
Auto-save fires on every step advance via `handleNextStep`. There are no manual save buttons mid-journey. The only explicit save is the journey title flow at the Summary screen (Step 9) via `SaveJourneyModal`.

---

## Local Development

### Prerequisites

- Node.js 18+
- npm
- Xcode (for iOS builds)
- CocoaPods (`gem install cocoapods`)

### Setup

```bash
# Clone the repo
git clone https://github.com/rau03/the-mountain-pathway.git
cd the-mountain-pathway

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
# Fill in your values (see Environment Variables below)

# Start development server
npm run dev
```

### Environment Variables

Create a `.env.local` file with the following:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_IS_IOS_BUILD=false
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
RESEND_API_KEY=your_resend_api_key
```

---

## iOS Build Workflow

```bash
# 1. Build static export for Capacitor
npm run build:capacitor

# 2. Sync web assets to iOS
npx cap sync ios

# 3. Install CocoaPods (required after adding new native plugins)
cd ios/App && LANG=en_US.UTF-8 pod install

# 4. Sync version numbers between package.json and Xcode
npm run sync:ios-version

# 5. Open in Xcode
open ios/App/App.xcworkspace
```

In Xcode: **Product → Archive → Distribute → App Store Connect → Submit for Review**

> **Important:** Use `npm run build:capacitor` (not `npm run build`) for all Capacitor builds. After adding any new Capacitor native plugin, always run `pod install` in `ios/App` in addition to `cap sync ios`.

---

## Testing

```bash
# Run full test suite (56 tests across 16 test files)
npx vitest run

# Watch mode
npx vitest
```

All 56 tests must pass before any PR is merged.

---

## Version History

| Version | Date | Notes |
|---------|------|-------|
| 1.0.0 | April 5, 2026 | Initial App Store launch — Easter Sunday |
| 1.0.1 | April 11, 2026 | Footer safe area fix, category → Lifestyle + Reference |
| 1.0.2 | April 12, 2026 | Deleted journeys race condition fix, redundant save buttons removed |
| 1.0.3 | April 18, 2026 | Guest entry persistence privacy fix, PDF email attachment fix |
| 1.0.4 | June 2026 | Hydration fix, in-app contact form, offline banner, Supabase timeouts, auto-reconnect, timer chime |

---

## Development Workflow

This project uses a structured Cursor-assisted development workflow:

1. **Investigate first** — understand the problem before touching code
2. **Report back** — findings with file names and line numbers
3. **Approve before acting** — no code changes without explicit approval
4. **One fix per branch** — never combine multiple fixes
5. **Tests must pass** — all 56 tests green before any commit
6. **Verify on device** — Vercel preview and iPhone testing before merging to main

---

## Contact

Built with faith and care by [Chris Rau](https://www.webdevbyrau.com)
hello@themountainpathway.com
