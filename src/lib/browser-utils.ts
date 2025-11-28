/**
 * Detect the user's browser
 * Returns 'chrome', 'edge', or 'other'
 */
export function detectBrowser(): 'chrome' | 'edge' | 'other' {
  // Server-side rendering check
  if (typeof window === 'undefined') {
    return 'other';
  }

  const userAgent = navigator.userAgent.toLowerCase();

  // Edge detection (must come before Chrome since Edge includes Chrome in UA)
  // Modern Edge is Chromium-based and includes "Edg" in the UA string
  if (userAgent.includes('edg/') || userAgent.includes('edge/')) {
    return 'edge';
  }

  // Chrome detection (check for Chrome but not Edge)
  if (userAgent.includes('chrome/') && !userAgent.includes('edg')) {
    return 'chrome';
  }

  // All other browsers
  return 'other';
}

/**
 * Get the extension store URL based on browser
 */
export function getExtensionUrl(browser: 'chrome' | 'edge' | 'other'): string | null {
  switch (browser) {
    case 'chrome':
      // Chrome Web Store URL - replace with your actual extension ID
      return 'https://chrome.google.com/webstore/category/extensions';
    case 'edge':
      // Microsoft Edge Add-ons URL - replace with your actual extension ID
      return 'https://microsoftedge.microsoft.com/addons/Microsoft-Edge-Extensions-Home';
    case 'other':
      return null; // No URL for unsupported browsers
  }
}
