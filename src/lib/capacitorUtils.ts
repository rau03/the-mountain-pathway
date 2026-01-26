// Utility functions for Capacitor native app functionality
import { Capacitor } from '@capacitor/core';
import { Browser } from '@capacitor/browser';

/**
 * Check if running in a native Capacitor app
 */
export function isNativeApp(): boolean {
  return Capacitor.isNativePlatform();
}

/**
 * Get the current platform
 */
export function getPlatform(): 'ios' | 'android' | 'web' {
  return Capacitor.getPlatform() as 'ios' | 'android' | 'web';
}

/**
 * Open an external URL (mailto:, https:, tel:, etc.)
 * On native, uses Capacitor Browser plugin
 * On web, uses standard window methods
 */
export async function openExternalUrl(url: string): Promise<void> {
  if (isNativeApp()) {
    try {
      await Browser.open({ url });
    } catch (error) {
      console.error('Failed to open URL with Browser plugin:', error);
      // Fallback
      window.location.href = url;
    }
  } else {
    // On web, use standard methods
    if (url.startsWith('mailto:') || url.startsWith('tel:')) {
      window.location.href = url;
    } else {
      window.open(url, '_blank');
    }
  }
}

/**
 * Open email client with pre-filled address
 */
export async function openEmail(email: string, subject?: string, body?: string): Promise<void> {
  let mailtoUrl = `mailto:${email}`;
  const params: string[] = [];
  
  if (subject) {
    params.push(`subject=${encodeURIComponent(subject)}`);
  }
  if (body) {
    params.push(`body=${encodeURIComponent(body)}`);
  }
  
  if (params.length > 0) {
    mailtoUrl += `?${params.join('&')}`;
  }
  
  await openExternalUrl(mailtoUrl);
}
