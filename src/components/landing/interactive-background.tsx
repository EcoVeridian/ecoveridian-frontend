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
}

// OPTION 1: Glowing particle network with cursor repulsion
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

    // Detect dark mode
    const isDark = () => document.documentElement.classList.contains('dark');

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    // Initialize particles
    const initParticles = () => {
      particlesRef.current = [];
      const numParticles = Math.floor((canvas.width * canvas.height) / 8000); // Increased density

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
          size: Math.random() * 3 + 1.5, // Larger particles
          opacity: Math.random() * 0.7 + 0.3, // Higher opacity
        });
      }
    };

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      
      // Check if mouse is within canvas bounds
      if (mouseX >= rect.left && mouseX <= rect.right &&
          mouseY >= rect.top && mouseY <= rect.bottom) {
        // Convert to canvas coordinates
        mouseRef.current = {
          x: mouseX - rect.left,
          y: mouseY - rect.top,
        };
      } else {
        // Mouse is outside canvas, set to far away position
        mouseRef.current = {
          x: -1000,
          y: -1000,
        };
      }
    };
    
    // Mouse leave handler
    const handleMouseLeave = () => {
      mouseRef.current = {
        x: -1000,
        y: -1000,
      };
    };

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((particle) => {
        // Calculate distance from mouse
        const dx = mouseRef.current.x - particle.x;
        const dy = mouseRef.current.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 250; // Larger interaction radius

        // Repel particles from cursor with stronger force
        if (distance < maxDistance) {
          const force = (maxDistance - distance) / maxDistance;
          const angle = Math.atan2(dy, dx);
          particle.vx -= Math.cos(angle) * force * 1.2; // Stronger repulsion
          particle.vy -= Math.sin(angle) * force * 1.2;
        }

        // Return to base position
        particle.vx += (particle.baseX - particle.x) * 0.03;
        particle.vy += (particle.baseY - particle.y) * 0.03;

        // Apply friction
        particle.vx *= 0.92; // Less friction for more movement
        particle.vy *= 0.92;

        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Draw particle with glow effect
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        
        // Add glow (Electric Leaf, toned down)
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size * 3
        );
        // Theme-aware colors: dark green for light mode, bright green for dark mode
        const dark = isDark();
        const r = dark ? 74 : 20;
        const g = dark ? 222 : 83;
        const b = dark ? 128 : 45;
        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${particle.opacity * (dark ? 0.4 : 0.55)})`);
        gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${particle.opacity * (dark ? 0.18 : 0.25)})`);
        gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

        ctx.fillStyle = gradient;
        ctx.fill();

        // Draw solid center
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${Math.min(particle.opacity * (dark ? 0.9 : 0.95), dark ? 0.85 : 0.9)})`;
        ctx.fill();

        // Draw connections to nearby particles with stronger visibility
        particlesRef.current.forEach((otherParticle) => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) { // Increased connection distance
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            // Subtle emerald lines
            const opacity = (1 - distance / 150) * (isDark() ? 0.2 : 0.3);
            const lr = isDark() ? 16 : 20;
            const lg = isDark() ? 185 : 83;
            const lb = isDark() ? 129 : 45;
            ctx.strokeStyle = `rgba(${lr}, ${lg}, ${lb}, ${opacity})`;
            ctx.lineWidth = 1; // Thicker lines
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
    canvas.addEventListener('mouseleave', handleMouseLeave);
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
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
