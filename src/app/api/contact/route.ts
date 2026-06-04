import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Resend } from "resend";

const CONTACT_TO_EMAIL = "hello@themountainpathway.com";
const CONTACT_FROM_EMAIL = "Mountain Pathway <hello@themountainpathway.com>";

// Native iOS (capacitor://localhost) posts cross-origin to the production
// API, so every response must carry CORS headers.
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function isValidEmail(email: string): boolean {
  return email.includes("@") && email.includes(".");
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function POST(request: NextRequest) {
  const resendApiKey = process.env.RESEND_API_KEY;

  if (!resendApiKey) {
    return NextResponse.json(
      { error: "Email service is not configured" },
      { status: 500, headers: CORS_HEADERS }
    );
  }

  let body: {
    name?: unknown;
    email?: unknown;
    message?: unknown;
    website?: unknown;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400, headers: CORS_HEADERS }
    );
  }

  // Honeypot: real users never see/fill the "website" field. If it has any
  // value, silently accept (so the bot thinks it succeeded) without sending.
  if (typeof body.website === "string" && body.website.trim()) {
    return NextResponse.json({ success: true }, { headers: CORS_HEADERS });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Name, email, and message are all required" },
      { status: 400, headers: CORS_HEADERS }
    );
  }

  if (!isValidEmail(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address" },
      { status: 400, headers: CORS_HEADERS }
    );
  }

  if (message.length < 10) {
    return NextResponse.json(
      { error: "Message must be at least 10 characters" },
      { status: 400, headers: CORS_HEADERS }
    );
  }

  try {
    const resend = new Resend(resendApiKey);

    const html = `
      <div style="font-family: Arial, Helvetica, sans-serif; color: #1f2937; line-height: 1.6;">
        <h2 style="margin: 0 0 16px;">New message from ${escapeHtml(name)}</h2>
        <p style="margin: 0 0 8px;"><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p style="margin: 0 0 8px;"><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p style="margin: 16px 0 4px;"><strong>Message:</strong></p>
        <p style="margin: 0; white-space: pre-wrap;">${escapeHtml(message)}</p>
      </div>
    `;

    const { error } = await resend.emails.send({
      from: CONTACT_FROM_EMAIL,
      to: CONTACT_TO_EMAIL,
      replyTo: email,
      subject: `New message from ${name}`,
      html,
    });

    if (error) {
      console.error("[contact] Resend error", error);
      return NextResponse.json(
        { error: "Failed to send message" },
        { status: 500, headers: CORS_HEADERS }
      );
    }

    return NextResponse.json({ success: true }, { headers: CORS_HEADERS });
  } catch (err) {
    console.error("[contact] Unexpected error", err);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
