import React, { useEffect, useRef } from 'react';

// Headline whose letters swell in weight and light up as the cursor gets close.
// Relies on the variable Inter font (wght 100–900).
const KineticText: React.FC<{ text: string; className?: string }> = ({ text, className = '' }) => {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const letters = Array.from(el.querySelectorAll<HTMLSpanElement>('.kt-l'));
    let raf = 0, mx = -9999, my = -9999;

    const paint = () => {
      raf = 0;
      for (const l of letters) {
        const r = l.getBoundingClientRect();
        const d = Math.hypot(mx - (r.left + r.width / 2), my - (r.top + r.height / 2));
        const t = Math.max(0, 1 - d / 260);
        l.style.fontVariationSettings = `"wght" ${Math.round(600 + t * 300)}`;
        l.style.color = t > 0.05 ? `color-mix(in srgb, #6ee7b7 ${Math.round(t * 100)}%, #ffffff)` : '';
        l.style.transform = `translateY(${(-t * 6).toFixed(1)}px)`;
      }
    };
    const onMove = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; if (!raf) raf = requestAnimationFrame(paint); };
    const onLeave = () => { mx = my = -9999; if (!raf) raf = requestAnimationFrame(paint); };
    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseleave', onLeave);
    return () => { window.removeEventListener('mousemove', onMove); document.removeEventListener('mouseleave', onLeave); cancelAnimationFrame(raf); };
  }, [text]);

  return (
    <span ref={ref} className={`kinetic ${className}`} aria-label={text}>
      {text.split(' ').map((word, wi) => (
        <React.Fragment key={wi}>
          {wi > 0 && ' '}
          <span className="kt-w" aria-hidden>
            {Array.from(word).map((ch, ci) => <span key={ci} className="kt-l">{ch}</span>)}
          </span>
        </React.Fragment>
      ))}
    </span>
  );
};

export default KineticText;
