# EcoVeridian Extension Communication

This document explains how the website communicates with the EcoVeridian browser extension (works on both Chrome and Firefox).

## Overview

The extension communication system uses **CustomEvent-based messaging** instead of the traditional `chrome.runtime` API. This approach works across both Chrome and Firefox browsers, providing a unified communication mechanism.

## Key Features

- ✅ **Cross-browser support**: Works on both Chrome and Firefox
- ✅ **Extension detection**: Check if the extension is installed
- ✅ **Auth token synchronization**: Automatically sync Firebase auth tokens
- ✅ **Extension ready events**: Listen for when the extension becomes available
- ✅ **Backward compatibility**: Falls back to `chrome.runtime` API if needed

## How It Works

### 1. Extension Detection

The extension injects a marker element into the page DOM:

```javascript
// In the extension's content script
const marker = document.createElement('div');
marker.id = 'ecoveridian-extension-installed';
marker.style.display = 'none';
document.documentElement.appendChild(marker);
```

The website can detect this:

```typescript
import { isExtensionInstalled } from '@/lib/extensionBridge';

if (isExtensionInstalled()) {
  console.log('Extension is installed!');
}
```

### 2. Extension Ready Event

When the extension is loaded, it dispatches a ready event:

```javascript
// In the extension
window.dispatchEvent(new CustomEvent('ecoveridian-extension-ready', {
  detail: { version: '1.0.0' }
}));
```

The website listens for this:

```typescript
import { onExtensionReady } from '@/lib/extensionBridge';

const cleanup = onExtensionReady((version) => {
  console.log(`Extension ready, version: ${version}`);
});

// Don't forget to cleanup
return cleanup;
```

### 3. Auth Token Synchronization

#### From Website to Extension

When a user logs in, the website sends auth data to the extension:

```typescript
import { syncAuthWithExtension } from '@/lib/extensionBridge';

await syncAuthWithExtension(token, {
  email: user.email,
  displayName: user.displayName,
  photoURL: user.photoURL
});
```

This dispatches a CustomEvent that the extension listens for:

```javascript
// In the extension's content script
window.addEventListener('ecoveridian-auth-sync', (event) => {
  const { type, token, user, requestId } = event.detail;
  
  if (type === 'SYNC_AUTH_TOKEN') {
    // Forward to background script
    chrome.runtime.sendMessage({ 
      type: 'SYNC_AUTH_TOKEN', 
      token, 
      user 
    }, (response) => {
      // Send response back to website
      window.dispatchEvent(new CustomEvent('ecoveridian-auth-sync-response', {
        detail: {
          success: response.success,
          requestId: requestId
        }
      }));
    });
  }
});
```

#### Response Handling

The website waits for a response with a matching `requestId`:

```typescript
// This is handled automatically inside syncAuthWithExtension()
// It uses a Promise that resolves when the response is received
```

### 4. Logout Notification

When a user logs out:

```typescript
import { notifyExtensionLogout } from '@/lib/extensionBridge';

notifyExtensionLogout(); // Sends both CustomEvent and chrome.runtime message
```

## Implementation in Your Extension

### Content Script (content.js)

```javascript
// 1. Inject marker element
const marker = document.createElement('div');
marker.id = 'ecoveridian-extension-installed';
marker.style.display = 'none';
document.documentElement.appendChild(marker);

// 2. Dispatch ready event
window.dispatchEvent(new CustomEvent('ecoveridian-extension-ready', {
  detail: { version: chrome.runtime.getManifest().version }
}));

// 3. Listen for auth sync events from website
window.addEventListener('ecoveridian-auth-sync', (event) => {
  const { type, token, user, requestId } = event.detail;
  
  // Forward to background script
  chrome.runtime.sendMessage({ type, token, user }, (response) => {
    // Send response back to website
    window.dispatchEvent(new CustomEvent('ecoveridian-auth-sync-response', {
      detail: {
        success: response?.success || false,
        requestId: requestId,
        error: response?.error
      }
    }));
  });
});
```

### Background Script (background.js)

```javascript
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'SYNC_AUTH_TOKEN') {
    // Store the token
    chrome.storage.local.set({ 
      authToken: request.token,
      user: request.user 
    }, () => {
      sendResponse({ success: true });
    });
    return true; // Keep channel open for async response
  }
  
  if (request.type === 'LOGOUT') {
    // Clear stored data
    chrome.storage.local.remove(['authToken', 'user'], () => {
      sendResponse({ success: true });
    });
    return true;
  }
});
```

## Usage Examples

### Basic Extension Status Component

```tsx
import { ExtensionStatus } from '@/components/common/ExtensionStatus';

export function MyComponent() {
  return (
    <div>
      <h1>My App</h1>
      <ExtensionStatus />
    </div>
  );
}
```

### Manual Auth Sync

```typescript
import { useAuth } from '@/contexts/AuthContext';
import { syncAuthWithExtension } from '@/lib/extensionBridge';

export function MyComponent() {
  const { user } = useAuth();
  
  const handleManualSync = async () => {
    if (user) {
      const token = await user.getIdToken();
      const success = await syncAuthWithExtension(token, {
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL
      });
      
      console.log(success ? 'Sync successful!' : 'Sync failed');
    }
  };
  
  return <button onClick={handleManualSync}>Sync with Extension</button>;
}
```

## API Reference

### `isExtensionInstalled(): boolean`

Checks if the extension is installed by looking for the marker element.

**Returns:** `true` if installed, `false` otherwise

---

### `syncAuthWithExtension(token: string, user?: UserData): Promise<boolean>`

Sends auth token and user data to the extension using CustomEvent.

**Parameters:**
- `token` - Firebase auth token
- `user` - Optional user data object with email, displayName, photoURL

**Returns:** Promise that resolves to `true` if sync was successful

---

### `onExtensionReady(callback: (version: string) => void): () => void`

Listens for the extension ready event.

**Parameters:**
- `callback` - Function called when extension is ready, receives version string

**Returns:** Cleanup function to remove the event listener

---

### `notifyExtensionLogout(): Promise<void>`

Notifies the extension that the user has logged out.

---

## Browser Compatibility

| Feature | Chrome | Firefox | Edge |
|---------|--------|---------|------|
| CustomEvent API | ✅ | ✅ | ✅ |
| Extension Detection | ✅ | ✅ | ✅ |
| Auth Sync | ✅ | ✅ | ✅ |
| Ready Event | ✅ | ✅ | ✅ |

## Security Considerations

1. **Data Validation**: Always validate data received from CustomEvents
2. **Timeout Handling**: The sync function has a 1-second timeout to prevent hanging
3. **Error Handling**: All functions gracefully handle missing extension scenarios
4. **SSR Safety**: All functions check for browser environment before executing

## Troubleshooting

### Extension not detected

1. Verify the extension is installed and enabled
2. Check browser console for errors
3. Ensure the marker element is being injected by the extension

### Auth sync not working

1. Check that the extension's content script is listening for `ecoveridian-auth-sync` events
2. Verify the extension responds with `ecoveridian-auth-sync-response` events
3. Check that `requestId` matches between request and response
4. Look for timeout errors (default 1 second)

### Events not firing

1. Ensure you're in a browser environment (not SSR)
2. Check that event listeners are added before events are dispatched
3. Verify CustomEvent is properly constructed with `detail` property
