import { useEffect, useRef, useMemo } from 'react';
import './ParticleBackground.css';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  text: string;
  rotation: number;
  rotationSpeed: number;
  color: string;
  opacity: number;
}

export const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);

  // Computer science commands and symbols for galaxy effect
  const codeElements = useMemo(() => [
    'function',
    'const',
    'async',
    '=>',
    'class',
    'import',
    'export',
    '{...}',
    '[]',
    'await',
    'return',
    'null',
    'true',
    'false',
    'if',
    'for',
    'while',
    'try',
    'catch',
    'new',
    'this',
    'super',
    'static',
    'interface',
    'type',
    '&&',
    '||',
    '!',
    '?',
    '...',
    '@',
    '#',
    '$',
    '%',
    'var',
    'let',
    'do',
    'switch',
    'case',
    'break',
    'continue',
    'throw',
    'finally',
    'extends',
    'implements',
    'abstract',
    'public',
    'private',
    'protected',
  ], []);

  // Galaxy colors - vibrant purples, blues, pinks, cyans
  const galaxyColors = useMemo(() => [
    '#FF006E', // Hot Pink
    '#8338EC', // Purple
    '#3A86FF', // Blue
    '#06FFA5', // Cyan
    '#FFBE0B', // Yellow
    '#FB5607', // Orange
    '#00D9FF', // Light Cyan
    '#FF1493', // Deep Pink
    '#00FFFF', // Aqua
    '#7B68EE', // Medium Slate Blue
    '#FF69B4', // Hot Pink
    '#00CED1', // Dark Turquoise
  ], []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize particles
    const initializeParticles = () => {
      const initialParticles: Particle[] = Array.from({ length: 30 }, () => {
        const text = codeElements[Math.floor(Math.random() * codeElements.length)];
        const color = galaxyColors[Math.floor(Math.random() * galaxyColors.length)];
        return {
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          size: Math.random() * 24 + 14,
          text: text,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.015,
          color: color,
          opacity: Math.random() * 0.6 + 0.3,
        };
      });
      particlesRef.current = initialParticles;
    };

    initializeParticles();

    // Animation loop
    const animate = () => {
      // Clear canvas completely to avoid trails
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update particles
      const updatedParticles = particlesRef.current.map((particle) => {
        let { x, y, vx, vy, rotation } = particle;

        // Update position
        x += vx;
        y += vy;
        rotation += particle.rotationSpeed;

        // Bounce off walls with slight damping
        if (x - particle.size / 2 < 0 || x + particle.size / 2 > canvas.width) {
          vx *= -0.95;
          x = Math.max(particle.size / 2, Math.min(canvas.width - particle.size / 2, x));
        }
        if (y - particle.size / 2 < 0 || y + particle.size / 2 > canvas.height) {
          vy *= -0.95;
          y = Math.max(particle.size / 2, Math.min(canvas.height - particle.size / 2, y));
        }

        // Draw particle with glow effect
        ctx.save();
        ctx.globalAlpha = particle.opacity;

        // Minimal glow effect
        ctx.shadowColor = particle.color;
        ctx.shadowBlur = 6;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        ctx.fillStyle = particle.color;
        ctx.font = `bold ${particle.size}px 'Courier New', monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.translate(x, y);
        ctx.rotate(rotation);
        ctx.fillText(particle.text, 0, 0);
        ctx.restore();

        return { ...particle, x, y, vx, vy, rotation };
      });

      particlesRef.current = updatedParticles;
      requestAnimationFrame(animate);
    };

    animate();

    return () => window.removeEventListener('resize', resizeCanvas);
  }, [codeElements, galaxyColors]);

  return (
    <canvas
      ref={canvasRef}
      className="particle-background"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
        display: 'block',
      }}
    />
  );
};
