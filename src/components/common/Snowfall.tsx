'use client';

import { useEffect, useRef } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface Snowflake {
  x: number;
  y: number; // World Y position (relative to document, not viewport)
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  wobbleAngle: number;
  wobbleSpeed: number;
  rotation: number;
  rotationSpeed: number;
}

export default function Snowfall() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const snowflakesRef = useRef<Snowflake[]>([]);
  const scrollYRef = useRef(0);
  const worldHeightRef = useRef(0);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Get the full document height
    const getDocumentHeight = () => {
      return Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.offsetHeight,
        window.innerHeight * 3 // Minimum 3x viewport height
      );
    };

    // Resize canvas to fill viewport
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      worldHeightRef.current = getDocumentHeight();
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Track scroll position
    const handleScroll = () => {
      scrollYRef.current = window.scrollY;
      // Update world height on scroll in case page content changed
      worldHeightRef.current = getDocumentHeight();
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // Determine snowflake count based on full page area
    const getSnowflakeCount = () => {
      const area = window.innerWidth * worldHeightRef.current;
      // More snowflakes for larger pages, scaled appropriately
      return Math.min(150, Math.max(40, Math.floor(area / 20000)));
    };

    // Create a single snowflake with random properties
    const createSnowflake = (startFromTop = false): Snowflake => {
      const worldHeight = worldHeightRef.current;
      // Size determines speed - larger flakes fall faster (parallax depth effect)
      const size = Math.random() * 4 + 1; // 1 to 5px
      const speedMultiplier = 0.15 + (size / 5) * 0.85; // Smaller = slower, larger = faster
      return {
        x: Math.random() * canvas.width,
        y: startFromTop ? -20 : Math.random() * worldHeight,
        size,
        speedY: (Math.random() * 1.5 + 0.2) * speedMultiplier, // Wide range: 0.2 to 1.7, scaled by size
        speedX: (Math.random() * 0.6 - 0.3) * speedMultiplier, // Horizontal drift also varies
        opacity: Math.random() * 0.5 + 0.3,
        wobbleAngle: Math.random() * Math.PI * 2,
        wobbleSpeed: Math.random() * 0.03 + 0.005, // Wider wobble range
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.03,
      };
    };

    // Initialize snowflakes distributed across the full page
    const initSnowflakes = () => {
      const count = getSnowflakeCount();
      snowflakesRef.current = [];
      for (let i = 0; i < count; i++) {
        snowflakesRef.current.push(createSnowflake(false));
      }
    };
    initSnowflakes();

    // Theme-aware colors
    const snowflakeColor = resolvedTheme === 'dark' ? 'white' : '#1a1a2e';
    const glowColor = resolvedTheme === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(26, 26, 46, 0.3)';

    // Draw a single snowflake (6-pointed star shape)
    const drawSnowflake = (flake: Snowflake, screenY: number) => {
      ctx.save();
      ctx.translate(flake.x, screenY);
      ctx.rotate(flake.rotation);
      ctx.globalAlpha = flake.opacity;

      // Draw snowflake shape
      ctx.strokeStyle = snowflakeColor;
      ctx.lineWidth = flake.size * 0.3;
      ctx.lineCap = 'round';

      const armLength = flake.size * 2;
      const branchLength = armLength * 0.4;

      // Draw 6 arms
      for (let i = 0; i < 6; i++) {
        ctx.save();
        ctx.rotate((Math.PI / 3) * i);

        // Main arm
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -armLength);
        ctx.stroke();

        // Branch on each arm
        ctx.beginPath();
        ctx.moveTo(0, -armLength * 0.5);
        ctx.lineTo(-branchLength * 0.5, -armLength * 0.7);
        ctx.moveTo(0, -armLength * 0.5);
        ctx.lineTo(branchLength * 0.5, -armLength * 0.7);
        ctx.stroke();

        ctx.restore();
      }

      // Add glow effect
      ctx.shadowColor = glowColor;
      ctx.shadowBlur = flake.size * 2;

      ctx.restore();
    };

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const scrollY = scrollYRef.current;
      const viewportHeight = canvas.height;
      const worldHeight = worldHeightRef.current;

      snowflakesRef.current.forEach((flake) => {
        // Update wobble angle for wavy movement
        flake.wobbleAngle += flake.wobbleSpeed;

        // Apply wavy horizontal movement
        const wobbleX = Math.sin(flake.wobbleAngle) * 0.5;

        // Update position in world space
        flake.y += flake.speedY;
        flake.x += flake.speedX + wobbleX;

        // Update rotation
        flake.rotation += flake.rotationSpeed;

        // Wrap snowflake when it goes past the world height
        if (flake.y > worldHeight + 20) {
          flake.y = -20;
          flake.x = Math.random() * canvas.width;
        }

        // Wrap horizontally
        if (flake.x > canvas.width + 20) {
          flake.x = -20;
        } else if (flake.x < -20) {
          flake.x = canvas.width + 20;
        }

        // Convert world Y to screen Y (relative to viewport)
        const screenY = flake.y - scrollY;

        // Only draw if visible in viewport (with some buffer)
        if (screenY > -30 && screenY < viewportHeight + 30) {
          drawSnowflake(flake, screenY);
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Handle visibility change to pause animation when tab is hidden
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      } else {
        animate();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [resolvedTheme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      style={{ background: 'transparent' }}
      aria-hidden="true"
    />
  );
}
