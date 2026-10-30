import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import AnimateOnScroll from '../components/AnimateOnScroll';
import SEO from '../components/SEO';
import { Magnetic, CountUp } from '../components/Interactive';
import { ArrowIcon } from '../components/Section';
import { useLanguage } from '../contexts/LanguageContext';

const work = [
  { name: 'Dekvloerexperts', domain: 'dekvloerexperts.nl', img: '/portfolio/dekvloerexperts.jpg', tag: 'Website · Bouw' },
  { name: 'HG Transport', domain: 'hgexperts.nl', img: '/portfolio/hgtransport.jpg', tag: 'Website · Logistiek' },
  { name: 'Labfix', domain: 'labfix.nl', img: '/portfolio/labfix.jpg', tag: 'Webshop · Elektronica' },
];

// Word that cycles through a list with a vertical slide
const RotatingWord: React.FC<{ words: string[] }> = ({ words }) => {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % words.length), 2400);
    return () => clearInterval(id);
  }, [words.length]);
  return (
    <span className="rotator">
      {words.map((w, idx) => (
        <span key={w} className={`rotator-word serif text-primary-300 ${idx === i ? 'is-in' : idx === (i - 1 + words.length) % words.length ? 'is-out' : ''}`}>{w}</span>
      ))}
      <span className="invisible serif">{words.reduce((a, b) => (a.length > b.length ? a : b))}</span>
    </span>
  );
};

const Home: React.FC = () => {
  const { language } = useLanguage();
  const nl = language === 'nl';
  const heroRef = useRef<HTMLElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const [hoverService, setHoverService] = useState<number | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const processRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  const onHeroMove = (e: React.MouseEvent) => {
    const el = heroRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--px', `${((e.clientX - r.left) / r.width - 0.5).toFixed(3)}`);
    el.style.setProperty('--py', `${((e.clientY - r.top) / r.height - 0.5).toFixed(3)}`);
  };

  // Image preview that follows the cursor over the services list
  const onServicesMove = (e: React.MouseEvent) => {
    if (previewRef.current) previewRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
  };

  // Scroll progress for the process timeline
  useEffect(() => {
    const onScroll = () => {
      const el = processRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const p = (window.innerHeight * 0.6 - r.top) / r.height;
      setProgress(Math.max(0, Math.min(1, p)));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const services = [
    { t: nl ? 'Websites' : 'Websites', d: nl ? 'Snel, strak en gebouwd om klanten op te leveren.' : 'Fast, sharp and built to bring in customers.', img: '/portfolio/dekvloerexperts.jpg' },
    { t: nl ? 'Webshops' : 'Web shops', d: nl ? 'Verkopen met iDEAL, voorraadbeheer en meer.' : 'Sell with payments, stock management and more.', img: '/portfolio/labfix.jpg' },
    { t: nl ? 'Maatwerk software' : 'Custom software', d: nl ? 'CRM, portalen en tools die je werk automatiseren.' : 'CRMs, portals and tools that automate your work.', img: '/portfolio/hgtransport.jpg' },
    { t: nl ? 'Mobiele apps' : 'Mobile apps', d: nl ? 'iOS en Android, inclusief publicatie in de stores.' : 'iOS and Android, including store release.', img: '/portfolio/labfix.jpg' },
    { t: nl ? 'Social & SEO' : 'Social & SEO', d: nl ? 'Gevonden worden en zichtbaar blijven.' : 'Get found and stay visible.', img: '/portfolio/dekvloerexperts.jpg' },
  ];

  const steps = [
    { t: nl ? 'Kennismaken' : 'Get to know', d: nl ? 'Een kort gesprek over je bedrijf, je klanten en wat de site moet doen.' : 'A short talk about your business, your customers and what the site must do.' },
    { t: nl ? 'Ontwerpen' : 'Design', d: nl ? 'Je ziet eerst het ontwerp in jouw stijl. We schaven tot het klopt.' : 'You see the design in your style first. We refine until it is right.' },
    { t: nl ? 'Bouwen' : 'Build', d: nl ? 'Wij bouwen, vullen de teksten en regelen domein, hosting en e-mail.' : 'We build, fill in the copy and arrange domain, hosting and email.' },
    { t: nl ? 'Live en verder' : 'Launch and beyond', d: nl ? 'Je site gaat live. Daarna blijven we bijsturen en onderhouden.' : 'Your site goes live. After that we keep improving and maintaining it.' },
  ];

  const faqs = nl
    ? [
        ['Hoe snel staat mijn website online?', 'De meeste websites staan binnen 7 werkdagen live. Grotere webshops of software plannen we samen in.'],
        ['Wat kost een website?', 'Websites beginnen bij €650. Je krijgt vooraf een vaste prijs, dus geen verrassingen.'],
        ['Moet ik zelf technische dingen doen?', 'Nee. Domein, hosting, SSL, e-mail en onderhoud regelen wij.'],
        ['Kan ik later nog dingen laten aanpassen?', 'Altijd. Stuur een bericht en we passen het aan.'],
      ]
    : [
        ['How quickly will my website be live?', 'Most websites go live within 7 working days. Larger projects are planned together.'],
        ['What does a website cost?', 'Websites start at €650. You get a fixed price upfront, no surprises.'],
        ['Do I need to handle anything technical?', 'No. Domain, hosting, SSL, email and maintenance are on us.'],
        ['Can I request changes later?', 'Any time. Send a message and we update it.'],
      ];

  return (
    <PageTransition>
      <SEO
        title="Varexo | Websites & Software op Maat – Vanaf €650"
        description="Varexo bouwt professionele websites, webshops én maatwerk software (CRM, apps, portalen) vanaf €650. Binnen 7 dagen live. Voor ondernemers in NL, BE & UK."
        keywords="website laten maken, software laten maken, maatwerk software, webdesign, webshop laten maken, app laten maken, crm systeem, webdevelopment, social media beheer, SEO"
        canonical="/"
      />

      {/* ───────── Hero: type left, fanned project deck right ───────── */}
      <section ref={heroRef} onMouseMove={onHeroMove} className="hero-modern relative overflow-hidden bg-dark-950 -mt-[72px] pt-[72px]">
        <div className="aurora" />
        <div className="hero-grid absolute inset-0 pointer-events-none" />
        <div className="container mx-auto px-4 max-w-7xl relative z-10 pt-20 pb-16 lg:pt-28 lg:pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7">
              <AnimateOnScroll>
                <div className="flex items-center gap-3 mb-8 text-sm text-gray-400">
                  <span className="relative flex w-2 h-2"><span className="absolute inset-0 rounded-full bg-primary-400 animate-ping opacity-60" /><span className="relative w-2 h-2 rounded-full bg-primary-400" /></span>
                  {nl ? 'Plek voor 2 nieuwe projecten deze maand' : 'Room for 2 new projects this month'}
                </div>
              </AnimateOnScroll>
              <AnimateOnScroll delay={0.06}>
                <h1 className="display text-[3.1rem] sm:text-7xl xl:text-[6.4rem]">
                  {nl ? 'Websites die' : 'Websites that'}
                  <br />
                  <RotatingWord words={nl ? ['verkopen.', 'opvallen.', 'groeien.', 'werken.'] : ['sell.', 'stand out.', 'grow.', 'work.']} />
                </h1>
              </AnimateOnScroll>
              <AnimateOnScroll delay={0.14}>
                <p className="lead sm:text-xl max-w-xl mt-8 mb-10">
                  {nl
                    ? 'Varexo ontwerpt en bouwt websites, webshops en software voor ondernemers die verder willen. Vaste prijs, binnen 7 dagen live.'
                    : 'Varexo designs and builds websites, web shops and software for businesses that want more. Fixed price, live within 7 days.'}
                </p>
              </AnimateOnScroll>
              <AnimateOnScroll delay={0.2}>
                <div className="flex flex-wrap items-center gap-3">
                  <Magnetic>
                    <Link to="/contact" className="btn-primary-modern group">
                      {nl ? 'Start je project' : 'Start your project'}
                      <ArrowIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Magnetic>
                  <Link to="/portfolio" className="btn-ghost-modern">{nl ? 'Bekijk ons werk' : 'See our work'}</Link>
                </div>
              </AnimateOnScroll>
            </div>

            <div className="lg:col-span-5 hidden lg:block">
              <div className="deck cursor-hover">
                {work.map((w, i) => (
                  <a key={w.name} href={`https://${w.domain}`} target="_blank" rel="noopener noreferrer" className={`deck-card deck-${i}`}>
                    <img src={w.img} alt={w.name} />
                    <span className="deck-label">{w.name}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-white/10 pt-8">
            {[
              { v: <CountUp to={10} suffix="+" />, l: nl ? 'tevreden klanten' : 'happy clients' },
              { v: <CountUp to={7} suffix={nl ? ' dagen' : ' days'} />, l: nl ? 'gemiddeld tot live' : 'average to launch' },
              { v: <>€<CountUp to={650} /></>, l: nl ? 'websites vanaf' : 'websites from' },
              { v: <CountUp to={99.9} decimals={1} suffix="%" />, l: 'uptime' },
            ].map((s, i) => (
              <div key={i}>
                <div className="text-3xl md:text-4xl font-semibold text-white tracking-tight tabular-nums">{s.v}</div>
                <div className="text-sm text-gray-500 mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── Big outlined marquee ───────── */}
      <section className="bg-dark-950 py-10 overflow-hidden border-y border-white/5">
        <div className="marquee big-marquee">
          {[0, 1].map((k) => (
            <div key={k} className="flex items-center shrink-0">
              {(nl ? ['Websites', 'Webshops', 'Software', 'Apps', 'SEO', 'Hosting'] : ['Websites', 'Web shops', 'Software', 'Apps', 'SEO', 'Hosting']).map((w) => (
                <span key={w + k} className="flex items-center">
                  <span className="outline-word">{w}</span>
                  <span className="mx-10 w-3 h-3 rounded-full bg-primary-500" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ───────── Services: index list with cursor image preview ───────── */}
      <section className="py-28 bg-dark-950" onMouseMove={onServicesMove}>
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-12">
            <AnimateOnScroll className="lg:col-span-6">
              <span className="eyebrow">{nl ? 'Wat we doen' : 'What we do'}</span>
              <h2 className="display text-4xl md:text-6xl mt-4">{nl ? <>Eén partner voor <span className="serif text-primary-300">alles</span> online.</> : <>One partner for <span className="serif text-primary-300">everything</span> online.</>}</h2>
            </AnimateOnScroll>
            <AnimateOnScroll className="lg:col-span-5 lg:col-start-8 self-end" delay={0.08}>
              <p className="lead">{nl ? 'Van je eerste website tot een compleet klantportaal. Je spreekt altijd met de mensen die het bouwen.' : 'From your first website to a complete client portal. You always talk to the people who build it.'}</p>
            </AnimateOnScroll>
          </div>
          <div className="border-t border-white/10" onMouseLeave={() => setHoverService(null)}>
            {services.map((s, i) => (
              <Link
                key={s.t}
                to="/diensten"
                onMouseEnter={() => setHoverService(i)}
                className={`svc-row group ${hoverService !== null && hoverService !== i ? 'is-dim' : ''}`}
              >
                <span className="text-sm text-gray-600 tabular-nums w-10">0{i + 1}</span>
                <span className="flex-1 text-3xl md:text-5xl font-semibold tracking-tight text-white transition-transform duration-500 group-hover:translate-x-3">{s.t}</span>
                <span className="hidden md:block text-gray-400 max-w-xs text-right">{s.d}</span>
                <span className="svc-arrow"><ArrowIcon className="w-5 h-5" /></span>
              </Link>
            ))}
          </div>
        </div>
        <div ref={previewRef} className={`svc-preview ${hoverService !== null ? 'is-on' : ''}`}>
          {services.map((s, i) => (
            <img key={i} src={s.img} alt="" className={hoverService === i ? 'is-active' : ''} />
          ))}
        </div>
      </section>

      {/* ───────── Selected work ───────── */}
      <section className="py-28 bg-black relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 50% 40% at 80% 0%, rgba(16,185,129,0.14), transparent 70%)' }} />
        <div className="container mx-auto px-4 max-w-7xl relative">
          <AnimateOnScroll>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
              <div>
                <span className="eyebrow">{nl ? 'Geselecteerd werk' : 'Selected work'}</span>
                <h2 className="display text-4xl md:text-6xl mt-4">{nl ? <>Recent <span className="serif text-primary-300">opgeleverd.</span></> : <>Recently <span className="serif text-primary-300">launched.</span></>}</h2>
              </div>
              <Link to="/portfolio" className="btn-ghost-modern self-start md:self-auto">{nl ? 'Alle projecten' : 'All projects'} <ArrowIcon className="w-4 h-4 ml-2" /></Link>
            </div>
          </AnimateOnScroll>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {work.map((w, i) => (
              <AnimateOnScroll key={w.name} delay={i * 0.08} className={i === 0 ? 'md:col-span-2' : ''}>
                <a href={`https://${w.domain}`} target="_blank" rel="noopener noreferrer" className="work-card group block">
                  <div className={`overflow-hidden rounded-[1.5rem] ${i === 0 ? 'aspect-[16/8]' : 'aspect-[16/11]'}`}>
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
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── Process: sticky title + scroll-driven timeline ───────── */}
      <section className="py-28 bg-dark-950">
        <div className="container mx-auto px-4 max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-14">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-32">
              <span className="eyebrow">{nl ? 'Hoe het werkt' : 'How it works'}</span>
              <h2 className="display text-4xl md:text-6xl mt-4 mb-6">{nl ? <>Vier stappen. <span className="serif text-primary-300">Nul gedoe.</span></> : <>Four steps. <span className="serif text-primary-300">Zero hassle.</span></>}</h2>
              <p className="lead mb-8">{nl ? 'Je weet altijd waar we staan. Gemiddeld staat je site binnen een week online.' : 'You always know where we are. On average your site is live within a week.'}</p>
              <div className="text-7xl font-semibold text-white/10 tabular-nums">{String(Math.min(4, Math.floor(progress * 4) + 1)).padStart(2, '0')}<span className="text-white/5">/04</span></div>
            </div>
          </div>
          <div ref={processRef} className="lg:col-span-7 relative pl-10">
            <div className="absolute left-0 top-2 bottom-2 w-px bg-white/10">
              <div className="w-px bg-primary-400 origin-top" style={{ height: `${progress * 100}%`, boxShadow: '0 0 12px rgba(52,211,153,0.8)' }} />
            </div>
            {steps.map((s, i) => {
              const active = progress * 4 > i;
              return (
                <div key={s.t} className="relative pb-20 last:pb-0">
                  <span className={`absolute -left-[45px] top-2 w-[11px] h-[11px] rounded-full border-2 transition-colors duration-500 ${active ? 'bg-primary-400 border-primary-400' : 'bg-dark-950 border-white/20'}`} />
                  <div className={`transition-all duration-700 ${active ? 'opacity-100 translate-x-0' : 'opacity-30 translate-x-2'}`}>
                    <div className="text-sm text-primary-400 mb-2">{nl ? 'Stap' : 'Step'} {i + 1}</div>
                    <h3 className="text-3xl md:text-4xl font-semibold text-white tracking-tight mb-3">{s.t}</h3>
                    <p className="text-gray-400 text-lg max-w-md leading-relaxed">{s.d}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ───────── FAQ ───────── */}
      <section className="py-24 bg-dark-950 border-t border-white/5">
        <div className="container mx-auto px-4 max-w-4xl">
          <AnimateOnScroll>
            <h2 className="display text-4xl md:text-5xl mb-10 text-center">{nl ? <>Vragen? <span className="serif text-primary-300">Antwoorden.</span></> : <>Questions? <span className="serif text-primary-300">Answers.</span></>}</h2>
          </AnimateOnScroll>
          <div className="border-t border-white/10">
            {faqs.map(([q, a], i) => (
              <div key={q} className="border-b border-white/10">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between gap-6 text-left py-6 group">
                  <span className="text-lg md:text-xl text-white group-hover:text-primary-300 transition-colors">{q}</span>
                  <span className={`shrink-0 w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-300 transition-all duration-300 ${openFaq === i ? 'rotate-45 bg-primary-500 text-dark-950 border-primary-500' : ''}`}>+</span>
                </button>
                <div className="grid transition-all duration-300" style={{ gridTemplateRows: openFaq === i ? '1fr' : '0fr' }}>
                  <div className="overflow-hidden"><p className="pb-6 text-gray-400 leading-relaxed max-w-2xl">{a}</p></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── Giant CTA ───────── */}
      <section className="relative bg-dark-950 pt-16 pb-28 overflow-hidden">
        <div className="aurora aurora-bottom" />
        <div className="container mx-auto px-4 max-w-7xl relative z-10 text-center">
          <p className="text-gray-400 mb-6">{nl ? 'Klaar voor de volgende stap?' : 'Ready for the next step?'}</p>
          <Link to="/contact" className="giant-cta group inline-block">
            <span className="display block text-[16vw] md:text-[10rem] leading-[0.9]">
              {nl ? 'Laten we' : "Let's"} <span className="serif text-primary-300">{nl ? 'praten.' : 'talk.'}</span>
            </span>
            <span className="giant-cta-btn"><ArrowIcon className="w-7 h-7 -rotate-45 group-hover:rotate-0 transition-transform duration-500" /></span>
          </Link>
          <p className="text-sm text-gray-500 mt-10">info@varexo.nl · {nl ? 'reactie binnen 24 uur' : 'reply within 24 hours'}</p>
        </div>
      </section>
    </PageTransition>
  );
};

export default Home;
