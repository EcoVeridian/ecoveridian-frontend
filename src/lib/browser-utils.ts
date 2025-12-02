/**
 * Detect the user's browser
 * Returns 'chrome', 'edge', or 'other'
 */
export function detectBrowser(): 'chrome' | 'edge' | 'firefox' | 'other' {
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

  // Firefox
  if (userAgent.includes('firefox')) {
    return 'firefox';
  }

  // All other browsers
  return 'other';
}

/**
 * Get the extension store URL based on browser
 */
export function getExtensionUrl(browser: 'chrome' | 'edge' | 'firefox' | 'other'): string | null {
  // Use the Chrome Web Store canonical URL for the extension
  const chromeWebStoreUrl =
    'https://chrome.google.com/webstore/detail/ecoveridian/jpmehcioggeadmlndekobedppcoiiaop';

  switch (browser) {
    case 'chrome':
      return chromeWebStoreUrl;
    case 'edge':
      // Edge users can often install from the Chrome Web Store (or visit Edge Add-ons later)
      return chromeWebStoreUrl;
    case 'firefox':
      // Firefox support is not yet available — return null so UI can show a message
      return null;
    case 'other':
      return null; // No URL for unsupported browsers
  }
}

/**
 * Detect whether the current device is mobile.
 */
export function isMobile(): boolean {
  if (typeof window === 'undefined') return false;
  // navigator.userAgentData.mobile is more accurate when available, fallback to UA
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (navigator.userAgentData && typeof navigator.userAgentData.mobile === 'boolean') {
    // @ts-ignore
    return navigator.userAgentData.mobile;
  }

  const ua = navigator.userAgent || '';
  return /Mobi|Android|iPhone|iPad|iPod|IEMobile|Mobile/i.test(ua);
}
