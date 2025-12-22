# Supabase Email Configuration Guide

This guide explains how to configure Supabase for proper email delivery (password reset) and custom email branding.

## Problem Summary

Beta testers reported two issues:

1. **Password Reset emails not arriving** - "Forgot Password" link doesn't send emails
2. **Emails look like spam** - Emails come from "Supabase Auth" instead of "The Mountain Pathway"

Both issues are resolved through Supabase Dashboard configuration.

---

## Part 1: Fixing Password Reset Emails

### Step 1: Verify Email Templates

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Authentication** → **Email Templates**
4. Verify the following templates exist and are configured:
   - **Confirm signup** - Sent when users register
   - **Reset password** - Sent when users request password reset
   - **Magic link** - Sent for passwordless login (if enabled)

### Step 2: Check Email Template URLs

In the **Reset password** template, ensure the URL uses your production domain:

```
<a href="{{ .ConfirmationURL }}">Reset Password</a>
```

The `{{ .ConfirmationURL }}` should resolve to your production URL, not localhost.

### Step 3: Verify Site URL

1. Go to **Authentication** → **URL Configuration**
2. Ensure **Site URL** is set to your production domain:
   ```
   https://themountainpathway.com
   ```
3. Add your domain to **Redirect URLs**:
   ```
   https://themountainpathway.com/**
   ```

### Step 4: Check Email Rate Limits

1. Go to **Authentication** → **Settings**
2. Under **Email Auth**, check:
   - **Enable email confirmations** is ON
   - **Rate limit for sending emails** is reasonable (default: 4 per hour)

---

## Part 2: Custom Email Branding (SMTP Configuration)

To send emails from "The Mountain Pathway" instead of "Supabase Auth", you need to configure a custom SMTP provider.

### Recommended SMTP Providers

| Provider                            | Free Tier              | Setup Difficulty |
| ----------------------------------- | ---------------------- | ---------------- |
| [Resend](https://resend.com)        | 3,000/month            | Easy             |
| [SendGrid](https://sendgrid.com)    | 100/day                | Medium           |
| [Mailgun](https://mailgun.com)      | 5,000/month (3 months) | Medium           |
| [Postmark](https://postmarkapp.com) | 100/month              | Easy             |

### Step 1: Set Up SMTP Provider (Example: Resend)

1. Create account at [resend.com](https://resend.com)
2. Verify your domain (e.g., `themountainpathway.com`)
3. Generate an API key
4. Note your SMTP credentials:
   - Host: `smtp.resend.com`
   - Port: `465` (SSL) or `587` (TLS)
   - Username: `resend`
   - Password: Your API key

### Step 2: Configure Supabase SMTP

1. Go to **Project Settings** → **Authentication**
2. Scroll to **SMTP Settings**
3. Toggle **Enable Custom SMTP** to ON
4. Enter your SMTP credentials:

   | Field        | Value                          |
   | ------------ | ------------------------------ |
   | Sender email | `hello@themountainpathway.com` |
   | Sender name  | `The Mountain Pathway`         |
   | Host         | `smtp.resend.com`              |
   | Port         | `465`                          |
   | Username     | `resend`                       |
   | Password     | `your-api-key-here`            |

5. Click **Save**

### Step 3: Test Email Delivery

1. Go to **Authentication** → **Users**
2. Click **Invite user**
3. Enter a test email address
4. Verify the email arrives with your custom branding

---

## Email Template Customization

After configuring SMTP, customize your email templates:

### Navigate to Templates

1. Go to **Authentication** → **Email Templates**
2. Select the template to edit

### Recommended Template Customizations

#### Confirm Signup Template

```html
<h2>Welcome to The Mountain Pathway</h2>

<p>Thank you for joining us on this journey of reflection and growth.</p>

<p>Please confirm your email address to get started:</p>

<p><a href="{{ .ConfirmationURL }}">Confirm Email Address</a></p>

<p>If you didn't create an account, you can safely ignore this email.</p>

<p>Peace and blessings,<br />The Mountain Pathway Team</p>
```

#### Reset Password Template

```html
<h2>Reset Your Password</h2>

<p>We received a request to reset your password for The Mountain Pathway.</p>

<p>Click the link below to set a new password:</p>

<p><a href="{{ .ConfirmationURL }}">Reset Password</a></p>

<p>This link will expire in 24 hours.</p>

<p>If you didn't request this, you can safely ignore this email.</p>

<p>Peace and blessings,<br />The Mountain Pathway Team</p>
```

---

## Troubleshooting

### Emails Still Not Arriving

1. **Check spam folder** - Ask users to check spam/junk
2. **Verify domain DNS** - Ensure SPF, DKIM, and DMARC records are set
3. **Check SMTP logs** - In your SMTP provider's dashboard
4. **Test with different email** - Try Gmail, Outlook, etc.

### Emails Going to Spam

1. **Set up proper DNS records:**

   - SPF record
   - DKIM record
   - DMARC record

2. **Use professional sender email** - Use `hello@` or `noreply@` with your domain

3. **Don't use generic content** - Personalize templates

### Rate Limiting Issues

If users can't request password reset:

1. Check **Authentication** → **Settings** → **Rate limit**
2. Consider increasing the limit temporarily
3. Clear any rate limit blocks in the database

---

## Environment Variables Checklist

Ensure your `.env` file has:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SITE_URL=https://themountainpathway.com
```

The `NEXT_PUBLIC_SITE_URL` is used for auth callback redirects.

---

## Summary

| Issue                       | Solution                        | Location                       |
| --------------------------- | ------------------------------- | ------------------------------ |
| Password reset not working  | Check Site URL, Email Templates | Auth → URL Config              |
| Emails from "Supabase Auth" | Configure Custom SMTP           | Project Settings → Auth → SMTP |
| Emails look unprofessional  | Customize email templates       | Auth → Email Templates         |
| Emails going to spam        | Configure DNS records           | Your domain registrar          |

---

## Support

If you continue to have issues:

1. Check [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
2. Visit [Supabase Discord](https://discord.supabase.com)
3. Check your SMTP provider's documentation and logs
