'use client';

import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

// Journal section with blog cards inspired by Antigravity design
export default function Journal() {
  const { ref, isVisible } = useScrollAnimation();

  const journalEntries = [
    {
      title: "Building EcoVeridian v1.0.0",
      date: "Nov 27, 2025",
      category: "Product",
      description: "The journey of building EcoVeridian from concept to reality.",
      image: "/journal/journey.png",
      link: "https://risithcha.com/blog/building-ecoveridian-v100",
      external: true,
    },
    // Placeholder for future changelog entry
    {
      title: "Changelog",
      date: "Coming Soon",
      category: "Updates",
      description: "Stay tuned for updates and new features.",
      image: "/journal/changelog.png",
      link: "#",
      external: false,
    },
  ];

  return (
    <section className="py-20 sm:py-28 bg-secondary/20">
      <div className="container">
        {/* Section heading */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Journal
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Insights, updates, and stories from the EcoVeridian team.
          </p>
        </div>

        {/* Journal cards grid */}
        <div
          ref={ref}
          className={`mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 ${
            isVisible ? 'scroll-animate-visible' : 'scroll-animate'
          }`}
        >
          {journalEntries.map((entry, index) => (
            <a
              key={index}
              href={entry.link}
              target={entry.external ? "_blank" : undefined}
              rel={entry.external ? "noopener noreferrer" : undefined}
              className="group block"
            >
              <div className="rounded-2xl border border-border bg-background overflow-hidden transition-all duration-300 eco-card-hover h-full flex flex-col">
                {/* Image placeholder */}
                <div className="aspect-video bg-gradient-to-br from-primary/20 via-primary/10 to-secondary relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Image
                      src="/logo.svg"
                      alt="EcoVeridian Logo"
                      width={120}
                      height={120}
                      className="opacity-30"
                    />
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                      {entry.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {entry.date} · {entry.category}
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      {entry.description}
                    </p>
                  </div>
                  
                  {/* Read more link */}
                  <div className="mt-4 flex items-center gap-2 text-sm font-medium text-primary group-hover:gap-3 transition-all">
                    Read {entry.external ? 'blog' : 'more'}
                    <ArrowRightIcon className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
