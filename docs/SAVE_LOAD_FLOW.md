# Journey Save/Load Flow - Technical Diagram

## User Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    THE MOUNTAIN PATHWAY - USER JOURNEY                  │
└─────────────────────────────────────────────────────────────────────────┘

                              START
                                │
                                ▼
                        ┌───────────────┐
                        │ Landing Page  │
                        │  (No Login)   │
                        └───────────────┘
                                │
                                ▼
                        ┌───────────────┐
                        │ Click "Begin" │
                        └───────────────┘
                                │
                                ▼
                    ┌─────────────────────────┐
                    │ 9 Journey Steps         │
                    │ (User adds responses)   │
                    └─────────────────────────┘
                                │
                                ▼
                        ┌───────────────────┐
                        │ Summary Screen    │
                        │ (Journey Complete)│
                        └───────────────────┘
                                │
                    ┌───────────┴───────────┐
                    │                       │
                    ▼                       ▼
            ┌───────────────┐      ┌─────────────────┐
            │ Download PDF  │      │ "Log in to save"│
            └───────────────┘      └─────────────────┘
                    ▲                       │
                    │                       ▼
                    │              ┌──────────────────┐
                    │              │ Auth Modal Opens │
                    │              └──────────────────┘
                    │                       │
                    │       ┌───────────────┴───────────────┐
                    │       │                               │
                    │       ▼                               ▼
                    │  ┌──────────┐              ┌────────────────┐
                    │  │ Google   │              │ Email/Password │
                    │  │ OAuth    │              │ Sign In/Sign Up│
                    │  └──────────┘              └────────────────┘
                    │       │                       │    │
                    └───────┼───────────────────────┤    │
                            │ User authenticated   │    │
                            │                      ▼    ▼
                            │              ┌──────────────────┐
                            │              │  User Confirmed  │
                            │              │  (Email + Auth)  │
                            │              └──────────────────┘
                            │                      │
                            │                      ▼
                            │              ┌──────────────────┐
                            │              │ "Save journey"   │
                            │              │ button appears   │
                            │              └──────────────────┘
                            │                      │
                            │                      ▼
                            │          ┌─────────────────────┐
                            │          │ SaveJourneyModal    │
                            │          │ (Enter title)       │
                            │          └─────────────────────┘
                            │                      │
                            │                      ▼
                            │          ┌─────────────────────┐
                            │          │ Save to Database    │
                            │          │ (journeys table)    │
                            │          └─────────────────────┘
                            │                      │
                            └──────────────────────┘
                                       │
                                       ▼
                                 ✅ SUCCESS!
```

---

## Data Flow: Save Journey

```
┌──────────────────────────────────────────────────────────────────┐
│                     SAVE JOURNEY FLOW                             │
└──────────────────────────────────────────────────────────────────┘

Frontend (React/Zustand)          Backend (Supabase)
───────────────────────────────────────────────────────────────────

User Response Data
├─ Title
├─ Step 1-9 responses
├─ Completion status
└─ Timestamps
         │
         ▼
┌─────────────────────┐
│ SaveJourneyModal    │
│ onSave clicked      │
└─────────────────────┘
         │
         ▼
┌─────────────────────┐
│ journeyApi.ts       │
│ saveJourney()       │
└─────────────────────┘
         │
         ├─ Insert into "journeys" table ──────┐
         │                                      │
         └─ Insert into "journey_steps" ──┐   │
                                           │   │
                                          ▼   ▼
                                    ┌──────────────────┐
                                    │ PostgreSQL DB    │
                                    │ (Supabase)       │
                                    └──────────────────┘
                                           │
                                    ┌──────────────────┐
                                    │ RLS Policies     │
                                    │ Check: user_id   │
                                    │ matches auth.id  │
                                    └──────────────────┘
                                           │
                                           ▼
                                    ┌──────────────────┐
                                    │ Data Persisted ✓ │
                                    └──────────────────┘
         │
         ◄──────────────────────────────────
         │
         ▼
┌─────────────────────┐
│ Store: markSaved()  │
│ Update local state  │
└─────────────────────┘
         │
         ▼
┌─────────────────────┐
│ UI updates:         │
│ "Update journey"    │
└─────────────────────┘
```

---

## Data Flow: Load Journey

```
┌──────────────────────────────────────────────────────────────────┐
│                     LOAD JOURNEY FLOW                             │
└──────────────────────────────────────────────────────────────────┘

Frontend                           Backend
────────────────────────────────────────────────────────────────────

User clicks:
"View Saved Journeys"
         │
         ▼
┌─────────────────────┐
│ SavedJourneysView   │
│ Component Opens     │
└─────────────────────┘
         │
         ▼
┌─────────────────────┐
│ journeyApi.ts       │
│ fetchUserJourneys() │
└─────────────────────┘
         │
         ├─ Query "journeys" table ────────┐
         │ WHERE user_id = current_user    │
         │                                 │
         └─ Query "journey_steps" ─────┐  │
            WHERE journey_id = id       │  │
                                       │  │
                                      ▼  ▼
                            ┌──────────────────┐
                            │ PostgreSQL DB    │
                            │ (Supabase)       │
                            └──────────────────┘
                                   │
                            ┌──────────────────┐
                            │ RLS Policies     │
                            │ Check: user_id   │
                            │ matches auth.id  │
                            └──────────────────┘
                                   │
                                   ▼
                            ┌──────────────────┐
                            │ Data Retrieved ✓ │
                            └──────────────────┘
         │
         ◄──────────────────────────────────
         │
         ▼
┌──────────────────────────┐
│ Parse & Format Data      │
│ ├─ Journey metadata      │
│ └─ All step responses    │
└──────────────────────────┘
         │
         ▼
┌──────────────────────────┐
│ Update Zustand Store:    │
│ ├─ currentEntry          │
│ ├─ currentStep           │
│ ├─ entries               │
│ └─ isSaved / savedId     │
└──────────────────────────┘
         │
         ▼
┌──────────────────────────┐
│ Re-render UI             │
│ Show loaded journey      │
│ Allow resume/edit        │
└──────────────────────────┘
```

---

## Database Schema

```
┌──────────────────────────────────────────────────────────────┐
│                    JOURNEYS TABLE                            │
├──────────────────────────────────────────────────────────────┤
│ Column          │ Type      │ Notes                          │
├─────────────────┼───────────┼────────────────────────────────┤
│ id              │ uuid      │ Primary Key                    │
│ user_id         │ uuid      │ FK → auth.users(id)            │
│ title           │ text      │ User-defined journey name      │
│ current_step    │ integer   │ Last completed step (0-9)      │
│ is_completed    │ boolean   │ Journey completion status      │
│ created_at      │ timestamp │ Auto-populated                 │
│ updated_at      │ timestamp │ Auto-updated on change         │
└──────────────────────────────────────────────────────────────┘

                              ↓ (one-to-many)

┌──────────────────────────────────────────────────────────────┐
│                  JOURNEY_STEPS TABLE                         │
├──────────────────────────────────────────────────────────────┤
│ Column          │ Type      │ Notes                          │
├─────────────────┼───────────┼────────────────────────────────┤
│ id              │ uuid      │ Primary Key                    │
│ journey_id      │ uuid      │ FK → journeys(id)              │
│ step_number     │ integer   │ 0-8 (9 steps total)            │
│ step_key        │ text      │ 'name_the_issue', etc.         │
│ prompt_text     │ text      │ The question/prompt shown      │
│ user_response   │ text      │ User's answer/reflection       │
│ created_at      │ timestamp │ Auto-populated                 │
│ updated_at      │ timestamp │ Auto-updated on change         │
└──────────────────────────────────────────────────────────────┘
```

---

## Authentication States

```
┌─────────────────────────────────────────────────────────────┐
│            USER AUTHENTICATION STATE MACHINE                 │
└─────────────────────────────────────────────────────────────┘

                          NOT LOGGED IN
                                │
                ┌───────────────┼───────────────┐
                │               │               │
                ▼               ▼               ▼
         ┌───────────┐   ┌────────────┐  ┌──────────────┐
         │ Sign In   │   │ Sign Up    │  │ Google Auth  │
         └───────────┘   └────────────┘  └──────────────┘
                │               │               │
                └───────────────┼───────────────┘
                                │
                                ▼
                      ┌──────────────────┐
                      │ Email Confirm?   │
                      └──────────────────┘
                         │         │
                   YES ◄─┘         └─► NO
                   │                   │
                   ▼                   ▼
              LOGGED IN            PENDING
              (Sessions)         (Awaiting
              (Can save)         Email Link)
```

---

## Row-Level Security (RLS) Policy

```
┌─────────────────────────────────────────────────────────────┐
│              RLS POLICY: journeys TABLE                      │
└─────────────────────────────────────────────────────────────┘

FOR SELECT:
  WHERE user_id = auth.uid()
  Purpose: Users can only read their own journeys

FOR INSERT:
  WITH CHECK (user_id = auth.uid())
  Purpose: Users can only insert their own journeys

FOR UPDATE:
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid())
  Purpose: Users can only update their own journeys

FOR DELETE:
  USING (user_id = auth.uid())
  Purpose: Users can only delete their own journeys

Result: ✅ Complete data isolation per user
        ✅ No cross-user data access possible
        ✅ Enforced at database level (not code)
```

---

## Component Hierarchy

```
PageWrapper
  ├─ HomeClient
  │  ├─ AuthButton
  │  │  └─ AuthModal
  │  │     └─ Auth (Supabase UI)
  │  ├─ SimpleAudioPlayer
  │  ├─ LandingPage
  │  ├─ JourneyScreen
  │  │  ├─ InputScreen
  │  │  ├─ TimerScreen
  │  │  └─ ReflectionScreen
  │  ├─ SummaryScreen
  │  │  ├─ SaveJourneyModal
  │  │  └─ SavedJourneysView
  │  │     └─ Journey List Display
  │  ├─ HeaderDesktop
  │  └─ FooterDesktop
```

---

**Created:** November 16, 2025  
**For:** The Mountain Pathway - Save/Load Feature Testing
