'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  hue: number;
}

// OPTION 2: Flowing wave with cursor attraction and color variation
export default function InteractiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    // Initialize particles
    const initParticles = () => {
      particlesRef.current = [];
      const numParticles = Math.floor((canvas.width * canvas.height) / 7000); // High density

      for (let i = 0; i < numParticles; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        particlesRef.current.push({
          x,
          y,
          baseX: x,
          baseY: y,
          vx: 0,
          vy: 0,
          size: Math.random() * 4 + 2, // Varied sizes
          opacity: Math.random() * 0.6 + 0.4,
          hue: Math.random() * 30 - 15, // Color variation around purple
        });
      }
    };

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX,
        y: e.clientY,
      };
    };

    // Animation loop
    const animate = (timestamp: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((particle, index) => {
        // Calculate distance from mouse
        const dx = mouseRef.current.x - particle.x;
        const dy = mouseRef.current.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 300; // Large attraction radius

        // ATTRACT particles towards cursor (opposite of repel)
        if (distance < maxDistance && distance > 20) {
          const force = (maxDistance - distance) / maxDistance;
          const angle = Math.atan2(dy, dx);
          particle.vx += Math.cos(angle) * force * 0.8; // Attraction force
          particle.vy += Math.sin(angle) * force * 0.8;
        }

        // Add wave motion
        const waveSpeed = timestamp * 0.001;
        const waveX = Math.sin(waveSpeed + index * 0.1) * 1.5;
        const waveY = Math.cos(waveSpeed + index * 0.15) * 1.5;

        // Return to base position with wave offset
        particle.vx += ((particle.baseX + waveX) - particle.x) * 0.04;
        particle.vy += ((particle.baseY + waveY) - particle.y) * 0.04;

        // Apply friction
        particle.vx *= 0.9;
        particle.vy *= 0.9;

        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Calculate dynamic color based on distance to mouse
        const mouseInfluence = Math.max(0, 1 - distance / maxDistance);
        const baseHue = 142; // Green/Electric Leaf base
        const hue = baseHue + particle.hue + (mouseInfluence * 20); // Shift towards blue when near cursor

        // Draw particle with dynamic glow
        const glowSize = particle.size * (3 + mouseInfluence * 2);
        
        // Outer glow
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, glowSize
        );
        gradient.addColorStop(0, `hsla(${hue}, 75%, 56%, ${particle.opacity})`);
        gradient.addColorStop(0.4, `hsla(${hue}, 75%, 56%, ${particle.opacity * 0.4})`);
        gradient.addColorStop(1, `hsla(${hue}, 75%, 56%, 0)`);
        
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, glowSize, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Bright center
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 0.6, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${hue}, 80%, 62%, ${particle.opacity * 1.3})`;
        ctx.fill();

        // Draw flowing connections
        particlesRef.current.forEach((otherParticle) => {
          if (particle === otherParticle) return;
          
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            const midX = (particle.x + otherParticle.x) / 2;
            const midY = (particle.y + otherParticle.y) / 2;
            const mouseDist = Math.sqrt(
              (mouseRef.current.x - midX) ** 2 + 
              (mouseRef.current.y - midY) ** 2
            );
            
            const lineInfluence = Math.max(0, 1 - mouseDist / maxDistance);
            const opacity = (1 - dist / 120) * 0.22 * (1 + lineInfluence * 0.8);
            
            // Create gradient line
            const lineGradient = ctx.createLinearGradient(
              particle.x, particle.y,
              otherParticle.x, otherParticle.y
            );
            lineGradient.addColorStop(0, `hsla(${hue}, 75%, 56%, ${opacity})`);
            lineGradient.addColorStop(0.5, `hsla(${hue + 10}, 75%, 56%, ${opacity * 1.2})`);
            lineGradient.addColorStop(1, `hsla(${hue}, 75%, 56%, ${opacity})`);
            
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.strokeStyle = lineGradient;
            ctx.lineWidth = 1.2;
            ctx.stroke();
          }
        });
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Initialize
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);
    animationFrameRef.current = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ opacity: 0.9 }} // Increased visibility
    />
  );
}
