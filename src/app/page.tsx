import Navbar from '@/components/landing/navbar';
import Hero from '@/components/landing/hero';
import IconWave from '@/components/landing/icon-wave';
import UseCaseSelector from '@/components/landing/use-case-selector';
import Features from '@/components/landing/features';
import GridSection from '@/components/landing/grid-section';
import Footer from '@/components/landing/footer';

// Main landing page
export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      <Navbar />
      <Hero />
      <IconWave />
      <UseCaseSelector />
      <Features />
      <GridSection />
      <Footer />
    </main>
  );
}
