import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SiLinkedin } from 'react-icons/si';
import { HiOutlineMail } from 'react-icons/hi';
import Navbar from '@/components/landing/navbar';
import Footer from '@/components/landing/footer';

// Team member data
const teamMembers = [
  {
    name: 'Risith Kankanamge',
    role: 'Co-Founder & Lead Full-Stack Developer',
    description:
      'Architected the core platform and proprietary scoring engine. Engineered the browser extension end-to-end and established the web application\'s technical foundation.',
    imageUrl: '/risith-portrait.jpg',
    alt: 'Portrait of Risith Kankanamge',
    linkedin: 'https://www.linkedin.com/in/risithcha',
    email: 'mailto:risithcha@gmail.com',
  },
  {
    name: 'Santhosh Ilaiyaraja',
    role: 'Co-Founder & Lead Interface Architect',
    description:
      'Designs and optimizes the platform\'s visual layer. Oversees interface architecture, component engineering, and end-to-end frontend performance.',
    imageUrl: '/santhosh-portrait.jpg',
    alt: 'Portrait of Santhosh',
    linkedin: 'https://www.linkedin.com/in/santhosh-ilaiyaraja-77871436a',
    email: 'mailto:santhosh.ilaiyaraja21@gmail.com',
  },
  {
    name: 'Ritvik Rajkumar',
    role: 'Co-Founder & Lead Product Engineer',
    description:
      'Drives product vision across user flows and feature design. Focuses on usability, interaction patterns, prototyping, and product flows across React/Tailwind.',
    imageUrl: '/ritvik-portrait.jpg',
    alt: 'Portrait of Ritvik',
    linkedin: 'https://www.linkedin.com/in/ritvik-sujan-rajkumar',
    email: 'mailto:rajkumarritvik1@gmail.com',
  },
];

// Team page
export default function TeamPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      <section className="py-20 sm:py-28">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Meet the Team
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              We are a passionate team dedicated to making a difference.
            </p>
          </div>
          {/* Team member grid (1-3 columns) */}
          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
            {teamMembers.map((member) => (
              <Card
                key={member.name}
                className="flex flex-col items-center overflow-hidden text-center shadow-lg transition-shadow hover:shadow-xl"
              >
                {/* Portrait image */}
                <CardHeader className="p-0 pt-6">
                  <div className="relative w-[150px] h-[150px] mx-auto">
                    <Image
                      src={member.imageUrl}
                      alt={member.alt}
                      fill
                      className="rounded-full object-cover"
                      sizes="150px"
                    />
                  </div>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col p-6">
                  <CardTitle className="text-xl font-bold mb-2">
                    {member.name}
                  </CardTitle>
                  <p className="text-sm font-semibold text-primary mb-3">
                    {member.role}
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {member.description}
                  </p>
                  {/* Contact / Social buttons */}
                  <div className="mt-4 flex items-center justify-center gap-3">
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${member.name} on LinkedIn`}
                      className="inline-flex items-center gap-2 rounded-md border border-border bg-muted px-3 py-2 text-sm font-medium text-foreground hover:bg-muted/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                      <SiLinkedin className="h-5 w-5 text-blue-600" />
                      <span className="hidden sm:inline">LinkedIn</span>
                    </a>

                    <a
                      href={member.email}
                      aria-label={`Email ${member.name}`}
                      className="inline-flex items-center gap-2 rounded-md border border-border bg-muted px-3 py-2 text-sm font-medium text-foreground hover:bg-muted/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                      <HiOutlineMail className="h-5 w-5" />
                      <span className="hidden sm:inline">Email</span>
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
