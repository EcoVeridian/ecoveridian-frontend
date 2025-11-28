'use client';

import { useEffect, useRef, useState } from 'react';
import {
  GlobeAltIcon,
  SunIcon,
  MagnifyingGlassIcon,
  LightBulbIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  CloudIcon,
} from '@heroicons/react/24/outline';

// Wave animation component with circular icons
export default function IconWave() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [wavePhase, setWavePhase] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const animationFrameRef = useRef<number>();

  // Icons to display in the wave
  const icons = [
    CloudIcon,
    GlobeAltIcon,
    SunIcon,
    MagnifyingGlassIcon,
    LightBulbIcon,
    ShieldCheckIcon,
    ChartBarIcon,
    ShieldCheckIcon,
    CloudIcon,
    GlobeAltIcon,
    SunIcon,
    MagnifyingGlassIcon,
  ];

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate scroll progress (0 to 1) based on element visibility
      const elementCenter = rect.top + rect.height / 2;
      const progress = 1 - Math.abs(elementCenter - windowHeight / 2) / (windowHeight / 2);
      
      setScrollProgress(Math.max(0, Math.min(1, progress)));
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth animation loop
  useEffect(() => {
    let lastTime = 0;
    
    const animate = (currentTime: number) => {
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;
      
      setWavePhase((prev) => prev + deltaTime * 0.001);
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    animationFrameRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <section className="relative w-full py-32 overflow-hidden">
      {/* Hero text above icon wave */}
      <div className="container px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-16 mx-auto lg:ml-12 lg:mx-0">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight leading-relaxed">
            {isMounted ? (
              (() => {
                const text = 'EcoVeridian is our next-generation eco-innovation hub, shaping how communities build a greener future.';
                const words = text.split(' ');
                let charIndex = 0;
                
                return words.map((word, wordIndex) => (
                  <span key={wordIndex} className="inline-block whitespace-nowrap">
                    {word.split('').map((char) => {
                      const currentIndex = charIndex++;
                      return (
                        <span
                          key={currentIndex}
                          className="animate-letter-wave inline-block"
                          style={{
                            animationDelay: `${currentIndex * 0.03}s`,
                          }}
                        >
                          {char}
                        </span>
                      );
                    })}
                    {wordIndex < words.length - 1 && (
                      <span className="inline-block">&nbsp;</span>
                    )}
                  </span>
                ));
              })()
            ) : (
              'EcoVeridian is our next-generation eco-innovation hub, shaping how communities build a greener future.'
            )}
          </h2>
        </div>
      </div>

      {/* Icon wave container */}
      <div 
        ref={containerRef}
        className="relative w-full h-48 overflow-hidden flex items-center justify-center"
      >
        <div className="relative w-full max-w-6xl h-full flex items-center justify-center">
          {icons.map((Icon, index) => {
          const totalIcons = icons.length;
          const position = index / (totalIcons - 1); // 0 to 1
          
          // Create wave effect with sine wave
          const waveOffset = isMounted ? Math.sin(position * Math.PI * 2 + wavePhase * 1.2) * 35 : 0;
          
          // Arc positioning (slight curve)
          const arcHeight = 25;
          const arcOffset = isMounted ? Math.sin(position * Math.PI) * arcHeight : 0;
          
          // Fade based on scroll and position
          const centerDistance = Math.abs(position - 0.5) * 2; // 0 at center, 1 at edges
          const fadeAmount = 1 - centerDistance * 0.2;
          const opacity = isMounted ? scrollProgress * fadeAmount : 0;
          
          // Scale variation with subtle pulse
          const scale = isMounted ? 0.9 + Math.sin(position * Math.PI * 2 + wavePhase * 1.2) * 0.1 : 0.9;

          return (
            <div
              key={index}
              className="icon-wave-item absolute will-change-transform"
              style={{
                left: `${position * 90 + 5}%`,
                transform: `translateX(-50%) translateY(${waveOffset - arcOffset}px) scale(${scale})`,
                opacity: opacity,
              }}
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-background/80 backdrop-blur-sm border-2 border-primary/20 shadow-[0_8px_16px_rgba(0,0,0,0.1)] flex items-center justify-center transition-all duration-300 ease-out hover:border-primary/50 hover:scale-110 hover:shadow-[0_12px_24px_rgba(99,102,241,0.2)]">
                <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
              </div>
            </div>
          );
        })}
        </div>
      </div>
    </section>
  );
}
