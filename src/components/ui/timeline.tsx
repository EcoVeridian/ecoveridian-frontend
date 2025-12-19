"use client";

import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

interface ChangelogEntry {
  title: string;
  content: React.ReactNode;
}

interface ChangelogProps {
  data: ChangelogEntry[];
}

export function Changelog({ data }: ChangelogProps) {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, []);

  // Keep measured height in sync with layout changes
  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const ro = new ResizeObserver((entries) => {
      const cr = entries[0]?.contentRect;
      if (cr) setHeight(cr.height);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const { scrollYProgress } = useScroll({
    // Track the inner timeline block as it moves through the viewport
    target: ref,
    // Start when the top of the timeline reaches 10% down the viewport,
    // end when the bottom reaches the bottom of the viewport.
    // This preserves natural scroll pacing but guarantees reaching 1.0 at the end.
    offset: ['start', 'end'],
  });

  // Keep the motion subscription consistent across renders
  useMotionValueEvent(scrollYProgress, 'change', () => {});

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div ref={containerRef} className="w-full font-sans md:px-10 bg-transparent">
      <div className="max-w-6xl mx-auto py-16 px-4 md:px-8 lg:px-10">
        <h2 className="text-2xl md:text-4xl mb-3 text-foreground">Product changelog</h2>
        <p className="text-muted-foreground text-sm md:text-base max-w-xl">
          Key releases and changelog entries as we grow EcoVeridian.
        </p>
      </div>

      <div ref={ref} className="relative max-w-6xl mx-auto pb-16">
        {data.map((item, index) => (
          <div key={index} className="flex justify-start pt-10 md:pt-28 md:gap-10">
            <div className="sticky flex flex-col md:flex-row z-40 items-center top-32 self-start max-w-xs lg:max-w-sm md:w-full">
              <div className="h-10 absolute left-3 md:left-3 w-10 rounded-full bg-background flex items-center justify-center">
                <div className="h-4 w-4 rounded-full bg-muted border border-border" />
              </div>
              <h3 className="hidden md:block text-xl md:pl-20 md:text-4xl font-bold text-muted-foreground">
                {item.title}
              </h3>
            </div>

            <div className="relative pl-20 pr-4 md:pl-4 w-full">
              <h3 className="md:hidden block text-2xl mb-3 text-left font-bold text-muted-foreground">
                {item.title}
              </h3>
              {item.content}
            </div>
          </div>
        ))}

        <div
          style={{ height: `${height}px` }}
          className="absolute md:left-8 left-8 top-0 overflow-hidden w-[2px] bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-border to-transparent to-[99%] [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)]"
        >
          <motion.div
            style={{ height: heightTransform, opacity: opacityTransform }}
            className="absolute inset-x-0 top-0 w-[2px] bg-gradient-to-t from-primary via-primary/70 to-transparent from-[0%] via-[10%] rounded-full"
          />
        </div>
      </div>
    </div>
  );
}
