import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/landing/navbar';
import Footer from '@/components/landing/footer';

// Privacy Policy page
export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="container mx-auto max-w-4xl px-4 py-24">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          EcoVeridian Privacy Policy
        </h1>
        <p className="text-muted-foreground mb-12">
          <em>Last updated: November 27, 2025</em>
        </p>

        <section className="space-y-12 text-foreground">
          {/* Overview */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Overview</h2>
            <p className="leading-relaxed">
              EcoVeridian (&quot;we&quot;, &quot;our&quot;, &quot;the extension&quot;) is committed to protecting your privacy. This policy explains what data we collect, how we use it, and your rights.
            </p>
          </div>

          {/* What Data We Collect */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">What Data We Collect</h2>
            <ul className="list-disc list-inside space-y-2 ml-4 leading-relaxed">
              <li>
                <strong>Domain names:</strong> When you use the EcoVeridian extension, we collect the domain name of the website you are visiting (e.g., &quot;apple.com&quot;) to provide sustainability analysis.
              </li>
              <li>
                <strong>Authentication info:</strong> If you sign in, we store your Google account email and display name for user history and personalization.
              </li>
              <li>
                <strong>Analysis results:</strong> ESG analysis results are cached locally in your browser and on our servers for up to 30 days to improve performance and reduce costs.
              </li>
            </ul>
          </div>

          {/* What We Do NOT Collect */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">What We Do NOT Collect</h2>
            <ul className="list-disc list-inside space-y-2 ml-4 leading-relaxed">
              <li>We do <strong>not</strong> collect your browsing history.</li>
              <li>We do <strong>not</strong> collect page content, passwords, financial, health, or personal communications data.</li>
              <li>We do <strong>not</strong> sell or share your data with third parties for advertising or marketing.</li>
            </ul>
          </div>

          {/* How We Use Data */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">How We Use Data</h2>
            <ul className="list-disc list-inside space-y-2 ml-4 leading-relaxed">
              <li>To provide ESG analysis for the website you request.</li>
              <li>To show your analysis history and statistics (if signed in).</li>
              <li>To improve our service and prevent abuse.</li>
            </ul>
          </div>

          {/* Data Storage */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Data Storage</h2>
            <ul className="list-disc list-inside space-y-2 ml-4 leading-relaxed">
              <li>Analysis results are cached on our servers (Google Cloud/Firebase) for up to 30 days.</li>
              <li>Your authentication info is stored securely and only used for your personal dashboard.</li>
              <li>You can clear your local cache at any time via Chrome&apos;s extension settings.</li>
            </ul>
          </div>

          {/* Third-Party Services */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Third-Party Services</h2>
            <p className="leading-relaxed">
              We use the following services to provide EcoVeridian:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 leading-relaxed">
              <li><strong>Firebase (Google Cloud):</strong> Hosting, authentication, and database.</li>
              <li><strong>OpenAI API:</strong> For ESG analysis (no personal data sent).</li>
              <li><strong>Tavily API:</strong> For sustainability web search (no personal data sent).</li>
            </ul>
          </div>

          {/* Your Rights */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Your Rights</h2>
            <p className="leading-relaxed">
              Under GDPR, CCPA, and other privacy laws, you have the following rights:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 leading-relaxed">
              <li><strong>Right to access:</strong> You can request a copy of your personal data.</li>
              <li><strong>Right to rectification:</strong> You can request correction of inaccurate data.</li>
              <li><strong>Right to erasure:</strong> You may request deletion of your user data by contacting us at{' '}
                <a 
                  href="mailto:ecoveridian@gmail.com" 
                  className="text-primary hover:underline"
                >
                  ecoveridian@gmail.com
                </a>.
              </li>
              <li><strong>Right to data portability:</strong> You can request your data in a portable format.</li>
              <li><strong>Right to object:</strong> You can object to certain processing activities.</li>
              <li>You may uninstall the extension at any time to remove all local data.</li>
            </ul>
          </div>

          {/* Children's Privacy */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Children&apos;s Privacy</h2>
            <p className="leading-relaxed">
              EcoVeridian does not knowingly collect any information from children under 13. If you believe your child has provided us with personal information, contact us and we will promptly delete it.
            </p>
          </div>

          {/* Data Retention */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Data Retention</h2>
            <p className="leading-relaxed">
              We retain your data for the following periods:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 leading-relaxed">
              <li><strong>Analysis cache:</strong> Up to 30 days, then automatically deleted.</li>
              <li><strong>User account data:</strong> Until you request deletion or delete your account.</li>
              <li><strong>Authentication logs:</strong> Up to 90 days for security purposes.</li>
            </ul>
          </div>

          {/* International Data Transfers */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">International Data Transfers</h2>
            <p className="leading-relaxed">
              Your data may be transferred to and processed in countries outside your country of residence. We ensure that such transfers comply with applicable data protection laws and use appropriate safeguards, including Standard Contractual Clauses approved by the European Commission.
            </p>
          </div>

          {/* Security */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Security</h2>
            <p className="leading-relaxed">
              We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. This includes encryption, secure authentication, and regular security audits.
            </p>
          </div>

          {/* Changes to This Policy */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Changes to This Policy</h2>
            <p className="leading-relaxed">
              We may update this policy from time to time. The latest version will always be available at{' '}
              <a 
                href="https://ecoveridian.org/privacy" 
                className="text-primary hover:underline"
              >
                https://ecoveridian.org/privacy
              </a>. Material changes will be communicated via email to registered users.
            </p>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Contact</h2>
            <p className="leading-relaxed">
              Questions about this privacy policy? Contact us at:{' '}
              <a 
                href="mailto:ecoveridian@gmail.com" 
                className="text-primary hover:underline"
              >
                ecoveridian@gmail.com
              </a>
            </p>
            <p className="leading-relaxed mt-4">
              For general support inquiries, please email{' '}
              <a 
                href="mailto:ecoveridian@gmail.com" 
                className="text-primary hover:underline"
              >
                ecoveridian@gmail.com
              </a>
            </p>
          </div>

          {/* Supervisory Authority */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Supervisory Authority</h2>
            <p className="leading-relaxed">
              If you are located in the European Economic Area (EEA) and believe we have not addressed your concerns adequately, you have the right to lodge a complaint with your local data protection supervisory authority.
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
