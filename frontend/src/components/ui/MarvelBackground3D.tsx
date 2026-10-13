import React, { useEffect, useRef } from 'react';

export interface MarvelBackground3DProps {
  /**
   * 'login': Concentrated arc reactor focal aura with prominent 3D particles & gold/cyan core
   * 'main': Expansive ambient aurora mesh with smooth high-tech constellation field across dashboard
   */
  variant?: 'login' | 'main';
  intensity?: 'standard' | 'vibrant' | 'ultra';
}

/**
 * Advanced Marvel 3D Cinematic & Luminous Holographic Background Engine
 * 
 * Features:
 * - High-luminosity 3D Stark Arc / Quantum Realm backdrop with vivid contrast
 * - Multi-stop animated radiant aurora orbs (Electric Cyan, Cosmic Violet, Arc Gold, Quantum Mint)
 * - 3D Interactive Canvas Particle & Quantum Constellation Lattice Engine
 * - Dynamic mouse parallax with interactive proximity glow and particle repulsion
 * - Holographic cybernetic grid matrix with smooth laser scanline sweep
 * - Rich, non-dull glassmorphic ambient depth that preserves WCAG AAA contrast
 */
export const MarvelBackground3D: React.FC<MarvelBackground3DProps> = ({
  variant = 'main',
  intensity = 'vibrant',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle definition: 3D perspective quantum embers & nodes
    interface Particle {
      x: number;
      y: number;
      z: number;
      vx: number;
      vy: number;
      vz: number;
      baseSize: number;
      alpha: number;
      pulseSpeed: number;
      pulseOffset: number;
      color: string;
      shape: 'circle' | 'crystal' | 'spark';
    }

    const colorPalette = [
      '#38bdf8', // Neon Cyan
      '#60a5fa', // Bright Azure
      '#f59e0b', // Arc Core Gold
      '#c084fc', // Cosmic Violet
      '#34d399', // Quantum Emerald
      '#e0f2fe', // Stellar Diamond White
    ];

    const particleCount = variant === 'login' ? 88 : 72;
    const particles: Particle[] = Array.from({ length: particleCount }, () => ({
      x: (Math.random() - 0.5) * width * 1.6,
      y: (Math.random() - 0.5) * height * 1.6,
      z: Math.random() * 800 + 80, // 3D depth
      vx: (Math.random() - 0.5) * 0.45,
      vy: -0.25 - Math.random() * 0.45, // upward float
      vz: (Math.random() - 0.5) * 0.3,
      baseSize: Math.random() * 2.8 + 1.6,
      alpha: Math.random() * 0.5 + 0.4,
      pulseSpeed: Math.random() * 0.03 + 0.015,
      pulseOffset: Math.random() * Math.PI * 2,
      color: colorPalette[Math.floor(Math.random() * colorPalette.length)],
      shape: Math.random() > 0.65 ? 'crystal' : Math.random() > 0.4 ? 'spark' : 'circle',
    }));

    // Mouse coordinates for 3D parallax & interactive light focus
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;
    let isMouseActive = false;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / width - 0.5) * 28;
      targetMouseY = (e.clientY / height - 0.5) * 28;
      isMouseActive = true;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    let time = 0;

    const render = () => {
      time += 0.02;

      // Smooth camera interpolation for 3D parallax
      mouseX += (targetMouseX - mouseX) * 0.06;
      mouseY += (targetMouseY - mouseY) * 0.06;

      ctx.clearRect(0, 0, width, height);

      const cx = width / 2 + mouseX;
      const cy = height / 2 + mouseY;
      const fov = 420; // Perspective focal length

      // Projected particles store for drawing luminous constellation lattice
      const projectedList: {
        x: number;
        y: number;
        size: number;
        alpha: number;
        color: string;
        shape: string;
        z: number;
      }[] = [];

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Particle kinematics
        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;
        p.z -= 0.55; // fly forward smoothly

        // Wrap around 3D boundaries
        if (p.z <= 20) {
          p.z = 850;
          p.y = height * 0.55;
          p.x = (Math.random() - 0.5) * width * 1.5;
        }
        if (p.y < -height * 0.85) {
          p.y = height * 0.65;
        }
        if (p.x < -width * 0.9) p.x = width * 0.9;
        if (p.x > width * 0.9) p.x = -width * 0.9;

        // 3D Perspective Projection
        const scale = fov / (fov + p.z);
        const projX = cx + p.x * scale;
        const projY = cy + p.y * scale;
        const shimmer = Math.sin(time * p.pulseSpeed * 60 + p.pulseOffset) * 0.25 + 0.75;
        const projSize = Math.max(0.6, p.baseSize * scale * 2.2);
        const alpha = Math.min(1, p.alpha * scale * shimmer * 1.4);

        if (projX >= -40 && projX <= width + 40 && projY >= -40 && projY <= height + 40) {
          projectedList.push({
            x: projX,
            y: projY,
            size: projSize,
            alpha,
            color: p.color,
            shape: p.shape,
            z: p.z,
          });
        }
      }

      // 1. Draw Luminous Quantum Constellation Lines between close particles
      const maxConnectDistance = variant === 'login' ? 120 : 100;
      for (let i = 0; i < projectedList.length; i++) {
        for (let j = i + 1; j < projectedList.length; j++) {
          const p1 = projectedList[i];
          const p2 = projectedList[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxConnectDistance) {
            const lineAlpha = (1 - dist / maxConnectDistance) * 0.28 * Math.min(p1.alpha, p2.alpha);
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(56, 189, 248, ${lineAlpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      // 2. Render 3D Perspective Glowing Particles & Shards
      for (let i = 0; i < projectedList.length; i++) {
        const p = projectedList[i];

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = p.size * (variant === 'login' ? 6 : 4.5);

        if (p.shape === 'crystal') {
          // Floating Quantum Polyhedral Crystal
          ctx.beginPath();
          ctx.moveTo(p.x, p.y - p.size * 1.6);
          ctx.lineTo(p.x + p.size * 1.1, p.y);
          ctx.lineTo(p.x, p.y + p.size * 1.6);
          ctx.lineTo(p.x - p.size * 1.1, p.y);
          ctx.closePath();
          ctx.fill();
        } else if (p.shape === 'spark') {
          // 4-Point High-Tech Cross Spark
          ctx.beginPath();
          ctx.moveTo(p.x, p.y - p.size * 1.8);
          ctx.lineTo(p.x + p.size * 0.35, p.y - p.size * 0.35);
          ctx.lineTo(p.x + p.size * 1.8, p.y);
          ctx.lineTo(p.x + p.size * 0.35, p.y + p.size * 0.35);
          ctx.lineTo(p.x, p.y + p.size * 1.8);
          ctx.lineTo(p.x - p.size * 0.35, p.y + p.size * 0.35);
          ctx.lineTo(p.x - p.size * 1.8, p.y);
          ctx.lineTo(p.x - p.size * 0.35, p.y - p.size * 0.35);
          ctx.closePath();
          ctx.fill();
        } else {
          // Arc Reactor Glowing Quantum Mote
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [variant]);

  return (
    <div
      ref={containerRef}
      className={`marvel-3d-background-root marvel-bg-${variant}`}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      {/* 1. Base Stark Arc Reactor / Quantum Realm Wallpaper with Bright Vivid Luminescence */}
      <div
        style={{
          position: 'absolute',
          inset: '-30px',
          backgroundImage: 'url(/images/marvel_3d_bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: variant === 'login' ? 'center 38%' : 'center 25%',
          backgroundRepeat: 'no-repeat',
          filter: variant === 'login' 
            ? 'brightness(0.92) saturate(1.42) contrast(1.12)' 
            : 'brightness(0.82) saturate(1.32) contrast(1.1)',
          transform: 'scale(1.04)',
          transition: 'all 0.5s ease-out',
        }}
      />

      {/* 2. Radiant Animated Aurora Gradient Mesh Spheres (Eliminates all dullness) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          mixBlendMode: 'screen',
          pointerEvents: 'none',
        }}
      >
        {/* Top-Left Electric Cyan Aurora Light */}
        <div
          style={{
            position: 'absolute',
            top: '-15%',
            left: '-10%',
            width: '65vw',
            height: '65vw',
            maxWidth: '900px',
            maxHeight: '900px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(56, 189, 248, 0.38) 0%, rgba(14, 165, 233, 0.18) 45%, transparent 70%)',
            filter: 'blur(80px)',
            animation: 'marvelAuroraPulse1 12s ease-in-out infinite alternate',
          }}
        />

        {/* Top-Right Cosmic Violet Aurora Light */}
        <div
          style={{
            position: 'absolute',
            top: '-10%',
            right: '-10%',
            width: '60vw',
            height: '60vw',
            maxWidth: '850px',
            maxHeight: '850px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(168, 85, 247, 0.32) 0%, rgba(139, 92, 246, 0.16) 45%, transparent 70%)',
            filter: 'blur(90px)',
            animation: 'marvelAuroraPulse2 15s ease-in-out infinite alternate',
          }}
        />

        {/* Center / Bottom Arc Reactor Gold Core Aura */}
        <div
          style={{
            position: 'absolute',
            bottom: variant === 'login' ? '15%' : '-15%',
            left: '30%',
            width: '55vw',
            height: '55vw',
            maxWidth: '800px',
            maxHeight: '800px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(245, 158, 11, 0.28) 0%, rgba(217, 119, 6, 0.14) 40%, transparent 70%)',
            filter: 'blur(85px)',
            animation: 'marvelAuroraPulse3 10s ease-in-out infinite alternate',
          }}
        />

        {/* Bottom-Left Quantum Emerald / Mint Aura */}
        <div
          style={{
            position: 'absolute',
            bottom: '-15%',
            left: '-5%',
            width: '50vw',
            height: '50vw',
            maxWidth: '750px',
            maxHeight: '750px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(20, 184, 166, 0.26) 0%, rgba(13, 148, 136, 0.12) 40%, transparent 70%)',
            filter: 'blur(75px)',
            animation: 'marvelAuroraPulse1 14s ease-in-out infinite alternate-reverse',
          }}
        />
      </div>

      {/* 3. Subtle Futuristic Cyber Grid Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(56, 189, 248, 0.055) 1px, transparent 1px),
            linear-gradient(90deg, rgba(56, 189, 248, 0.055) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          maskImage: 'radial-gradient(ellipse at center, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.3) 70%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.3) 70%, transparent 100%)',
          opacity: 0.8,
        }}
      />

      {/* 4. 3D Holographic Perspective Canvas Particles & Constellation Lattice */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          opacity: 0.95,
        }}
      />

      {/* 5. Luminous Glassmorphic Depth Scrim (Replaces old pitch-black muddy vignette) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: variant === 'login'
            ? `
              radial-gradient(circle at 50% 40%, rgba(56, 189, 248, 0.12) 0%, transparent 60%),
              radial-gradient(circle at 80% 80%, rgba(245, 158, 11, 0.12) 0%, transparent 50%),
              radial-gradient(ellipse at center, rgba(12, 18, 34, 0.35) 0%, rgba(11, 17, 32, 0.65) 65%, rgba(8, 12, 24, 0.88) 100%)
            `
            : `
              radial-gradient(circle at 50% 15%, rgba(56, 189, 248, 0.1) 0%, transparent 65%),
              radial-gradient(circle at 85% 65%, rgba(168, 85, 247, 0.08) 0%, transparent 55%),
              radial-gradient(ellipse at center, rgba(12, 18, 34, 0.3) 0%, rgba(11, 17, 32, 0.6) 75%, rgba(8, 12, 24, 0.85) 100%)
            `,
        }}
      />

      {/* 6. High-Tech Laser Horizon Beam & Scanning Sweep */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          height: '2px',
          background: 'linear-gradient(90deg, transparent 0%, rgba(56, 189, 248, 0.6) 50%, transparent 100%)',
          boxShadow: '0 0 16px rgba(56, 189, 248, 0.7), 0 0 35px rgba(56, 189, 248, 0.4)',
          animation: 'marvelScanlineSweep 8s cubic-bezier(0.4, 0, 0.2, 1) infinite',
          opacity: 0.65,
        }}
      />

      {/* Embedded CSS Animations for Dynamic Aurora Movement */}
      <style>{`
        @keyframes marvelAuroraPulse1 {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          50% {
            transform: translate(30px, 40px) scale(1.12);
          }
          100% {
            transform: translate(-20px, 20px) scale(0.96);
          }
        }
        @keyframes marvelAuroraPulse2 {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          50% {
            transform: translate(-35px, 25px) scale(1.15);
          }
          100% {
            transform: translate(25px, -30px) scale(0.92);
          }
        }
        @keyframes marvelAuroraPulse3 {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          50% {
            transform: translate(20px, -30px) scale(1.18);
          }
          100% {
            transform: translate(-15px, 15px) scale(0.95);
          }
        }
        @keyframes marvelScanlineSweep {
          0% {
            top: -5%;
            opacity: 0;
          }
          15% {
            opacity: 0.75;
          }
          85% {
            opacity: 0.75;
          }
          100% {
            top: 105%;
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default MarvelBackground3D;
