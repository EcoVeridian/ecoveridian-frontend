/**
 * EcoVeridian Extension Bridge
 * Handles communication between the website and browser extension
 */

const EXTENSION_ID = "cjepofimmkceohajfndfopkpohbacnld";

/**
 * Sync the Firebase auth token to the extension
 */
export async function syncAuthToExtension(
  token: string,
  user?: { email?: string; displayName?: string; photoURL?: string }
): Promise<boolean> {
  // Check if Chrome runtime is available
  if (typeof chrome === "undefined" || !chrome.runtime?.sendMessage) {
    return false;
  }

  try {
    const response = await chrome.runtime.sendMessage(EXTENSION_ID, {
      type: "SYNC_AUTH_TOKEN",
      token,
      user,
    });
    console.log(response?.success ? "Auth synced to Extension" : "Extension sync failed");
    return response?.success || false;
  } catch (error) {
    // Extension likely not installed
    return false;
  }
}

/**
 * Notify extension of logout
 */
export async function notifyExtensionLogout(): Promise<void> {
  if (typeof chrome === "undefined" || !chrome.runtime?.sendMessage) return;
  try {
    await chrome.runtime.sendMessage(EXTENSION_ID, { type: "LOGOUT" });
  } catch {
    /* Ignore */
  }
}
