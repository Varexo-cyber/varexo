import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Small ".eyebrow" labels decode themselves (random glyphs settling into the
// real text) the first time they scroll into view. Only touches the label's
// own text node and always ends on the original text.
const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/#%&';

const scramble = (node: Text) => {
  const final = node.nodeValue || '';
  const start = performance.now();
  const dur = 650;
  const tick = (now: number) => {
    const p = Math.min((now - start) / dur, 1);
    const reveal = Math.floor(p * final.length);
    if (node.nodeValue !== null) {
      node.nodeValue = final
        .split('')
        .map((c, i) => (i < reveal || c === ' ' ? c : GLYPHS[(Math.random() * GLYPHS.length) | 0]))
        .join('');
    }
    if (p < 1) requestAnimationFrame(tick);
    else node.nodeValue = final;
  };
  requestAnimationFrame(tick);
};

const ScrambleLabels = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        io.unobserve(en.target);
        const t = Array.from(en.target.childNodes).find((n) => n.nodeType === 3 && n.nodeValue?.trim()) as Text | undefined;
        if (t) scramble(t);
      });
    }, { threshold: 0.6 });
    // wait for the page to render after the route change
    const id = setTimeout(() => document.querySelectorAll('.eyebrow').forEach((el) => io.observe(el)), 120);
    return () => { clearTimeout(id); io.disconnect(); };
  }, [pathname]);
  return null;
};

export default ScrambleLabels;
