# TODO: Fix Capacitor Static Export

## Current Issue

The iOS app uses a workaround that redirects to localhost:3000 dev server. This won't work for external TestFlight testers.

## What's Broken

`npm run build:capacitor` fails to generate proper static export because:

- Next.js dynamic routes don't export to static HTML by default
- Auth callback routes are server-side
- Home page requires session data

## Fix Required

### 1. Update Next.js Static Export Config

File: `scripts/build-capacitor.sh`

The script tries to add `output: "export"` but the build still fails to create `index.html`.

**Possible solutions:**

- Add `generateStaticParams` for dynamic routes
- Convert auth routes to client-side only
- Use `next export` command instead of `next build`
- Create custom export script

### 2. Handle Auth Routes

Files:

- `src/app/auth/callback/route.ts`
- `src/app/auth/confirm/route.ts`

These need to be:

- Client-side only (no server-side logic)
- Or properly stubbed for static export

### 3. Test Static Build

```bash
npm run build:capacitor
# Should create: out/index.html
ls -la out/index.html  # Verify it exists

npx cap sync ios
npx cap open ios
# Build and test WITHOUT dev server running
```

### 4. Verify Standalone Functionality

- Kill dev server: `pkill -f "next dev"`
- Launch iOS app
- Should work completely offline
- Should load all assets from bundle

## Timeline

- **Build 1 (Current)**: Uses localhost workaround - good for initial TestFlight testing
- **Build 2 (Next)**: Proper static export - ready for external testers

## Resources

- [Next.js Static Exports](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [Capacitor with Next.js](https://capacitorjs.com/docs/guides/nextjs)
- [Our build script](scripts/build-capacitor.sh)

## Status

- [ ] Fix static export configuration
- [ ] Test build creates index.html
- [ ] Verify app works offline
- [ ] Upload Build 2 to TestFlight
- [ ] Test with external tester
