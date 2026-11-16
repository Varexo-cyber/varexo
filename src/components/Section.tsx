import React, { useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AnimateOnScroll from './AnimateOnScroll';
import KineticText from './KineticText';
import DotField from './DotField';
import { useLanguage } from '../contexts/LanguageContext';

export const ArrowIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
);

export const CheckIcon = ({ className = 'w-3 h-3' }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
  </svg>
);

// Order of the public pages, used for the "02 / 07" index in every page header
const PAGE_ORDER = ['/', '/ai-assistent', '/diensten', '/portfolio', '/werkwijze', '/prijzen', '/over-ons', '/contact'];

// Outlined words scrolling past, used under every page header
export const PageMarquee: React.FC<{ words?: string[] }> = ({ words }) => {
  const { language } = useLanguage();
  const list = words || (language === 'nl'
    ? ['Websites', 'Webshops', 'Software', 'Rexo AI', 'Apps', 'SEO', 'Hosting']
    : ['Websites', 'Web shops', 'Software', 'Rexo AI', 'Apps', 'SEO', 'Hosting']);
  return (
    <div className="bg-dark-950 py-8 overflow-hidden border-y border-white/5">
      <div className="marquee big-marquee">
        {[0, 1].map((k) => (
          <div key={k} className="flex items-center shrink-0">
            {list.map((w) => (
              <span key={w + k} className="flex items-center">
                <span className="outline-word !text-[clamp(2.4rem,6vw,5rem)]">{w}</span>
                <span className="mx-8 w-2.5 h-2.5 rounded-sm rotate-45 bg-primary-500" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

// Page header used on every public subpage: giant outlined page word in the
// background that drifts with the mouse, kinetic title, page index, marquee.
export const PageHero: React.FC<{
  eyebrow: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  children?: React.ReactNode;
  center?: boolean;
  marquee?: string[] | false;
}> = ({ eyebrow, title, lead, children, center, marquee }) => {
  const ref = useRef<HTMLElement>(null);
  const { pathname } = useLocation();
  const idx = PAGE_ORDER.indexOf(pathname);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--px', `${((e.clientX - r.left) / r.width - 0.5).toFixed(3)}`);
    el.style.setProperty('--py', `${((e.clientY - r.top) / r.height - 0.5).toFixed(3)}`);
  };

  return (
    <>
      <section ref={ref} onMouseMove={onMove} className="page-hero relative overflow-hidden bg-dark-950 -mt-[72px] pt-[72px]">
        <div className="aurora" />
        <DotField />
        <div className="page-hero-word" aria-hidden>{eyebrow}</div>
        <div className={`container mx-auto px-4 max-w-6xl relative z-10 pt-24 pb-20 md:pt-32 md:pb-28 ${center ? 'text-center' : ''}`}>
          <AnimateOnScroll>
            <div className={`flex items-center gap-4 mb-6 ${center ? 'justify-center' : ''}`}>
              {idx > 0 && <span className="text-sm text-gray-500 tabular-nums">{String(idx + 1).padStart(2, '0')} / {String(PAGE_ORDER.length).padStart(2, '0')}</span>}
              <span className="h-px w-10 bg-white/20" />
              <span className="eyebrow">{eyebrow}</span>
            </div>
            <h1 className={`display text-5xl md:text-7xl lg:text-[5.5rem] mb-8 ${center ? 'mx-auto' : ''} max-w-5xl`}>
              {typeof title === 'string' ? <KineticText text={title} /> : title}
            </h1>
            {lead && <p className={`lead md:text-xl max-w-2xl ${center ? 'mx-auto' : ''}`}>{lead}</p>}
            {children}
          </AnimateOnScroll>
        </div>
      </section>
      {marquee !== false && <PageMarquee words={marquee || undefined} />}
    </>
  );
};

// Closing call-to-action shared by the subpages, in the same giant style as the home page
export const CtaBlock: React.FC<{ title?: React.ReactNode; text?: string; button?: string }> = ({ title, text, button }) => {
  const { language } = useLanguage();
  const nl = language === 'nl';
  return (
    <section className="relative bg-dark-950 pt-24 pb-28 overflow-hidden border-t border-white/5">
      <div className="aurora aurora-bottom" />
      <div className="container mx-auto px-4 max-w-7xl relative z-10 text-center">
        <p className="text-gray-400 mb-6 max-w-xl mx-auto">
          {typeof title === 'string' ? title : (nl ? 'Klaar om te beginnen?' : 'Ready to start?')}
        </p>
        <Link to="/contact" className="giant-cta group inline-block">
          <span className="display block text-[15vw] md:text-[9rem] leading-[0.9]">
            <KineticText text={nl ? 'Laten we' : "Let's"} /> <span className="serif text-primary-300">{nl ? 'praten.' : 'talk.'}</span>
          </span>
          <span className="giant-cta-btn"><ArrowIcon className="w-7 h-7 -rotate-45 group-hover:rotate-0 transition-transform duration-500" /></span>
        </Link>
        <p className="text-sm text-gray-500 mt-10 max-w-lg mx-auto">
          {text || (nl ? 'Vertel ons over je plannen. Binnen 24 uur heb je een eerlijk voorstel.' : 'Tell us about your plans. You will have an honest proposal within 24 hours.')}
        </p>
        {button && <p className="mt-2 text-sm text-primary-300">{button} →</p>}
      </div>
    </section>
  );
};
