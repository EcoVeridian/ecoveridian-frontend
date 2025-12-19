import Navbar from '@/components/landing/navbar';
import Footer from '@/components/landing/footer';
import { Changelog } from '@/components/ui/timeline';

const timelineData = [
  {
    title: 'v1.0.0',
    content: (
      <div className="space-y-4 text-foreground/90">
        <div className="space-y-2">
          <p className="text-sm md:text-base text-muted-foreground">
            Initial public launch of the EcoVeridian browser extension with sustainability scores on product pages, email verification, and dashboard basics.
          </p>
          <ul className="list-disc list-inside text-sm md:text-base text-muted-foreground space-y-1">
            <li>Real-time product impact badges</li>
            <li>Email-based onboarding and authentication</li>
            <li>Personal dashboard with activity history</li>
          </ul>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs md:text-sm text-muted-foreground">Dec 2025</span>
        </div>
      </div>
    ),
  },
];

export const metadata = {
  title: 'Changelog | EcoVeridian',
  description: 'Product releases and milestones for EcoVeridian.',
};
export default function ChangelogPage() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      <Navbar />
      <section className="pt-28 pb-10">
        <div className="container mx-auto px-4">
          <Changelog data={timelineData} />
        </div>
      </section>
      <Footer />
    </main>
  );
}
