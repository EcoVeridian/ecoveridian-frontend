'use client';

import { useEffect, useState } from 'react';
import { isExtensionInstalled, onExtensionReady } from '@/lib/extensionBridge';

/**
 * Example component that demonstrates extension detection and ready event handling
 * This can be used for debugging or as a status indicator in your UI
 */
export function ExtensionStatus() {
  const [extensionInstalled, setExtensionInstalled] = useState(false);
  const [extensionVersion, setExtensionVersion] = useState<string | null>(null);

  useEffect(() => {
    // Check if extension is installed on mount
    setExtensionInstalled(isExtensionInstalled());

    // Listen for extension ready event
    const cleanup = onExtensionReady((version) => {
      setExtensionInstalled(true);
      setExtensionVersion(version);
    });

    return cleanup;
  }, []);

  if (!extensionInstalled) {
    return null; // Or show "Extension not installed" message
  }

  return (
    <div className="flex items-center gap-2 text-sm text-green-600">
      <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse" />
      <span>
        Extension Connected
        {extensionVersion && ` (v${extensionVersion})`}
      </span>
    </div>
  );
}
