import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/landing/navbar';
import Footer from '@/components/landing/footer';

// Legal information page
export default function LegalPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="container mx-auto max-w-4xl px-4 py-24">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-12">
          Legal Information
        </h1>

        <section className="space-y-12">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Copyright Notice</h2>
            <p className="text-muted-foreground leading-relaxed">
              EcoVeridian Website
              <br />
              Copyright &copy; {new Date().getFullYear()} EcoVeridian
              <br />
              All rights reserved.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Terms of Use</h2>
            <p className="text-muted-foreground leading-relaxed">
              This website and its content are proprietary to EcoVeridian. Unauthorized copying, distribution, or modification of any part of this website is strictly prohibited.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Contact</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have questions or need additional information, please contact us at{' '}
              <a
                href="mailto:ecoveridian@gmail.com"
                className="underline hover:text-foreground transition-colors"
              >
                ecoveridian@gmail.com
              </a>
              .
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
