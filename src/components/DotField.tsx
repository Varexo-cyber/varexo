import React, { useEffect, useRef } from 'react';

// Canvas grid of dots that breathes in a slow wave and gets pushed away and
// lit up around the cursor. Pauses when off-screen; static on touch / reduced motion.
const DotField: React.FC<{ className?: string; gap?: number }> = ({ className = '', gap = 26 }) => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0, h = 0, raf = 0, visible = true;
    let mx = -9999, my = -9999, tx = -9999, ty = -9999;
    let dots: { x: number; y: number }[] = [];

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width; h = r.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      dots = [];
      for (let y = gap / 2; y < h; y += gap) for (let x = gap / 2; x < w; x += gap) dots.push({ x, y });
    };

    const draw = (t: number) => {
      mx += (tx - mx) * 0.12; my += (ty - my) * 0.12;
      ctx.clearRect(0, 0, w, h);
      const R = 190;
      for (const d of dots) {
        const wave = Math.sin(d.x * 0.012 + t * 0.0012) * Math.cos(d.y * 0.015 + t * 0.0009);
        let x = d.x, y = d.y, glow = 0;
        const dx = d.x - mx, dy = d.y - my, dist = Math.hypot(dx, dy);
        if (dist < R) {
          const f = 1 - dist / R;
          x += (dx / (dist || 1)) * f * 22;
          y += (dy / (dist || 1)) * f * 22;
          glow = f;
        }
        const size = 1.1 + wave * 0.5 + glow * 2.6;
        const a = 0.2 + (wave + 1) * 0.08 + glow * 0.8;
        ctx.fillStyle = glow > 0.02 ? `rgba(110,231,183,${a})` : `rgba(148,163,184,${a})`;
        ctx.beginPath(); ctx.arc(x, y, Math.max(0.4, size), 0, Math.PI * 2); ctx.fill();
      }
      if (!reduce && visible) raf = requestAnimationFrame(draw);
    };

    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      tx = e.clientX - r.left; ty = e.clientY - r.top;
    };
    const onLeave = () => { tx = ty = -9999; };

    resize();
    const io = new IntersectionObserver(([en]) => {
      visible = en.isIntersecting;
      if (visible && !reduce) { cancelAnimationFrame(raf); raf = requestAnimationFrame(draw); }
    });
    io.observe(canvas);
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseleave', onLeave);
    draw(0);
    return () => {
      cancelAnimationFrame(raf); io.disconnect();
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
    };
  }, [gap]);

  return <canvas ref={ref} className={`dot-field ${className}`} aria-hidden />;
};

export default DotField;
