import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/landing/navbar';
import Footer from '@/components/landing/footer';

// Terms of Service page
export default function TermsPage() {
  const currentYear = new Date().getFullYear();
  const lastUpdated = 'December 19, 2025';

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="container mx-auto max-w-4xl px-4 py-24">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Terms of Service
          </h1>
          <p className="text-muted-foreground">
            Last updated: {lastUpdated}
          </p>
        </div>

        <section className="space-y-8 text-muted-foreground leading-relaxed">
          {/* 1. Acceptance of Terms */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">1. Acceptance of Terms</h2>
            <p>
              These Terms of Service ("Terms") constitute a legal agreement between you and EcoVeridian ("Company", "we", "us", or "our"). By accessing, browsing, or using our website and services, you agree to be bound by these Terms. If you do not agree to any part of these Terms, you are not authorized to use our services.
            </p>
          </div>

          {/* 2. Use License */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">2. Use License</h2>
            <p>
              We grant you a limited, non-exclusive, non-transferable, and revocable license to access and use our website and services for personal, non-commercial purposes. You may not:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Modify or copy our materials</li>
              <li>Use materials for commercial purpose or for any public display</li>
              <li>Attempt to decompile or reverse engineer any software contained on the website</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
              <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
              <li>Use the website for any unlawful purpose or in violation of any applicable laws</li>
              <li>Engage in any conduct that restricts or inhibits anyone's use or enjoyment of the website</li>
            </ul>
          </div>

          {/* 3. Disclaimer of Warranties */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">3. Disclaimer of Warranties</h2>
            <p>
              The materials on EcoVeridian's website are provided on an 'as is' basis. EcoVeridian makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
            <p>
              Further, EcoVeridian does not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on the Internet or relating to such materials or on any sites linked to this site.
            </p>
          </div>

          {/* 4. Limitations of Liability */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">4. Limitations of Liability</h2>
            <p>
              In no event shall EcoVeridian or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on EcoVeridian's website, even if EcoVeridian or an authorized representative has been notified orally or in writing of the possibility of such damage.
            </p>
          </div>

          {/* 5. Accuracy of Materials */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">5. Accuracy of Materials</h2>
            <p>
              The materials appearing on EcoVeridian's website could include technical, typographical, or photographic errors. EcoVeridian does not warrant that any of the materials on the website are accurate, complete, or current. EcoVeridian may make changes to the materials contained on its website at any time without notice.
            </p>
          </div>

          {/* 6. Materials and Content */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">6. Materials and Content</h2>
            <p>
              The materials on EcoVeridian's website are protected by copyright law and are the exclusive property of EcoVeridian or the material creators indicated on the website. You are prohibited from modifying, printing, publishing, transmitting, transferring, selling, trading or exploiting any content, in whole or in part, without the express written consent of EcoVeridian.
            </p>
          </div>

          {/* 7. Links */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">7. Links</h2>
            <p>
              EcoVeridian has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by EcoVeridian of the site. Use of any such linked website is at the user's own risk.
            </p>
          </div>

          {/* 8. Modifications */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">8. Modifications</h2>
            <p>
              EcoVeridian may revise these terms of service for its website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.
            </p>
          </div>

          {/* 9. Governing Law */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">9. Governing Law</h2>
            <p>
              These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction in which EcoVeridian operates, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
            </p>
          </div>

          {/* 10. User Accounts */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">10. User Accounts</h2>
            <p>
              If you create an account on our website, you are responsible for maintaining the confidentiality of your account information and password. You agree to accept responsibility for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account.
            </p>
          </div>

          {/* 11. User Conduct */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">11. User Conduct</h2>
            <p>
              You agree not to use the website in any manner that could damage, disable, overburden, or impair our servers or networks. You further agree not to attempt unauthorized access, engage in any form of harassment, or use the service for any illegal purposes.
            </p>
          </div>

          {/* 12. Intellectual Property Rights */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">12. Intellectual Property Rights</h2>
            <p>
              All content included in or made available through the website, including but not limited to text, graphics, logos, images, and software, is the property of EcoVeridian or its content suppliers and is protected by international copyright laws.
            </p>
            <p>
              Copyright &copy; {currentYear} EcoVeridian. All rights reserved.
            </p>
          </div>

          {/* 13. Limitation Period */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">13. Limitation Period</h2>
            <p>
              Any claim or cause of action arising out of or related to use of the website must be filed within one year after such claim or cause of action arose, or the claim is forever barred.
            </p>
          </div>

          {/* 14. Severability */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">14. Severability</h2>
            <p>
              If any provision of these Terms is found to be invalid or unenforceable, that provision will be modified to the minimum extent necessary to make it valid and enforceable, or if such modification is not possible, the provision will be severed, and the remaining provisions will remain in full force and effect.
            </p>
          </div>

          {/* 15. Contact Information */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">15. Contact Information</h2>
            <p>
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <p className="font-semibold">EcoVeridian</p>
              <p>
                Email:{' '}
                <a
                  href="mailto:ecoveridian@gmail.com"
                  className="underline hover:text-foreground transition-colors"
                >
                  ecoveridian@gmail.com
                </a>
              </p>
            </div>
          </div>

          {/* 16. Entire Agreement */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">16. Entire Agreement</h2>
            <p>
              These Terms of Service, along with our Privacy Policy, constitute the entire agreement between you and EcoVeridian regarding the use of the website and supersede all prior agreements and understandings.
            </p>
          </div>
        </section>

        <div className="mt-16">
          <Link href="/">
            <Button variant="outline" className="rounded-full">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
      <Footer />
    </main>
  );
}
