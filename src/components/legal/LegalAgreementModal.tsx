'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LEGAL_VERSIONS } from '@/lib/legal-config';
import { useAuth } from '@/contexts/AuthContext';

// Routes where the legal agreement modal should be shown
const PROTECTED_ROUTES = ['/dashboard'];

export default function LegalAgreementModal() {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const [pendingAgreement, setPendingAgreement] = useState<{
    type: 'terms' | 'privacy';
    version: string;
  } | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Check if current route is protected
  const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route));

  useEffect(() => {
    // Only check legal agreements if:
    // 1. User is authenticated
    // 2. Loading is complete
    // 3. User is on a protected route
    if (!loading && user && isProtectedRoute) {
      checkLegalAgreements();
    }
  }, [user, loading, isProtectedRoute]);

  const checkLegalAgreements = () => {
    const storedTermsVersion = localStorage.getItem('agreedTermsVersion');
    const storedPrivacyVersion = localStorage.getItem('agreedPrivacyVersion');

    // Check if user needs to agree to updated terms
    if (storedTermsVersion !== LEGAL_VERSIONS.terms) {
      setPendingAgreement({
        type: 'terms',
        version: LEGAL_VERSIONS.terms,
      });
      setIsOpen(true);
      return;
    }

    // Check if user needs to agree to updated privacy policy
    if (storedPrivacyVersion !== LEGAL_VERSIONS.privacy) {
      setPendingAgreement({
        type: 'privacy',
        version: LEGAL_VERSIONS.privacy,
      });
      setIsOpen(true);
      return;
    }
  };

  const handleAccept = () => {
    if (!pendingAgreement) return;

    // Store the agreed version
    if (pendingAgreement.type === 'terms') {
      localStorage.setItem('agreedTermsVersion', LEGAL_VERSIONS.terms);
    } else {
      localStorage.setItem('agreedPrivacyVersion', LEGAL_VERSIONS.privacy);
    }

    // Check for other pending agreements
    const storedTermsVersion = localStorage.getItem('agreedTermsVersion');
    const storedPrivacyVersion = localStorage.getItem('agreedPrivacyVersion');

    if (storedTermsVersion === LEGAL_VERSIONS.terms && storedPrivacyVersion === LEGAL_VERSIONS.privacy) {
      setIsOpen(false);
      setPendingAgreement(null);
    } else {
      // Continue checking other agreements
      checkLegalAgreements();
    }
  };

  const handleReject = () => {
    // User must agree to continue using the dashboard
    window.location.href = '/';
  };

  // Only show modal if:
  // 1. User is logged in
  // 2. User is on a protected route
  // 3. There's a pending agreement
  if (!user || !isProtectedRoute || !isOpen || !pendingAgreement) {
    return null;
  }

  const isTerms = pendingAgreement.type === 'terms';
  const documentName = isTerms ? 'Terms of Service' : 'Privacy Policy';
  const documentPath = isTerms ? '/terms' : '/privacy';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-background border border-border rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="sticky top-0 bg-background border-b border-border px-6 py-4">
          <h2 className="text-2xl font-bold text-foreground">
            {documentName} Updated
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            We've updated our {documentName.toLowerCase()} (v{pendingAgreement.version}). Please review and accept to continue using EcoVeridian.
          </p>
        </div>

        <div className="px-6 py-4 space-y-4">
          <div className="bg-muted/50 rounded-lg p-4 border border-border">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Our {documentName.toLowerCase()} has been updated to better serve you and ensure transparency. Please take a moment to review the changes.
            </p>
          </div>

          <div className="flex items-center justify-center py-4">
            <Link href={documentPath} target="_blank" rel="noreferrer">
              <Button variant="outline" className="rounded-full">
                Read {documentName}
              </Button>
            </Link>
          </div>
        </div>

        <div className="sticky bottom-0 bg-background border-t border-border px-6 py-4 flex gap-3 justify-end">
          <Button
            variant="outline"
            onClick={handleReject}
            className="rounded-full"
          >
            Decline
          </Button>
          <Button
            onClick={handleAccept}
            className="rounded-full bg-primary hover:bg-primary/90"
          >
            I Agree
          </Button>
        </div>
      </div>
    </div>
  );
}
