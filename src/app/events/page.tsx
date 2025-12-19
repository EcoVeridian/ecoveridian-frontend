import Navbar from '@/components/landing/navbar';
import Footer from '@/components/landing/footer';
import { Calendar, MapPin, Clock } from 'lucide-react';

const eventsData = [
  {
    title: 'EcoVeridian Launch Event',
    date: 'December 2025',
    time: 'TBD',
    location: 'Virtual',
    description: 'Join us for the official launch of EcoVeridian! Learn about our mission to make sustainable shopping easier and how our browser extension helps you make eco-friendly choices.',
    upcoming: true,
  },
];

export const metadata = {
  title: 'Events | EcoVeridian',
  description: 'Upcoming events and meetups from EcoVeridian.',
};

export default function EventsPage() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      <Navbar />
      <section className="pt-28 pb-10">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">Events</h1>
          <p className="text-muted-foreground text-center mb-12 text-lg">
            Stay updated with our recent events, webinars, and upcoming activites.
          </p>
          
          <div className="space-y-6">
            {eventsData.map((event, index) => (
              <div
                key={index}
                className="border border-border rounded-xl p-6 bg-card hover:border-primary/50 transition-colors"
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
                    <h2 className="text-xl md:text-2xl font-semibold">{event.title}</h2>
                    <p className="text-muted-foreground">{event.description}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
