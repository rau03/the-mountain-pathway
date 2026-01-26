import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.themountainpathway.app',
  appName: 'The Mountain Pathway',
  webDir: 'out',
  ios: {
    // Content inset behavior - adjusts for safe areas
    contentInset: 'always',
    // Allow link previews
    allowsLinkPreview: true,
    // Scroll to accommodate keyboard
    scrollEnabled: true,
  },
  plugins: {
    // App plugin handles external URLs
    App: {
      // No specific config needed
    }
  }
};

export default config;
