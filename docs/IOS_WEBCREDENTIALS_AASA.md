# iOS Webcredentials AASA Contract

To enable iCloud Keychain password AutoFill for the iOS app, host an Apple App Site Association (AASA) file at:

- `https://themountainpathway.com/.well-known/apple-app-site-association`
- `https://www.themountainpathway.com/.well-known/apple-app-site-association`

The JSON payload should include the app identifier in the format `<AppleTeamID>.com.themountainpathway.app`.

Example:

```json
{
  "webcredentials": {
    "apps": [
      "<AppleTeamID>.com.themountainpathway.app"
    ]
  }
}
```

Notes:

- Serve the AASA file as JSON with no redirect.
- Ensure both apex and `www` hosts return valid content.
- Replace `<AppleTeamID>` with the production Apple Developer Team ID.
