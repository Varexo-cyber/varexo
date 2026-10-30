import React, { useEffect, useRef } from 'react';

// Site-wide cursor: a soft emerald light plus a ring that trails the pointer
// and grows over links/buttons. Disabled on touch devices and reduced motion.
const CursorFX: React.FC = () => {
  const ring = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const glow = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    document.documentElement.classList.add('has-cursor-fx');

    let x = window.innerWidth / 2, y = window.innerHeight / 2;
    let rx = x, ry = y, raf = 0;

    const onMove = (e: MouseEvent) => {
      x = e.clientX; y = e.clientY;
      if (dot.current) dot.current.style.transform = `translate(${x}px, ${y}px)`;
      if (glow.current) glow.current.style.transform = `translate(${x}px, ${y}px)`;
      const target = e.target as HTMLElement;
      const interactive = !!target.closest('a, button, [role="button"], select, label, .cursor-hover');
      const text = !!target.closest('input, textarea');
      ring.current?.classList.toggle('is-hover', interactive);
      ring.current?.classList.toggle('is-text', text);
    };
    const onDown = () => ring.current?.classList.add('is-down');
    const onUp = () => ring.current?.classList.remove('is-down');
    const onLeave = () => document.documentElement.classList.add('cursor-out');
    const onEnter = () => document.documentElement.classList.remove('cursor-out');

    const loop = () => {
      rx += (x - rx) * 0.18; ry += (y - ry) * 0.18;
      if (ring.current) ring.current.style.transform = `translate(${rx}px, ${ry}px)`;
      raf = requestAnimationFrame(loop);
    };
    loop();

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
      document.documentElement.classList.remove('has-cursor-fx');
    };
  }, []);

  return (
    <>
      <div ref={glow} className="cfx-glow" aria-hidden />
      <div ref={ring} className="cfx-ring" aria-hidden />
      <div ref={dot} className="cfx-dot" aria-hidden />
    </>
  );
};

export default CursorFX;
