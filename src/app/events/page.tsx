'use client';

import Navbar from '@/components/landing/navbar';
import Footer from '@/components/landing/footer';
import { Calendar, MapPin, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const eventsData = [
  {
    title: 'EarthGen WSTA Youth Climate Panel',
    date: 'December 2025',
    time: 'N/A',
    location: 'University of Washington, Tacoma: 1900 Commerce St, Tacoma, WA 98402',
    description: 'During the EarthGen Youth Climate Panel at the Washington Science Teachers Association (WSTA) Science Education Conference, EcoVeridian was highlighted as a student-led nonprofit resource for data-driven sustainability. Panelists shared strategies for supporting youth climate action, resilience, and wellbeing, and EcoVeridian was showcased as a tool that educators and students can use to access transparent ESG data, scientific sources, and sustainability insights to support evidence-based climate learning and youth-led environmental initiatives.',
    upcoming: false,
    images: [
      '/events/earthgenfirst.jpg',
      '/events/earthgensecond.jpg',
    ],
    articleLink: 'https://earthgenwa.org/news/washington-students-share-climate-perspectives-with-educators/',
  },
];

function EventCard({ event }: { event: typeof eventsData[0] }) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <div
      ref={ref}
      className={`border border-border rounded-2xl p-6 bg-card transition-all duration-300 hover:scale-[1.03] hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/20 hover:border-primary/50 ${
        isVisible ? 'scroll-animate-visible' : 'scroll-animate'
      }`}
    >
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div className="space-y-3 flex-1">
          <div className="flex items-center gap-2">
            {event.upcoming && (
              <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded-full">
                Upcoming
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl md:text-2xl font-semibold">
              <a
                href="https://www.wsta.net/2025Conference"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                {event.title}
              </a>
            </h2>
            {event.title === 'EarthGen WSTA Youth Climate Panel' && (
              <a
                href="https://earthgenwa.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity"
              >
                <Image
                  src="/events/earthgenlogo.png"
                  alt="EarthGen Logo"
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </a>
            )}
          </div>
          <p className="text-muted-foreground">{event.description}</p>
          
          {event.images && event.images.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
              {event.images.map((image, imgIndex) => (
                <div key={imgIndex} className="relative aspect-video rounded-lg overflow-hidden bg-muted border border-border hover:border-primary/50 transition-colors">
                  <Image
                    src={image}
                    alt={`${event.title} - Image ${imgIndex + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
              {event.articleLink && (
                <a
                  href={event.articleLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative aspect-video rounded-lg overflow-hidden bg-muted flex items-center justify-center border border-border hover:border-primary/50 transition-colors group"
                >
                  <Image
                    src="/events/earthgenthird.png"
                    alt="Article background"
                    fill
                    className="object-cover opacity-50 group-hover:opacity-70 transition-opacity"
                  />
                  <div className="relative z-10 flex flex-col items-center gap-2 text-foreground group-hover:text-primary transition-colors">
                    <ExternalLink className="w-8 h-8" />
                    <span className="text-sm font-medium">Read Article</span>
                  </div>
                </a>
              )}
            </div>
          )}
          
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <span>{event.date}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              <span>{event.location}</span>
              <span className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-2a4 4 0 014-4h10a4 4 0 014 4v2M16 3.13a4 4 0 010 7.75M12 7v4m0 0v4m0-4h4m-4 0H8" /></svg>
                <span>Washington Science Teachers Association</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EventsPage() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      <Navbar />
      <section className="pt-28 pb-10">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">Events</h1>
          <p className="text-muted-foreground text-center mb-12 text-lg">
            Discover our recent events, panels, and initiatives advancing data-driven sustainability.
          </p>
          
          <div className="space-y-6">
            {eventsData.map((event, index) => (
              <EventCard key={index} event={event} />
            ))}
          </div>

          {eventsData.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <p>No events scheduled at the moment. Check back soon!</p>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}
