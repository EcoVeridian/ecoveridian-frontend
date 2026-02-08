'use client';

import { useEffect, useRef } from 'react';

interface Trail {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
}

interface EnergyNode {
  x: number;
  y: number;
  radius: number;
  pulsePhase: number;
  connections: number[];
}

// OPTION 3: Cosmic energy field with trailing particles and pulsing nodes
export default function InteractiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trailsRef = useRef<Trail[]>([]);
  const nodesRef = useRef<EnergyNode[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, prevX: 0, prevY: 0 });
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
      initNodes();
    };

    // Initialize energy nodes
    const initNodes = () => {
      nodesRef.current = [];
      const numNodes = 12 + Math.floor(canvas.width / 200);

      for (let i = 0; i < numNodes; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const connections: number[] = [];
        
        // Find closest nodes for connections
        const distances = nodesRef.current.map((node, idx) => ({
          idx,
          dist: Math.sqrt((node.x - x) ** 2 + (node.y - y) ** 2)
        }));
        distances.sort((a, b) => a.dist - b.dist);
        distances.slice(0, 3).forEach(d => connections.push(d.idx));
        
        nodesRef.current.push({
          x,
          y,
          radius: Math.random() * 20 + 25,
          pulsePhase: Math.random() * Math.PI * 2,
          connections,
        });
      }
    };

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.prevX = mouseRef.current.x;
      mouseRef.current.prevY = mouseRef.current.y;
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      
      // Create trailing particles when mouse moves
      const dx = mouseRef.current.x - mouseRef.current.prevX;
      const dy = mouseRef.current.y - mouseRef.current.prevY;
      const speed = Math.sqrt(dx * dx + dy * dy);
      
      if (speed > 2) {
        for (let i = 0; i < 3; i++) {
          trailsRef.current.push({
            x: mouseRef.current.x + (Math.random() - 0.5) * 10,
            y: mouseRef.current.y + (Math.random() - 0.5) * 10,
            vx: -dx * 0.1 + (Math.random() - 0.5) * 2,
            vy: -dy * 0.1 + (Math.random() - 0.5) * 2,
            life: 1,
            maxLife: Math.random() * 40 + 40,
            size: Math.random() * 3 + 2,
          });
        }
      }
    };

    // Animation loop
    const animate = (timestamp: number) => {
      // Fade effect instead of clear for trails (subtle deep-jungle tint)
      ctx.fillStyle = 'rgba(2, 44, 34, 0.06)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const time = timestamp * 0.001;

      // Draw energy beams between nodes
      nodesRef.current.forEach((node, i) => {
        node.connections.forEach(targetIdx => {
          const target = nodesRef.current[targetIdx];
          if (!target) return;

          const dx = target.x - node.x;
          const dy = target.y - node.y;
          
          // Mouse proximity influence
          const midX = (node.x + target.x) / 2;
          const midY = (node.y + target.y) / 2;
          const mouseDist = Math.sqrt(
            (mouseRef.current.x - midX) ** 2 + 
            (mouseRef.current.y - midY) ** 2
          );
          const mouseInfluence = Math.max(0, 1 - mouseDist / 300);

          // Flowing energy along the beam
          const flowSpeed = time * 2 + i * 0.5;
          const segments = 20;
          
          for (let j = 0; j < segments; j++) {
            const t = j / segments;
            const flow = (Math.sin(flowSpeed + t * Math.PI * 4) + 1) / 2;
            const x = node.x + dx * t;
            const y = node.y + dy * t;
            
            const size = (3 + flow * 4) * (1 + mouseInfluence);
            const hue = 142 + mouseInfluence * 25;
            const opacity = (0.25 + flow * 0.45) * (1 + mouseInfluence * 0.45);

            // Glow (emerald/leaf tones)
            const glow = ctx.createRadialGradient(x, y, 0, x, y, size * 3);
            glow.addColorStop(0, `hsla(${hue}, 75%, 56%, ${opacity})`);
            glow.addColorStop(0.5, `hsla(${hue}, 75%, 52%, ${opacity * 0.28})`);
            glow.addColorStop(1, `hsla(${hue}, 75%, 48%, 0)`);

            ctx.beginPath();
            ctx.arc(x, y, size * 3, 0, Math.PI * 2);
            ctx.fillStyle = glow;
            ctx.fill();

            // Core
            ctx.beginPath();
            ctx.arc(x, y, size * 0.5, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${hue + 8}, 85%, 72%, ${opacity * 1.3})`;
            ctx.fill();
          }
        });
      });

      // Draw pulsing energy nodes
      nodesRef.current.forEach((node) => {
        const pulse = Math.sin(time * 2 + node.pulsePhase) * 0.3 + 1;
        const mouseDist = Math.sqrt(
          (mouseRef.current.x - node.x) ** 2 + 
          (mouseRef.current.y - node.y) ** 2
        );
        const mouseInfluence = Math.max(0, 1 - mouseDist / 250);
        
        const radius = node.radius * pulse * (1 + mouseInfluence * 0.5);
        const hue = 142 + mouseInfluence * 25;

        // Outer glow rings (soft green)
        for (let ring = 3; ring > 0; ring--) {
          const ringGlow = ctx.createRadialGradient(
            node.x, node.y, 0,
            node.x, node.y, radius * (ring * 0.7)
          );
          ringGlow.addColorStop(0, `hsla(${hue}, 75%, 56%, ${0.12 * ring})`);
          ringGlow.addColorStop(1, `hsla(${hue}, 75%, 48%, 0)`);

          ctx.beginPath();
          ctx.arc(node.x, node.y, radius * (ring * 0.7), 0, Math.PI * 2);
          ctx.fillStyle = ringGlow;
          ctx.fill();
        }

        // Core node
        const coreGradient = ctx.createRadialGradient(
          node.x, node.y, 0,
          node.x, node.y, radius * 0.6
        );
        coreGradient.addColorStop(0, `hsla(${hue + 10}, 85%, 72%, 0.92)`);
        coreGradient.addColorStop(0.7, `hsla(${hue}, 75%, 56%, 0.72)`);
        coreGradient.addColorStop(1, `hsla(${hue}, 75%, 48%, 0.28)`);

        ctx.beginPath();
        ctx.arc(node.x, node.y, radius * 0.6, 0, Math.PI * 2);
        ctx.fillStyle = coreGradient;
        ctx.fill();
      });

      // Update and draw cursor trails
      trailsRef.current = trailsRef.current.filter(trail => {
        trail.life++;
        trail.x += trail.vx;
        trail.y += trail.vy;
        trail.vx *= 0.95;
        trail.vy *= 0.95;
        
        const lifeRatio = 1 - trail.life / trail.maxLife;
        
        if (lifeRatio <= 0) return false;
        
        // Draw trail particle with comet effect (green-tinged)
        const hue = 142 - lifeRatio * 15;
        const trailGradient = ctx.createRadialGradient(
          trail.x, trail.y, 0,
          trail.x, trail.y, trail.size * 4
        );
        trailGradient.addColorStop(0, `hsla(${hue}, 75%, 56%, ${lifeRatio * 0.82})`);
        trailGradient.addColorStop(0.5, `hsla(${hue}, 75%, 52%, ${lifeRatio * 0.35})`);
        trailGradient.addColorStop(1, `hsla(${hue}, 75%, 48%, 0)`);

        ctx.beginPath();
        ctx.arc(trail.x, trail.y, trail.size * 4, 0, Math.PI * 2);
        ctx.fillStyle = trailGradient;
        ctx.fill();
        
        return true;
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Initialize
    resizeCanvas();
    initNodes();
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
