import Link from 'next/link';
import Navbar from '@/components/landing/navbar';
import Footer from '@/components/landing/footer';
import { Button } from '@/components/ui/button';
import { Changelog } from '@/components/ui/timeline';

const timelineData = [
  {
    title: 'v2.1.0',
    content: (
      <div className="space-y-4 text-foreground/90">
        <div className="space-y-2">
          <p className="text-sm md:text-base text-muted-foreground">Major dashboard revamp with comprehensive Environmental Risk Reports and improved user experience.</p>
          <ul className="list-disc list-inside text-sm md:text-base text-muted-foreground space-y-1">
            <li>Introduced detailed Environmental Risk Reports with 4-section layout: Company overview, GreenScore breakdown, Findings summary, and Articles table.</li>
            <li>Added clickable reports in Analysis History that open full environmental risk details with scores, key articles, and insights.</li>
            <li>Moved stats cards (Total Sites Analyzed, Average Eco Score, High Score Sites) from Activity History to Account Settings.</li>
            <li>Simplified Analysis History table to show Reports and Date columns only.</li>
            <li>Updated FAQ section with comprehensive answers about GreenScore calculation, browser support, and getting started.</li>
            <li>Added YouGov quote with animated purple wave effect to the footer.</li>
            <li>Firefox browser support now fully documented in FAQ.</li>
          </ul>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs md:text-sm text-muted-foreground">Dec 23, 2025</span>
        </div>
      </div>
    ),
  },
  {
    title: 'v2.0.0',
    content: (
      <div className="space-y-4 text-foreground/90">
        <div className="space-y-2">
          <p className="text-sm md:text-base text-muted-foreground">Major release bringing full cross-browser support to Firefox and other Chromium-based browsers.</p>
          <ul className="list-disc list-inside text-sm md:text-base text-muted-foreground space-y-1">
            <li>Added full Firefox support via Mozilla AMO.</li>
            <li>Extension now works on Chrome, Firefox, Edge, Brave, Vivaldi, and other Chromium-based browsers.</li>
            <li>User data and authentication history carry over seamlessly when switching browsers.</li>
          </ul>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="https://risithcha.com/blog/ecoveridian-for-firefox"
            target="_blank"
            rel="noreferrer"
            className="inline-flex"
          >
            <Button size="sm" className="rounded-full px-4">Read the deep dive</Button>
          </Link>
          <span className="text-xs md:text-sm text-muted-foreground">Dec 22, 2025</span>
        </div>
      </div>
    ),
  },
  {
    title: 'v1.2.1',
    content: (
      <div className="space-y-4 text-foreground/90">
        <div className="space-y-2">
          <p className="text-sm md:text-base text-muted-foreground">Patch release with minor UI improvements and bug fixes.</p>
          <ul className="list-disc list-inside text-sm md:text-base text-muted-foreground space-y-1">
            <li>Added EarthGen logo next to the EarthGen WSTA Youth Panel event title.</li>
            <li>Linked EarthGen logo to earthgenwa.org website.</li>
            <li>Enhanced event card hover animation with subtle scale and shadow effects.</li>
            <li>Fixed build error caused by unused variable in EventCard component.</li>
          </ul>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs md:text-sm text-muted-foreground">Dec 19, 2025</span>
        </div>
      </div>
    ),
  },
  {
    title: 'v1.2.0',
    content: (
      <div className="space-y-4 text-foreground/90">
        <div className="space-y-2">
          <p className="text-sm md:text-base text-muted-foreground">Minor release adding new pages, events, and UI enhancements.</p>
          <ul className="list-disc list-inside text-sm md:text-base text-muted-foreground space-y-1">
            <li>Added Events page to showcase recent and upcoming EcoVeridian activities.</li>
            <li>Added the first EarthGen WSTA Youth Panel event to the Events page.</li>
            <li>Added email, Instagram, and LinkedIn icons to the footer for contact and social links.</li>
            <li>Updated section titles across the site for improved clarity and consistency.</li>
            <li>Implemented legal agreement modal system that blocks access until users accept updated Terms of Service or Privacy Policy.</li>
            <li>Added configurable legal document versioning system for easy management of policy updates.</li>
          </ul>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs md:text-sm text-muted-foreground">Dec 19, 2025</span>
        </div>
      </div>
    ),
  },
  {
    title: 'v1.1.0',
    content: (
      <div className="space-y-4 text-foreground/90">
        <div className="space-y-2">
          <p className="text-sm md:text-base text-muted-foreground">New minor release adding features and fixes.</p>
          <ul className="list-disc list-inside text-sm md:text-base text-muted-foreground space-y-1">
            <li>Added Google Sign-In to the dashboard.</li>
            <li>Added a dedicated Changelog page to surface releases and launch notes.</li>
            <li>Improved header/navigation: centered tubelight-style nav pill and better responsive behavior.</li>
            <li>Fixed dashboard auth persistence bug. Users no longer get logged out when exiting the dashboard.</li>
          </ul>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs md:text-sm text-muted-foreground">Dec 18, 2025</span>
        </div>
      </div>
    ),
  },
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
          <Link
            href="https://risithcha.com/blog/building-ecoveridian-v100"
            target="_blank"
            rel="noreferrer"
            className="inline-flex"
          >
            <Button size="sm" className="rounded-full px-4">Read the launch note</Button>
          </Link>
          <span className="text-xs md:text-sm text-muted-foreground">Dec 2, 2025</span>
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
