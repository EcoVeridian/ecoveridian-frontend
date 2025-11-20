'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { sendEmailVerification } from 'firebase/auth';

export default function EmailVerificationBanner() {
  const { user } = useAuth();
  const [dismissed, setDismissed] = useState(false);
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState('');

  // Don't show banner if user is verified, not logged in, or dismissed
  if (!user || user.emailVerified || dismissed) {
    return null;
  }

  const handleResendVerification = async () => {
    setResending(true);
    setMessage('');
    
    try {
      await sendEmailVerification(user);
      setMessage('Verification email sent! Please check your inbox.');
    } catch (error: any) {
      setMessage('Failed to send verification email. Please try again later.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="bg-yellow-500/10 border-b border-yellow-500/20">
      <div className="container mx-auto px-4 py-3 max-w-6xl">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 dark:text-yellow-500 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                Please verify your email address
              </p>
              <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-0.5">
                We sent a verification email to <span className="font-medium">{user.email}</span>.
                {message ? (
                  <span className="block mt-1">{message}</span>
                ) : (
                  <>
                    {' '}Didn&apos;t receive it?{' '}
                    <button
                      onClick={handleResendVerification}
                      disabled={resending}
                      className="underline hover:no-underline font-medium disabled:opacity-50"
                    >
                      {resending ? 'Sending...' : 'Resend email'}
                    </button>
                  </>
                )}
              </p>
            </div>
          </div>
          <button
            onClick={() => setDismissed(true)}
            className="p-1 rounded hover:bg-yellow-500/20 transition-colors"
            aria-label="Dismiss banner"
          >
            <XMarkIcon className="w-5 h-5 text-yellow-700 dark:text-yellow-300" />
          </button>
        </div>
      </div>
    </div>
  );
}
