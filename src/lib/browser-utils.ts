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
  
  // Firefox Add-ons URL
  const firefoxAddonsUrl = 'https://addons.mozilla.org/firefox/addon/ecoveridian/';

  switch (browser) {
    case 'chrome':
      return chromeWebStoreUrl;
    case 'edge':
      // Edge users can often install from the Chrome Web Store (or visit Edge Add-ons later)
      return chromeWebStoreUrl;
    case 'firefox':
      return firefoxAddonsUrl;
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
  if ('userAgentData' in navigator && navigator.userAgentData) {
    const userAgentData = navigator.userAgentData as { mobile?: boolean };
    if (typeof userAgentData.mobile === 'boolean') {
      return userAgentData.mobile;
    }
  }

  const ua = navigator.userAgent || '';
  return /Mobi|Android|iPhone|iPad|iPod|IEMobile|Mobile/i.test(ua);
}

/**
 * Detect whether the user is on Firefox for Android.
 * Firefox for Android supports browser extensions, unlike most mobile browsers.
 */
export function isFirefoxMobile(): boolean {
  if (typeof window === 'undefined') return false;
  
  const ua = navigator.userAgent || '';
  
  // Firefox for Android - has Gecko engine with Firefox and Android tokens
  // Example UA: Mozilla/5.0 (Android 4.4; Mobile; rv:41.0) Gecko/41.0 Firefox/41.0
  const isFirefoxAndroid = /Firefox/i.test(ua) && /Android/i.test(ua) && !/Chrome/i.test(ua);
  
  // Firefox for iOS - identified by FxiOS token
  // Example UA: Mozilla/5.0 (iPhone; CPU iPhone OS 8_3 like Mac OS X) AppleWebKit/... FxiOS/1.0 ...
  const isFirefoxiOS = /FxiOS/i.test(ua);
  
  return isFirefoxAndroid || isFirefoxiOS;
}

/**
 * Check if the mobile browser supports extensions.
 * Currently only Firefox for Android supports extensions on mobile.
 */
export function mobileSupportsExtensions(): boolean {
  if (typeof window === 'undefined') return false;
  
  const ua = navigator.userAgent || '';
  
  // Firefox for Android supports extensions
  // Firefox for iOS does NOT support extensions (iOS restrictions)
  const isFirefoxAndroid = /Firefox/i.test(ua) && /Android/i.test(ua) && !/Chrome/i.test(ua);
  
  return isFirefoxAndroid;
}
