/**
 * EcoVeridian Extension Bridge
 * Handles communication between the website and browser extension
 * Uses window.postMessage with explicit channels and requestIds
 */

const EXTENSION_ID = "jpmehcioggeadmlndekobedppcoiiaop";
const CHANNEL_AUTH_SYNC = 'ecoveridian-auth-sync';
const CHANNEL_AUTH_SYNC_RESPONSE = 'ecoveridian-auth-sync-response';
const CHANNEL_EXTENSION_READY = 'ecoveridian-extension-ready';

type ExtensionPayload = Record<string, unknown> & { requestId?: string };

interface ExtensionMessage {
  channel: string;
  payload?: ExtensionPayload;
}

class ExtensionBridge {
  private pendingRequests = new Map<string, (response: ExtensionPayload) => void>();
  private isReady = false;
  private readyCallbacks: Array<(version?: string) => void> = [];
  private extensionVersion?: string;

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('message', this.handleMessage);
    }
  }

  private handleMessage = (event: MessageEvent) => {
    if (event.source !== window) return;

    const data = event.data as ExtensionMessage;
    if (!data?.channel) return;

    if (data.channel === CHANNEL_EXTENSION_READY) {
      this.isReady = true;
      this.extensionVersion = (data.payload?.version as string | undefined) ?? undefined;
      this.readyCallbacks.forEach((cb) => cb(this.extensionVersion));
      this.readyCallbacks = [];
      return;
    }

    if (data.channel === CHANNEL_AUTH_SYNC_RESPONSE) {
      const { requestId, ...response } = data.payload ?? {};
      if (!requestId) return;

      const resolver = this.pendingRequests.get(requestId);
      if (resolver) {
        resolver(response);
        this.pendingRequests.delete(requestId);
      }
    }
  };

  waitForReady(): Promise<string | undefined> {
    if (typeof window === 'undefined') {
      return Promise.resolve(undefined);
    }

    if (this.isReady) {
      return Promise.resolve(this.extensionVersion);
    }

    return new Promise((resolve) => {
      this.readyCallbacks.push(resolve);
    });
  }

  private createRequestId(): string {
    return `req-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  private sendRequest<T extends ExtensionPayload = ExtensionPayload>(
    channel: string,
    payload: ExtensionPayload,
    timeoutMs = 5000
  ): Promise<T> {
    if (typeof window === 'undefined') {
      return Promise.resolve({ success: false } as unknown as T);
    }

    const requestId = this.createRequestId();

    return new Promise<T>((resolve) => {
      const timer = setTimeout(() => {
        this.pendingRequests.delete(requestId);
        resolve({ success: false, error: 'Extension timeout' } as unknown as T);
      }, timeoutMs);

      this.pendingRequests.set(requestId, (response) => {
        clearTimeout(timer);
        resolve(response as T);
      });

      window.postMessage(
        {
          channel,
          payload: {
            ...payload,
            requestId,
          },
        },
        window.origin
      );
    });
  }

  async syncAuth(
    token: string,
    user?: { email?: string; displayName?: string; photoURL?: string }
  ): Promise<boolean> {
    const response = await this.sendRequest<{ success?: boolean }>(CHANNEL_AUTH_SYNC, {
      type: 'SYNC_AUTH_TOKEN',
      token,
      user,
    });

    if (response?.success) {
      return true;
    }

    // Fallback to chrome.runtime for legacy versions
    if (typeof chrome === 'undefined' || !chrome.runtime?.sendMessage) {
      return false;
    }

    try {
      const runtimeResponse = await chrome.runtime.sendMessage(EXTENSION_ID, {
        type: 'SYNC_AUTH_TOKEN',
        token,
        user,
      });
      return runtimeResponse?.success || false;
    } catch {
      return false;
    }
  }

  async logout(): Promise<void> {
    await this.sendRequest(CHANNEL_AUTH_SYNC, { type: 'LOGOUT' });

    // Legacy fallback
    if (typeof chrome === 'undefined' || !chrome.runtime?.sendMessage) return;
    try {
      await chrome.runtime.sendMessage(EXTENSION_ID, { type: 'LOGOUT' });
    } catch {
      // Ignore
    }
  }

  onReady(callback: (version?: string) => void): () => void {
    if (typeof window === 'undefined') {
      return () => {};
    }

    const handler = (version?: string) => callback(version);
    this.readyCallbacks.push(handler);

    if (this.isReady) {
      // Defer to keep behavior similar to event dispatch
      setTimeout(() => {
        handler(this.extensionVersion);
        this.readyCallbacks = this.readyCallbacks.filter((cb) => cb !== handler);
      }, 0);
    }

    return () => {
      this.readyCallbacks = this.readyCallbacks.filter((cb) => cb !== handler);
    };
  }
}

const extensionBridge = new ExtensionBridge();

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
 * Sync the Firebase auth token to the extension using postMessage
 */
export function syncAuthToExtension(
  token: string,
  user?: { email?: string; displayName?: string; photoURL?: string }
): Promise<boolean> {
  return extensionBridge.syncAuth(token, user);
}

/**
 * Notify extension of logout using postMessage (with legacy chrome.runtime fallback)
 */
export function notifyExtensionLogout(): Promise<void> {
  return extensionBridge.logout();
}

/**
 * Listen for extension ready event
 * Call this once when your app initializes
 */
export function onExtensionReady(callback: (version?: string) => void): () => void {
  return extensionBridge.onReady(callback);
}
