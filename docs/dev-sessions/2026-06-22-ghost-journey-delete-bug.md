# Dev Session Log — Ghost Journey Delete Bug

- **Date:** 2026-06-22
- **Branch:** `fix/ghost-journey-delete` (from `main`)
- **PR:** [#31](https://github.com/rau03/the-mountain-pathway/pull/31) — merged to `main` via `a2a732c`
- **Commit:** `0a61557` — *fix: deleted journeys reappearing + multi-tap delete bug*
- **Files changed:** `src/lib/journeyApi.ts`, `src/components/SavedJourneysView.tsx` (2 files, +21 / −9)
- **Status:** Shipped — verified on Vercel preview + native iOS app, merged, branch deleted

---

## 1. Problem Statement

Two related, intermittent symptoms reported against `SavedJourneysView`:

1. **Ghost journeys** — deleted journeys reappear later (after closing/reopening
   the app, or after some time passes). User is signed in when it happens.
2. **Multi-tap delete** — sometimes a journey needs multiple delete taps before
   it goes away.

A prior fix (`42785f7`, *"resolve deleted journeys reappearing in
SavedJourneysView"*) had partially addressed the issue but the symptoms persisted.

---

## 2. Investigation Summary

Investigation was conducted read-only before any code changes.

### Key code paths reviewed
- `deleteJourney` in `src/lib/journeyApi.ts` — `DELETE ... .eq(id).eq(user_id).select("id")`,
  wrapped in `withTimeout(15000)`, preceded by `auth.getUser()`.
- `handleDelete` / `loadJourneys` in `src/components/SavedJourneysView.tsx` —
  optimistic local removal, `loadRequestIdRef` guard.
- `useReconnectEffect` (`src/hooks/useReconnectEffect.ts`) — fires `loadJourneys`
  on every offline→online transition.
- `useOnlineStatus`, `withTimeout`, the Supabase schema/RLS
  (`supabase/migrations/001_initial_schema.sql`).

### Findings
- **CASCADE / orphaned steps were a red herring.** `journey_steps.journey_id`
  has `ON DELETE CASCADE`, and `fetchUserJourneys` only selects from `journeys`
  (never joins steps). Orphans cannot resurrect a journey row.
- **RLS is correctly scoped** (`FOR ALL USING (auth.uid() = user_id)`), and
  `deleteJourney` already checked the Supabase `error` object. Not a silent-RLS
  failure.
- **The prior fix's `loadRequestIdRef` guard had a hole:** it only invalidated
  loads that were *in flight before* the delete. A reconnect-triggered load that
  *starts after* the optimistic removal gets a fresh, valid request id and
  overwrites state with whatever the server returns.
- **`deleteJourney` threw on `data.length === 0`.** On a retry after a
  slow/timed-out first attempt (the row already gone), this produced an error on
  an action that had effectively succeeded — the multi-tap symptom.
- **`withTimeout` does not abort the underlying request**, so a "timed out"
  delete could still commit server-side, desyncing the UI from the DB.

### Root cause
A single root cause with two faces: **optimistic delete with no server-side
reconciliation**, combined with (a) a non-idempotent delete that errored on
already-deleted rows, and (b) un-gated reconnect reloads that could re-fetch and
re-display a just-deleted journey.

---

## 3. Fixes Implemented

### Fix 1 — Idempotent delete (`src/lib/journeyApi.ts`)
Removed the `throw` on empty `data`. An empty result now means the journey is
already gone (prior attempt or never existed), which is the desired end state, so
it is treated as success. The genuine Supabase `error` check is retained, and the
unused `data` destructure was dropped to keep it lint-clean. The `auth.getUser()`
call was intentionally left unchanged (a separate "Fix 4" was deferred).

### Fix 2 — Recently-deleted ID grace window (`src/components/SavedJourneysView.tsx`)
- Added `recentlyDeletedIdsRef = useRef<Set<string>>(new Set())` alongside
  `loadRequestIdRef`.
- In `handleDelete`, after a successful delete: add the id to the set before the
  optimistic state update, then release it after a 5-second `setTimeout`.
- In `loadJourneys`, filter out any recently-deleted ids from the fetched result
  before `setJourneys`. This guarantees a reconnect-triggered reload racing a
  delete cannot resurrect a ghost journey within the grace window.

### Fix 3 — Stale error state (verification only)
No code change. Because Fix 1 makes the delete idempotent, `handleDelete`'s catch
block now only fires on genuine errors (network, real Supabase error, RLS denial).
Confirmed correct as-is.

---

## 4. Testing

- `npx vitest run` — **58/58 tests passing**, 16 files (run before commit, and
  again as a final pre-commit check).
- No existing tests asserted the old throw-on-empty-data behavior, so no test
  updates were required.
- No new lint errors in either changed file.

### Manual verification (Vercel preview + native iOS)
- Deleted a journey — disappeared immediately, no error, single tap.
- Delete + airplane-mode toggle (reconnect reload) — journey did **not** reappear.
- Delete + logout/login on web — stayed deleted.
- Confirmed gone in the native iOS app (shared Supabase backend).

---

## 5. Git / Delivery Timeline

1. Branched `fix/ghost-journey-delete` from `main`.
2. Implemented Fix 1, then Fix 2; verified lints and tests.
3. Committed `0a61557` (2 files, +21 / −9).
4. Pushed branch; opened PR #31 against `main`.
5. Verified on Vercel preview
   (`the-mountain-pathway-git-fix-ghost-journey-delete-webdevbyrau.vercel.app`)
   and native iOS.
6. Merged PR #31 (`--merge --delete-branch`) → `main` at `a2a732c`.
7. Updated local `main`; confirmed remote + local fix branch deleted.

---

## 6. Follow-ups / Deferred

- **Fix 4 (deferred):** decouple `deleteJourney` from a fresh `auth.getUser()`
  network round-trip (use the cached session) so a slow/refreshing token doesn't
  eat the 15s timeout.
- **Optional hardening:** consider server-confirmed reconciliation (re-fetch and
  diff) rather than purely optimistic removal if ghost reports recur.
- **Schema sanity check:** confirm the deployed Supabase schema actually carries
  the `ON DELETE CASCADE` from the migration (defensive; not the cause here).
