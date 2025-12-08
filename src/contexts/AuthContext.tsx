'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { 
  syncAuthToExtension, 
  notifyExtensionLogout,
  onExtensionReady
} from '@/lib/extensionBridge';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for extension ready event
    const cleanupExtensionListener = onExtensionReady(() => {
      // If user is already logged in when extension becomes ready, sync immediately
      if (user) {
        user.getIdToken().then(token => {
          syncAuthToExtension(token, {
            email: user.email ?? undefined,
            displayName: user.displayName ?? undefined,
            photoURL: user.photoURL ?? undefined,
          });
        }).catch(() => {
          // ignore token errors
        });
      }
    });

    // Subscribe to auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      setLoading(false);

      // If there's a logged-in user, send token to extension
      if (user) {
        try {
          const token = await user.getIdToken();
          // Best-effort: don't block UI if extension missing
          await syncAuthToExtension(token, {
            email: user.email ?? undefined,
            displayName: user.displayName ?? undefined,
            photoURL: user.photoURL ?? undefined,
          });
        } catch (err) {
          // ignore token errors
        }
      } else {
        // User logged out, notify extension
        notifyExtensionLogout();
      }
    });

    // Cleanup subscription on unmount
    return () => {
      unsubscribe();
      cleanupExtensionListener();
    };
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
