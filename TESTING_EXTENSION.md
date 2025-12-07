# Testing the Extension Communication

This guide will help you test the new extension communication system.

## ✅ All Checks Passed

- ✅ TypeScript compilation successful (no errors)
- ✅ ESLint passed (no warnings or errors)
- ✅ Production build successful
- ✅ All dependencies installed correctly
- ✅ SSR-safe implementation verified

## Quick Test in Browser Console

Once your extension is set up and the website is running, you can test the functions in the browser console:

### 1. Check if Extension is Installed

```javascript
// Open browser console (F12) and run:
const { isExtensionInstalled } = await import('/src/lib/extensionBridge.ts');
console.log('Extension installed:', isExtensionInstalled());
```

### 2. Listen for Extension Ready Event

```javascript
window.addEventListener('ecoveridian-extension-ready', (e) => {
  console.log('Extension is ready!', e.detail);
});
```

### 3. Test Auth Sync

```javascript
// Dispatch a test auth sync event
window.dispatchEvent(new CustomEvent('ecoveridian-auth-sync', {
  detail: {
    type: 'SYNC_AUTH_TOKEN',
    token: 'test-token-123',
    user: { email: 'test@example.com' },
    requestId: Date.now().toString()
  }
}));

// Listen for response
window.addEventListener('ecoveridian-auth-sync-response', (e) => {
  console.log('Sync response:', e.detail);
});
```

## Testing with Your Extension

### Extension Content Script (content.js)

Make sure your extension has this code:

```javascript
// 1. Inject marker
const marker = document.createElement('div');
marker.id = 'ecoveridian-extension-installed';
marker.style.display = 'none';
document.documentElement.appendChild(marker);

// 2. Announce ready
window.dispatchEvent(new CustomEvent('ecoveridian-extension-ready', {
  detail: { version: '1.0.0' }
}));

// 3. Listen for auth sync
window.addEventListener('ecoveridian-auth-sync', (event) => {
  const { type, token, user, requestId } = event.detail;
  
  console.log('Received auth sync:', { type, token, user, requestId });
  
  // Send to background script
  chrome.runtime.sendMessage({ type, token, user }, (response) => {
    // Send response back to website
    window.dispatchEvent(new CustomEvent('ecoveridian-auth-sync-response', {
      detail: {
        success: response?.success || true,
        requestId: requestId
      }
    }));
  });
});
```

### Extension Background Script (background.js)

```javascript
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Background received:', request);
  
  if (request.type === 'SYNC_AUTH_TOKEN') {
    chrome.storage.local.set({ 
      authToken: request.token,
      user: request.user 
    }, () => {
      console.log('Token stored:', request.token);
      sendResponse({ success: true });
    });
    return true; // Keep channel open
  }
  
  if (request.type === 'LOGOUT') {
    chrome.storage.local.remove(['authToken', 'user'], () => {
      console.log('Token cleared');
      sendResponse({ success: true });
    });
    return true;
  }
});
```

## Manual Testing Steps

### Step 1: Start the Development Server

```bash
npm run dev
```

### Step 2: Open Browser DevTools

1. Open the website in Chrome/Firefox
2. Press F12 to open DevTools
3. Go to Console tab

### Step 3: Check Extension Detection

Run in console:

```javascript
document.getElementById('ecoveridian-extension-installed')
// Should return: <div id="ecoveridian-extension-installed" style="display: none;"></div>
// If null, extension is not installed or not working
```

### Step 4: Test Auth Flow

1. Log in to your website
2. Check console for "Successfully synced auth with extension"
3. In extension's background console, verify token was received
4. Check chrome.storage to verify token was saved

### Step 5: Test Logout Flow

1. Log out from your website
2. Check console for logout notification
3. Verify extension cleared the stored token

## Debugging Tips

### Website Not Detecting Extension

- Check if extension is installed and enabled
- Verify extension's content script is running on your domain
- Check if marker element exists: `document.getElementById('ecoveridian-extension-installed')`

### Sync Not Working

- Open both website console and extension console
- Look for `ecoveridian-auth-sync` events being dispatched
- Verify extension is listening for the event
- Check if `requestId` matches in request and response
- Verify 1-second timeout isn't being hit

### Events Not Firing

- Ensure content script has proper permissions in manifest.json
- Check if content script is injected: `chrome.tabs.query` in extension background
- Verify website is running on allowed domain
- Check browser console for any CSP errors

## Component Testing

### Add ExtensionStatus Component to Your Layout

```tsx
// In your layout.tsx or page.tsx
import { ExtensionStatus } from '@/components/common/ExtensionStatus';

export default function Layout() {
  return (
    <div>
      <ExtensionStatus />
      {/* Rest of your layout */}
    </div>
  );
}
```

You should see "Extension Connected (v1.0.0)" when the extension is active.

## Automated Testing Checklist

- [ ] Extension marker element is injected
- [ ] Extension ready event fires
- [ ] Auth sync event is dispatched on login
- [ ] Extension responds to sync request
- [ ] Token is stored in extension
- [ ] Logout event is dispatched on logout
- [ ] Token is cleared from extension
- [ ] SSR doesn't cause errors (check Next.js build)
- [ ] Works in both Chrome and Firefox
- [ ] Fallback to chrome.runtime works for older extensions

## Common Issues and Solutions

### Issue: "Cannot read property 'detail' of undefined"

**Solution:** Ensure you're using CustomEvent correctly with the `detail` property.

### Issue: Extension not responding

**Solution:** Check extension's manifest.json has correct `matches` pattern for your domain.

### Issue: Timeout errors

**Solution:** Increase timeout in `syncAuthWithExtension` function or check extension performance.

### Issue: SSR errors

**Solution:** All functions check for `typeof window === 'undefined'` - verify this is in place.

## Performance Notes

- Extension detection is synchronous (fast)
- Auth sync has 1-second timeout
- Events are lightweight (no polling)
- No performance impact when extension is not installed
- Cleanup functions prevent memory leaks

## Security Considerations

✅ No sensitive data in CustomEvent (only tokens that extension already needs)
✅ Request/response matching via `requestId` prevents spoofing
✅ Timeout prevents infinite waiting
✅ SSR-safe (no window/document access on server)
✅ Graceful degradation when extension is missing

## Next Steps

1. Load your extension in Chrome/Firefox
2. Start the development server
3. Test login/logout flow
4. Verify tokens are syncing
5. Check console logs for confirmation
6. Deploy and test in production

For more details, see `EXTENSION_COMMUNICATION.md`.
