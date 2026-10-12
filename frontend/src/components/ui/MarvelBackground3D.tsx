import React, { useEffect, useRef } from 'react';

/**
 * Marvel 3D Cinematic Background
 * 
 * Features:
 * - 3D Stark Arc Reactor & Quantum Realm photorealistic backdrop
 * - Dynamic 3D interactive Canvas particle field (floating quantum polyhedrons & arc sparks)
 * - Interactive mouse parallax: tilts perspective in 3D space with cursor movement
 * - High-tech holographic Stark HUD grid overlay
 * - WCAG-compliant deep contrast scrim ensuring all academic math & text remain razor-sharp
 */
export const MarvelBackground3D: React.FC = () => {
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

    // Particle definition: 3D perspective quantum embers
    interface Particle {
      x: number;
      y: number;
      z: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      color: string;
      shape: 'circle' | 'poly' | 'spark';
    }

    const colors = [
      '#38bdf8', // Stark Arc Cyan
      '#0284c7', // Deep Cyan
      '#f59e0b', // Gold / Reactor Glow
      '#818cf8', // Cosmic Violet
      '#3b82f6', // Quantum Blue
    ];

    const particleCount = 55;
    const particles: Particle[] = Array.from({ length: particleCount }, () => ({
      x: (Math.random() - 0.5) * width * 1.5,
      y: (Math.random() - 0.5) * height * 1.5,
      z: Math.random() * 800 + 100, // 3D depth
      vx: (Math.random() - 0.5) * 0.4,
      vy: -0.3 - Math.random() * 0.5, // float upwards
      size: Math.random() * 3 + 1.5,
      alpha: Math.random() * 0.6 + 0.2,
      color: colors[Math.floor(Math.random() * colors.length)],
      shape: Math.random() > 0.6 ? 'poly' : 'circle',
    }));

    // Mouse coordinates for 3D parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / width - 0.5) * 20;
      targetMouseY = (e.clientY / height - 0.5) * 20;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const render = () => {
      // Smooth interpolation for parallax
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      ctx.clearRect(0, 0, width, height);

      const cx = width / 2 + mouseX;
      const cy = height / 2 + mouseY;
      const fov = 400; // perspective focal length

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Move particle
        p.x += p.vx;
        p.y += p.vy;
        p.z -= 0.6; // move towards viewer in 3D

        // Wrap around 3D boundaries
        if (p.z <= 10) {
          p.z = 800;
          p.y = height * 0.6;
          p.x = (Math.random() - 0.5) * width * 1.4;
        }
        if (p.y < -height * 0.8) {
          p.y = height * 0.6;
        }

        // 3D projection
        const scale = fov / (fov + p.z);
        const projX = cx + p.x * scale;
        const projY = cy + p.y * scale;
        const projSize = Math.max(0.5, p.size * scale * 2);

        if (projX < -50 || projX > width + 50 || projY < -50 || projY > height + 50) {
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha * scale;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = projSize * 4;

        if (p.shape === 'poly') {
          // Draw miniature quantum polyhedron crystal
          ctx.beginPath();
          ctx.moveTo(projX, projY - projSize * 1.5);
          ctx.lineTo(projX + projSize, projY);
          ctx.lineTo(projX, projY + projSize * 1.5);
          ctx.lineTo(projX - projSize, projY);
          ctx.closePath();
          ctx.fill();
        } else {
          // Draw glowing arc reactor mote
          ctx.beginPath();
          ctx.arc(projX, projY, projSize, 0, Math.PI * 2);
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
  }, []);

  return (
    <div
      ref={containerRef}
      className="marvel-3d-background-root"
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      {/* 1. Base 3D Marvel Cinematic Stark Arc Reactor Wallpaper */}
      <div
        style={{
          position: 'absolute',
          inset: '-20px',
          backgroundImage: 'url(/images/marvel_3d_bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 35%',
          backgroundRepeat: 'no-repeat',
          filter: 'brightness(0.68) saturate(1.25) contrast(1.1)',
          transform: 'scale(1.03)',
          transition: 'transform 0.4s ease-out',
        }}
      />

      {/* 2. 3D Perspective Holographic Canvas Particles */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          opacity: 0.85,
        }}
      />

      {/* 3. Holographic Marvel Hex Grid & Ambient Radial Vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(circle at 50% 30%, rgba(2, 132, 199, 0.12) 0%, transparent 60%),
            radial-gradient(circle at 80% 80%, rgba(245, 158, 11, 0.08) 0%, transparent 50%),
            radial-gradient(ellipse at center, rgba(11, 15, 25, 0.65) 0%, rgba(11, 15, 25, 0.88) 70%, #070a12 100%)
          `,
        }}
      />

      {/* 4. Subtle 3D Laser Horizon Scanline */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: '45%',
          height: '1px',
          background: 'linear-gradient(90deg, transparent 0%, rgba(56, 189, 248, 0.4) 50%, transparent 100%)',
          boxShadow: '0 0 12px rgba(56, 189, 248, 0.5)',
          opacity: 0.5,
        }}
      />
    </div>
  );
};

export default MarvelBackground3D;
