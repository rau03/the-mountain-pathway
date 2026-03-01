import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.themountainpathway.app',
  appName: 'The Mountain Pathway',
  webDir: 'out',
  ios: {
    // Let web layer control safe-area spacing to avoid iOS inset gaps
    contentInset: 'never',
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
