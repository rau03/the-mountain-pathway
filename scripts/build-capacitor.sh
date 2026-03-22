#!/bin/bash
# Build script for Capacitor (static export)
# This script temporarily modifies the project for static export,
# then restores it after the build completes.

set -e  # Exit on error

echo "🔧 Preparing Capacitor build..."

# Store the project root
PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$PROJECT_ROOT"

# Use a per-run temp directory so concurrent/interrupted runs don't collide.
BACKUP_DIR="$(mktemp -d /tmp/capacitor-build-backup.XXXXXX)"
HAS_RECOVERY_BACKUP=0

# Backup files that need modification
echo "📦 Backing up files..."
cp next.config.ts "$BACKUP_DIR/next.config.ts.backup"
cp src/app/auth/callback/route.ts "$BACKUP_DIR/callback.route.ts.backup"
if [ -d src/app/auth/callback/recovery ]; then
    cp -r src/app/auth/callback/recovery "$BACKUP_DIR/recovery.backup"
    HAS_RECOVERY_BACKUP=1
fi
cp src/app/auth/confirm/route.ts "$BACKUP_DIR/confirm.route.ts.backup"
cp src/app/page.tsx "$BACKUP_DIR/page.tsx.backup"
cp src/app/login/page.tsx "$BACKUP_DIR/login.page.tsx.backup"

# Function to restore files on exit (success or failure)
cleanup() {
    echo "🔄 Restoring original files..."
    if [ -f "$BACKUP_DIR/next.config.ts.backup" ]; then
        cp "$BACKUP_DIR/next.config.ts.backup" next.config.ts
    fi
    if [ -f "$BACKUP_DIR/callback.route.ts.backup" ]; then
        cp "$BACKUP_DIR/callback.route.ts.backup" src/app/auth/callback/route.ts
    fi
    if [ "$HAS_RECOVERY_BACKUP" -eq 1 ] && [ -d "$BACKUP_DIR/recovery.backup" ]; then
        rm -rf src/app/auth/callback/recovery
        cp -R "$BACKUP_DIR/recovery.backup" src/app/auth/callback/recovery
    fi
    if [ -f "$BACKUP_DIR/confirm.route.ts.backup" ]; then
        cp "$BACKUP_DIR/confirm.route.ts.backup" src/app/auth/confirm/route.ts
    fi
    if [ -f "$BACKUP_DIR/page.tsx.backup" ]; then
        cp "$BACKUP_DIR/page.tsx.backup" src/app/page.tsx
    fi
    if [ -f "$BACKUP_DIR/login.page.tsx.backup" ]; then
        cp "$BACKUP_DIR/login.page.tsx.backup" src/app/login/page.tsx
    fi
    rm -rf "$BACKUP_DIR"
    echo "✅ Files restored"
}

# Set trap to always run cleanup
trap cleanup EXIT

# Modify next.config.ts to add output: "export"
echo "📝 Configuring static export..."
cat > next.config.ts << 'EOF'
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true, // Generates index.html at root for Capacitor
  // Headers don't work with static export, handled by hosting platform
};

export default nextConfig;
EOF

# Replace route handlers with static stubs
echo "📝 Converting route handlers to static pages..."

# Auth callback - static stub
cat > src/app/auth/callback/route.ts << 'EOF'
// Static export stub - auth handled via deep links in native app
export const dynamic = "force-static";
export async function GET() {
  return new Response("Auth callback - use native app deep links", { status: 200 });
}
EOF

# Auth callback/recovery - remove entirely (conflicts with callback file in static export)
rm -rf src/app/auth/callback/recovery

# Auth confirm - static stub
cat > src/app/auth/confirm/route.ts << 'EOF'
// Static export stub - auth handled via deep links in native app
export const dynamic = "force-static";
export async function GET() {
  return new Response("Auth confirm - use native app deep links", { status: 200 });
}
EOF

# Home page - static version (auth handled client-side)
echo "📝 Converting pages for static export..."
cat > src/app/page.tsx << 'EOF'
import PageWrapper from "@/components/PageWrapper";

/**
 * Home page - Capacitor static export version
 * Auth is handled client-side in the native app
 */
export default function Home() {
  // For static export, render without server-side session
  // Client-side auth will be handled by PageWrapper/HomeClient
  return <PageWrapper session={null} />;
}
EOF

# Login page - remove force-dynamic
cat > src/app/login/page.tsx << 'EOF'
"use client";

import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import supabase from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useUser } from "@supabase/auth-helpers-react";
import { useEffect } from "react";
import { getEmailRedirectTo } from "@/lib/authRedirect";

export default function LoginPage() {
  const router = useRouter();
  const user = useUser();

  // If a user is already logged in, redirect them to the home page.
  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  if (!supabase) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p>Configuration error: Supabase is not available</p>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}
    >
      <div style={{ width: "100%", maxWidth: "420px" }}>
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          theme="dark"
          providers={["google"]}
          redirectTo={getEmailRedirectTo()}
          onlyThirdPartyProviders={false}
        />
      </div>

      {/* Buy Me a Coffee Link */}
      <a
        href="https://buymeacoffee.com/themountainpathway"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          marginTop: "2rem",
          fontSize: "0.875rem",
          color: "rgba(255, 255, 255, 0.5)",
          textDecoration: "none",
          transition: "color 0.2s",
        }}
        onMouseOver={(e) => (e.currentTarget.style.color = "rgba(255, 255, 255, 0.7)")}
        onMouseOut={(e) => (e.currentTarget.style.color = "rgba(255, 255, 255, 0.5)")}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M10 2v2" />
          <path d="M14 2v2" />
          <path d="M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1" />
          <path d="M6 2v2" />
        </svg>
        Buy me a Coffee
      </a>
    </div>
  );
}
EOF

# Run the Next.js build
# Override NEXT_PUBLIC_SITE_URL for Capacitor builds — .env.local has
# localhost which Supabase rejects.  The production HTTPS URL ensures
# email confirmation redirect_to values land on the real site.
echo "🏗️  Building Next.js static export..."
# Use non-Turbopack build for Capacitor export reliability.
# Turbopack can complete "Exporting" while omitting root out/index.html.
rm -rf .next out
NEXT_PUBLIC_SITE_URL=https://themountainpathway.com npx next build

# Check if build succeeded
if [ -d "out" ] && [ -f "out/index.html" ]; then
    echo "✅ Static export created in /out folder"
    
    # Sync with Capacitor
    echo "📱 Syncing with Capacitor..."
    npx cap sync
    
    echo ""
    echo "🎉 Capacitor build complete!"
    echo ""
    echo "Next steps:"
    echo "  npx cap open ios      # Open in Xcode"
    echo "  npx cap open android  # Open in Android Studio"
else
    echo "❌ Build failed - /out/index.html was not created"
    echo "   Contents of /out for debugging:"
    ls -la out || true
    exit 1
fi
