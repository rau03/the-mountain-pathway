# End-to-End Testing Checklist

Use this checklist to verify all functionality before launch.

---

## Guest User Flow ✅ (Automated Test Passed)

- [x] Land on homepage, see landing page
- [x] Click "Begin Journey" and progress through all 9 steps
- [x] Enter text in reflection fields
- [x] Timer screen shows duration options (1m, 3m, 5m, 10m)
- [x] Audio plays and can be paused
- [x] Reach summary screen
- [x] Download PDF - verify date, formatting, content
- [x] Footer links present (Terms, Privacy, Data Deletion, Contact)

---

## New User Registration Flow

### Sign Up
- [ ] Click "Begin Journey" → "Yes, create my free account"
- [ ] Enter first name, email, and password
- [ ] Click "Create Account"
- [ ] Receive confirmation email from **"The Mountain Pathway"** (not "Supabase")
- [ ] Click confirmation link in email
- [ ] Successfully redirected back to app

### Save Journey
- [ ] Complete a journey (or part of one)
- [ ] Click "Save Journey" button
- [ ] Enter a title for the journey
- [ ] Journey saves successfully
- [ ] Confirmation message appears

### Sign Out Warning
- [ ] Start a new journey without saving
- [ ] Click Account icon → Sign Out
- [ ] Warning modal appears: "Your journey is not saved and will be lost"
- [ ] Click "Continue Journey" → returns to journey
- [ ] Click "Leave Without Saving" → signs out

---

## Returning User Flow

### Login
- [ ] Click Account icon → "I already have an account"
- [ ] Enter email and password
- [ ] Click "Log In"
- [ ] Successfully logged in

### View Saved Journeys
- [ ] Click Account icon → "View Saved Journeys"
- [ ] Modal shows list of saved journeys
- [ ] Each journey shows title and date

### Load & Continue Journey
- [ ] Click "Continue" on a saved journey
- [ ] Journey loads with previous responses
- [ ] Can navigate through steps
- [ ] Responses are preserved

### Update Saved Journey
- [ ] Make changes to a loaded journey
- [ ] Click "Save Journey"
- [ ] Choose to update existing or save as new
- [ ] Changes are saved correctly

---

## Password Reset Flow

### Request Reset
- [ ] Click Account icon → "I already have an account"
- [ ] Click "Forgot password?"
- [ ] Enter email address
- [ ] Click "Send Reset Link"
- [ ] Success message appears

### Email Verification
- [ ] Receive reset email from **"The Mountain Pathway"**
- [ ] Email contains reset link
- [ ] Link points to `themountainpathway.com/reset-password` (not localhost)

### Reset Password
- [ ] Click link in email
- [ ] Lands on `/reset-password` page (not homepage)
- [ ] Enter new password (twice)
- [ ] Click "Reset Password"
- [ ] Success message appears
- [ ] Redirects to homepage

### Verify Reset
- [ ] Log in with new password
- [ ] Login successful

---

## Mobile Testing

### iOS Safari
- [ ] Full journey from start to finish
- [ ] Text input works correctly
- [ ] Timer starts and completes
- [ ] Audio plays
- [ ] PDF download works
- [ ] Modals display correctly
- [ ] No horizontal scrolling issues

### Android Chrome
- [ ] Full journey from start to finish
- [ ] Text input works correctly
- [ ] Timer starts and completes
- [ ] Audio plays
- [ ] PDF download works
- [ ] Modals display correctly
- [ ] No horizontal scrolling issues

---

## Edge Cases

### Progress Persistence
- [ ] Refresh page mid-journey → progress preserved
- [ ] Close browser, reopen → progress preserved (if logged in)
- [ ] Clear localStorage → starts fresh

### Error Handling
- [ ] Invalid login credentials → error message shown
- [ ] Weak password on signup → error message shown
- [ ] Network offline during save → graceful error

---

## Legal Pages

### Terms of Service (/terms)
- [ ] Page loads correctly
- [ ] Back to Home link works
- [ ] Content is real (not placeholder)
- [ ] Contact email link works

### Privacy Policy (/privacy)
- [ ] Page loads correctly
- [ ] Back to Home link works
- [ ] Content is real (not placeholder)
- [ ] Third-party service links work

### Data Deletion (/data-deletion)
- [ ] Page loads correctly
- [ ] Back to Home link works
- [ ] Contact email link works
- [ ] Instructions are clear

---

## Final Verification

- [ ] All tests above pass
- [ ] No console errors on any page
- [ ] Site loads fast (< 3 seconds)
- [ ] SSL certificate valid (https)
- [ ] Favicon displays correctly
- [ ] Meta tags for sharing (Open Graph)

---

*Last updated: December 28, 2025*


