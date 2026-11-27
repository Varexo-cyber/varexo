import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { ArrowIcon } from './Section';

export type WorkItem = { name: string; domain: string; img: string; tag: string };

const prefersStill = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Hero stack of project screenshots. The front card moves to the back every
// few seconds; hovering pauses the shuffle and fans the cards out.
export const ProjectDeck: React.FC<{ items: WorkItem[]; interval?: number }> = ({ items, interval = 3500 }) => {
  const [front, setFront] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || prefersStill()) return;
    const id = setInterval(() => setFront((f) => (f + 1) % items.length), interval);
    return () => clearInterval(id);
  }, [paused, items.length, interval]);

  return (
    <div className="deck cursor-hover" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      {items.map((w, i) => {
        const slot = (i - front + items.length) % items.length;
        return (
          <a key={w.name} href={`https://${w.domain}`} target="_blank" rel="noopener noreferrer" className={`deck-card deck-${Math.min(slot, 4)}`}>
            <img src={w.img} alt={w.name} />
            <span className="deck-label">{w.name}</span>
          </a>
        );
      })}
    </div>
  );
};

// Slider for "Recent opgeleverd": arrow buttons, swipe on touch, dots and an
// auto-advance every few seconds that pauses on hover.
export const WorkCarousel: React.FC<{ items: WorkItem[]; interval?: number }> = ({ items, interval = 3500 }) => {
  const { language } = useLanguage();
  const nl = language === 'nl';
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef<number | null>(null);
  const n = items.length;

  const go = useCallback((d: number) => setIndex((i) => (i + d + n) % n), [n]);

  useEffect(() => {
    if (paused || prefersStill()) return;
    const id = setTimeout(() => go(1), interval);
    return () => clearTimeout(id);
  }, [index, paused, go, interval]);

  return (
    <div
      className="work-carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={(e) => { touchX.current = e.touches[0].clientX; setPaused(true); }}
      onTouchEnd={(e) => {
        if (touchX.current !== null) {
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
        }
        touchX.current = null;
        setPaused(false);
      }}
    >
      <div className="work-viewport">
      <div className="work-track" style={{ transform: `translateX(calc(${-index} * (var(--slide-w) + var(--slide-gap))))` }}>
        {items.map((w, i) => (
          <a key={w.name} href={`https://${w.domain}`} target="_blank" rel="noopener noreferrer"
            className={`work-slide work-card group ${i === index ? 'is-active' : ''}`} aria-hidden={i !== index} tabIndex={i === index ? 0 : -1}>
            <div className="overflow-hidden rounded-[1.5rem] aspect-[16/9]">
              <img src={w.img} alt={w.name} loading="lazy" className="w-full h-full object-cover object-top transition-transform duration-[1.2s] ease-out group-hover:scale-[1.04]" />
            </div>
            <span className="work-view">{nl ? 'Bekijk' : 'View'}</span>
            <div className="flex items-center justify-between mt-5">
              <div>
                <div className="text-xl font-semibold text-white">{w.name}</div>
                <div className="text-sm text-gray-500">{w.tag}</div>
              </div>
              <span className="text-sm text-gray-400 group-hover:text-primary-300 transition-colors">{w.domain} ↗</span>
            </div>
          </a>
        ))}
      </div>
      </div>

      <div className="flex items-center justify-between mt-8 gap-4">
        <div className="flex items-center gap-2">
          {items.map((w, i) => (
            <button key={w.name} type="button" onClick={() => setIndex(i)} aria-label={w.name}
              className={`work-dot ${i === index ? 'is-active' : ''}`}>
              {i === index && !paused && <span className="work-dot-fill" style={{ animationDuration: `${interval}ms` }} />}
            </button>
          ))}
          <span className="hidden sm:inline ml-3 text-sm text-gray-500 tabular-nums whitespace-nowrap">{String(index + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}</span>
        </div>
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => go(-1)} className="carousel-btn" aria-label={nl ? 'Vorige' : 'Previous'}>
            <ArrowIcon className="w-5 h-5 rotate-180" />
          </button>
          <button type="button" onClick={() => go(1)} className="carousel-btn carousel-btn-next" aria-label={nl ? 'Volgende' : 'Next'}>
            <ArrowIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
