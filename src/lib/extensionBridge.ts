/**
 * EcoVeridian Extension Bridge
 * Handles communication between the website and browser extension
 * Supports both Chrome and Firefox using CustomEvent-based communication
 */

const EXTENSION_ID = "jpmehcioggeadmlndekobedppcoiiaop";

interface ExtensionSyncResponse {
  success: boolean;
  requestId: string;
  error?: string;
}

interface ExtensionReadyEvent extends CustomEvent {
  detail: {
    version: string;
  };
}

/**
 * Detect if the extension is installed
 * Works for both Chrome and Firefox
 */
export function isExtensionInstalled(): boolean {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return false;
  }
  return document.getElementById('ecoveridian-extension-installed') !== null;
}

/**
 * Sync the Firebase auth token to the extension using CustomEvent
 * This method works for both Chrome and Firefox
 */
export function syncAuthWithExtension(
  token: string,
  user?: { email?: string; displayName?: string; photoURL?: string }
): Promise<boolean> {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') {
    return Promise.resolve(false);
  }

  return new Promise((resolve) => {
    const requestId = Date.now().toString();
    const timeout = setTimeout(() => {
      window.removeEventListener('ecoveridian-auth-sync-response', handleResponse);
      resolve(false);
    }, 1000);

    // Listen for response from extension
    const handleResponse = (event: Event) => {
      const customEvent = event as CustomEvent<ExtensionSyncResponse>;
      if (customEvent.detail.requestId === requestId) {
        clearTimeout(timeout);
        window.removeEventListener('ecoveridian-auth-sync-response', handleResponse);
        resolve(customEvent.detail.success);
      }
    };

    window.addEventListener('ecoveridian-auth-sync-response', handleResponse);

    // Send auth event to extension
    window.dispatchEvent(
      new CustomEvent('ecoveridian-auth-sync', {
        detail: {
          type: 'SYNC_AUTH_TOKEN',
          token: token,
          user: user,
          requestId: requestId,
        },
      })
    );
  });
}

/**
 * Legacy sync method using chrome.runtime API (Chrome only)
 * Kept for backward compatibility
 */
export async function syncAuthToExtension(
  token: string,
  user?: { email?: string; displayName?: string; photoURL?: string }
): Promise<boolean> {
  // First try the CustomEvent method (works for both Chrome and Firefox)
  try {
    const customEventResult = await syncAuthWithExtension(token, user);
    if (customEventResult) {
      return true;
    }
  } catch (error) {
    // Silent fallback to chrome.runtime
  }

  // Fallback to chrome.runtime API for older Chrome extensions
  if (typeof chrome === "undefined" || !chrome.runtime?.sendMessage) {
    return false;
  }

  try {
    const response = await chrome.runtime.sendMessage(EXTENSION_ID, {
      type: "SYNC_AUTH_TOKEN",
      token,
      user,
    });
    return response?.success || false;
  } catch (error) {
    // Extension likely not installed
    return false;
  }
}

/**
 * Notify extension of logout using CustomEvent
 * Works for both Chrome and Firefox
 */
export function notifyExtensionLogoutEvent(): void {
  if (typeof window === 'undefined') return;

  window.dispatchEvent(
    new CustomEvent('ecoveridian-auth-sync', {
      detail: {
        type: 'LOGOUT',
        requestId: Date.now().toString(),
      },
    })
  );
}

/**
 * Legacy logout notification using chrome.runtime API
 * Kept for backward compatibility
 */
export async function notifyExtensionLogout(): Promise<void> {
  // First try the CustomEvent method
  notifyExtensionLogoutEvent();

  // Also try chrome.runtime API for backward compatibility
  if (typeof chrome === "undefined" || !chrome.runtime?.sendMessage) return;
  try {
    await chrome.runtime.sendMessage(EXTENSION_ID, { type: "LOGOUT" });
  } catch {
    /* Ignore */
  }
}

/**
 * Listen for extension ready event
 * Call this once when your app initializes
 */
export function onExtensionReady(callback: (version: string) => void): () => void {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const handleReady = (event: Event) => {
    const customEvent = event as ExtensionReadyEvent;
    callback(customEvent.detail.version);
  };

  window.addEventListener('ecoveridian-extension-ready', handleReady);

  // Return cleanup function
  return () => {
    window.removeEventListener('ecoveridian-extension-ready', handleReady);
  };
}
