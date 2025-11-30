'use client';

import { ChatBubbleLeftEllipsisIcon } from '@heroicons/react/24/outline';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

// Community reviews section with grid layout (placeholder)
export default function GridSection() {
  const placeholderReviews = [
    {
      text: '"EcoVeridian helped me track my carbon footprint for my environmental science class project. The insights were easy to understand, and I actually learned ways to make a difference in my daily life. It\'s way more engaging than just reading about climate change in a textbook."',
      author: 'Emily Lu',
      role: 'High School Student',
    },
    {
      text: '"I\'m using EcoVeridian data for my undergraduate research on urban sustainability patterns. The platform makes it simple to collect and analyze personal environmental impact data. It\'s been instrumental in helping me gather real-world insights for my thesis."',
      author: 'James Rodriguez',
      role: 'Undergraduate Researcher',
    },
    {
      text: '"As a small business owner, I wanted to reduce our environmental impact without breaking the bank. EcoVeridian showed us exactly where we could make changes that both help the planet and save money. Our customers love that we\'re tracking and improving our sustainability."',
      author: 'Sarah Mitchell',
      role: 'Small Business Owner',
    },
  ];

  return (
    <section className="py-20 sm:py-28">
      <div className="container">
        {/* Section heading */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
            Community Reviews
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-2 text-muted-foreground">
            <ChatBubbleLeftEllipsisIcon className="w-4 h-4 flex-shrink-0" />
            <span>Hear from our community members making a difference</span>
          </div>
        </div>

        {/* Review cards grid (1-2-3 columns) */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {placeholderReviews.map((review, index) => (
            <ReviewCard key={index} review={review} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ReviewCard({
  review,
  index,
}: {
  review: { text: string; author: string; role: string };
  index: number;
}) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });
  const delays = ['animate-delay-100', 'animate-delay-200', 'animate-delay-300'];

  return (
    <div
      ref={ref}
      className={`p-8 rounded-2xl border border-border bg-background/50 eco-card-hover ${
        isVisible ? `scroll-animate-visible ${delays[index % 3]}` : 'scroll-animate'
      }`}
    >
      {/* Review text */}
      <p className="text-muted-foreground mb-6 leading-relaxed italic">
        {review.text}
      </p>
      {/* Author info */}
      <div className="border-t border-border pt-4">
        <p className="font-medium text-sm">{review.author}</p>
        <p className="text-xs text-muted-foreground">{review.role}</p>
      </div>
    </div>
  );
}
