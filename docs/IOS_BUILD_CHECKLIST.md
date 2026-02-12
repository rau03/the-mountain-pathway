# iOS Build Checklist

Use this checklist **every time** you want to deploy changes to TestFlight or the App Store.

---

## For Every iOS Build (TestFlight or App Store)

### 1. Make Your Code Changes
- Edit your React/Next.js code
- Test locally: `npm run dev` → http://localhost:3000

### 2. Build Static Export
```bash
cd /Users/christopherrau/the-mountain-pathway
bash scripts/build-capacitor.sh
```
⏱️ Takes ~1-2 minutes

**What this does:**
- Compiles your React code → static HTML/CSS/JS
- Copies it to `ios/App/App/public/`
- Syncs with Capacitor

### 3. Open Xcode
```bash
npx cap open ios
```

### 4. Update Version/Build Numbers

**In Xcode:**
- Click **"App"** (left sidebar) → **"App"** target → **General** tab

**For TestFlight updates:**
- Increment **Build** number: `9` → `10` → `11` etc.
- Keep **Version** the same (e.g., `1.0.0`)

**For App Store updates:**
- Increment **Version**: `1.0.0` → `1.0.1` or `1.1.0`
- Reset **Build** to `1`

### 5. Create Archive

**In Xcode:**
1. Top toolbar: Select **"Any iOS Device (arm64)"** (NOT simulator)
2. **Product** → **Clean Build Folder**
3. **Product** → **Archive**
4. Wait 2-5 minutes for archive to complete

### 6. Distribute to App Store Connect

**In Xcode Organizer window:**
1. Select your new archive
2. Click **"Distribute App"**
3. Choose **"App Store Connect"** → **Next**
4. Choose **"Upload"** → **Next**
5. Click through options → **Upload**
6. Wait for "Distribute App succeeded"

### 7. Configure in App Store Connect

**Go to:** https://appstoreconnect.apple.com

**For TestFlight:**
1. **TestFlight** tab → Your app
2. Wait 5-10 minutes for build to process
3. When status = "Missing Compliance":
   - Click build → Add export compliance
   - Select: **"None of the algorithms mentioned above"**
4. Status changes to **"Ready to Submit"**
5. Add to test group or invite testers

**For App Store submission:**
1. **App Store** tab → Your app
2. Click **"+"** to create new version
3. Select your build
4. Fill in release notes
5. Submit for review

---

## ⚠️ Important Notes

- **Always run `bash scripts/build-capacitor.sh` before archiving!**
  - If you forget, your changes won't be in the build
  
- **TestFlight vs App Store:**
  - Same build process
  - TestFlight = testing (increment build number)
  - App Store = production (increment version number)

- **Build numbers must always increase**
  - Can't reuse: 9 → 10 → 11 ✅
  - Not: 9 → 10 → 9 ❌

---

## Quick Reference

```bash
# Full workflow in terminal:
cd /Users/christopherrau/the-mountain-pathway
bash scripts/build-capacitor.sh
npx cap open ios

# Then in Xcode:
# - Increment build number
# - Clean Build Folder
# - Archive
# - Distribute
```

---

## Troubleshooting

**Build fails?**
- Make sure you're using Xcode 26.1 (not 26.2 beta)
- Check: `xcodebuild -version`

**Changes not showing in TestFlight?**
- Did you run `bash scripts/build-capacitor.sh`?
- Did you increment the build number?

**App crashes or shows errors?**
- Test locally first: `npm run dev`
- Check for TypeScript/lint errors: `npm run build`
