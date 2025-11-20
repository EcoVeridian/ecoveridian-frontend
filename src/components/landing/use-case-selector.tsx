'use client';

import { useState } from 'react';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { faqs } from '@/lib/data';

// FAQ section with interactive sidebar layout
export default function UseCaseSelector() {
  // Track selected FAQ index
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <section className="py-20 sm:py-28">
      <div className="container">
        {/* Section heading */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Common Questions
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Have questions? We&apos;ve got answers. If you can&apos;t find what you&apos;re
            looking for, feel free to contact us.
          </p>
        </div>

        {/* Two-column layout - questions left, answer right */}
        <div className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left sidebar - Question list */}
          <div className="lg:col-span-1 space-y-2">
            {faqs.map((faq, index) => (
              <button
                key={index}
                onClick={() => setSelectedIndex(index)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                  selectedIndex === index
                    ? 'bg-primary text-primary-foreground font-medium'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
              >
                {faq.question}
              </button>
            ))}
          </div>

          {/* Right panel - Selected answer */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-border bg-secondary/20 p-8">
              {/* Answer label */}
              <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
                <CheckCircleIcon className="w-5 h-5" />
                ANSWER
              </div>
              {/* Selected question */}
              <h3 className="text-2xl font-bold mb-4">
                {faqs[selectedIndex].question}
              </h3>
              {/* Selected answer */}
              <p className="text-muted-foreground leading-relaxed text-lg">
                {faqs[selectedIndex].answer}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
