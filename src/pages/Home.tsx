import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import AnimateOnScroll from '../components/AnimateOnScroll';
import SEO from '../components/SEO';
import { SpotlightCard, TiltCard, Magnetic, CountUp } from '../components/Interactive';
import { useLanguage } from '../contexts/LanguageContext';

const Arrow = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
);

const Home: React.FC = () => {
  const { language } = useLanguage();
  const nl = language === 'nl';
  const heroRef = useRef<HTMLElement>(null);

  // Cursor-follow light + parallax in the hero
  const onHeroMove = (e: React.MouseEvent) => {
    const el = heroRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--hx', `${e.clientX - r.left}px`);
    el.style.setProperty('--hy', `${e.clientY - r.top}px`);
    el.style.setProperty('--px', `${((e.clientX - r.left) / r.width - 0.5).toFixed(3)}`);
    el.style.setProperty('--py', `${((e.clientY - r.top) / r.height - 0.5).toFixed(3)}`);
  };

  const services = [
    {
      title: nl ? 'Websites' : 'Websites',
      desc: nl
        ? 'Snelle, strakke websites die werken op elk scherm. Gebouwd om bezoekers klant te maken.'
        : 'Fast, clean websites that work on every screen. Built to turn visitors into customers.',
      span: '',
      icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
    },
    {
      title: nl ? 'Webshops' : 'Web shops',
      desc: nl ? 'Online verkopen met iDEAL, voorraad en alles wat erbij hoort.' : 'Sell online with payments, stock and everything in between.',
      span: '',
      icon: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z',
    },
    {
      title: nl ? 'Maatwerk software' : 'Custom software',
      desc: nl ? 'CRM, klantportalen en tools die precies doen wat jouw bedrijf nodig heeft.' : 'CRMs, client portals and tools that do exactly what your business needs.',
      span: '',
      icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',
    },
    {
      title: nl ? 'Mobiele apps' : 'Mobile apps',
      desc: nl ? 'iOS en Android, inclusief publicatie in de App Store en Play Store.' : 'iOS and Android, including App Store and Play Store release.',
      span: '',
      icon: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z',
    },
    {
      title: nl ? 'Social media & SEO' : 'Social media & SEO',
      desc: nl ? 'Gevonden worden in Google en zichtbaar blijven op social.' : 'Get found on Google and stay visible on social.',
      span: '',
      icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
    },
  ];

  const reasons = [
    { title: nl ? 'Binnen 7 dagen live' : 'Live within 7 days', desc: nl ? 'Geen maanden wachten. Korte lijnen, snel schakelen.' : 'No waiting for months. Short lines, quick turnaround.' },
    { title: nl ? 'Vaste prijs' : 'Fixed price', desc: nl ? 'Vooraf weet je wat het kost. Geen verrassingen achteraf.' : 'You know the cost upfront. No surprises afterwards.' },
    { title: nl ? 'Eén vast aanspreekpunt' : 'One point of contact', desc: nl ? 'Je spreekt direct met de mensen die jouw project bouwen.' : 'You talk directly to the people building your project.' },
    { title: nl ? 'Gebouwd om te groeien' : 'Built to grow', desc: nl ? 'Je site groeit mee: van eerste pagina tot volledige webapp.' : 'Your site grows with you: from first page to full web app.' },
  ];

  const tech = ['React', 'TypeScript', 'Next.js', 'Node.js', 'Tailwind CSS', 'Firebase', 'PostgreSQL', 'Mollie', 'Vercel', 'Figma'];

  return (
    <PageTransition>
      <SEO
        title="Varexo | Websites & Software op Maat – Vanaf €650"
        description="Varexo bouwt professionele websites, webshops én maatwerk software (CRM, apps, portalen) vanaf €650. Binnen 7 dagen live. Voor ondernemers in NL, BE & UK."
        keywords="website laten maken, software laten maken, maatwerk software, webdesign, webshop laten maken, app laten maken, crm systeem, webdevelopment, social media beheer, SEO"
        canonical="/"
      />

      {/* Hero */}
      <section ref={heroRef} onMouseMove={onHeroMove} className="hero-modern relative overflow-hidden bg-dark-950 text-white">
        <div className="hero-grid absolute inset-0 pointer-events-none" />
        <div className="hero-light absolute inset-0 pointer-events-none" />
        <div className="hero-blob hero-blob-a" />
        <div className="hero-blob hero-blob-b" />

        <div className="container mx-auto px-4 relative z-10 pt-24 pb-20 lg:pt-32 lg:pb-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 items-center">
            <div className="lg:col-span-7">
              <AnimateOnScroll>
                <div className="inline-flex items-center gap-2 mb-8 pl-1.5 pr-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-sm text-gray-300 backdrop-blur">
                  <span className="px-2 py-0.5 rounded-full bg-primary-500 text-dark-950 text-xs font-semibold">{nl ? 'Nieuw' : 'New'}</span>
                  {nl ? 'Websites vanaf €650 · binnen 7 dagen live' : 'Websites from €650 · live within 7 days'}
                </div>
              </AnimateOnScroll>
              <AnimateOnScroll delay={0.08}>
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.02] mb-8">
                  {nl ? 'Websites die' : 'Websites that'}
                  <br />
                  <span className="text-gradient-emerald">{nl ? 'klanten opleveren.' : 'bring in customers.'}</span>
                </h1>
              </AnimateOnScroll>
              <AnimateOnScroll delay={0.16}>
                <p className="text-lg sm:text-xl text-gray-400 max-w-xl mb-10 leading-relaxed">
                  {nl
                    ? 'Wij ontwerpen en bouwen websites, webshops en software voor ondernemers die serieus willen groeien. Strak, snel en zonder gedoe.'
                    : 'We design and build websites, web shops and software for business owners who are serious about growth. Clean, fast and hassle-free.'}
                </p>
              </AnimateOnScroll>
              <AnimateOnScroll delay={0.24}>
                <div className="flex flex-wrap items-center gap-4">
                  <Magnetic>
                    <Link to="/contact" className="btn-primary-modern group">
                      {nl ? 'Vraag een offerte aan' : 'Request a quote'}
                      <Arrow className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Magnetic>
                  <Link to="/portfolio" className="btn-ghost-modern">
                    {nl ? 'Bekijk ons werk' : 'See our work'}
                  </Link>
                </div>
              </AnimateOnScroll>
              <AnimateOnScroll delay={0.32}>
                <div className="mt-12 flex items-center gap-4 text-sm text-gray-400">
                  <div className="flex -space-x-2">
                    {['HG', 'LF', 'SK', 'DA'].map((x) => (
                      <span key={x} className="w-9 h-9 rounded-full border-2 border-dark-950 bg-dark-800 flex items-center justify-center text-[11px] font-semibold text-primary-300">{x}</span>
                    ))}
                  </div>
                  <span>{nl ? '10+ ondernemers gingen je voor' : '10+ businesses went before you'}</span>
                </div>
              </AnimateOnScroll>
            </div>

            {/* Real work instead of a fake terminal */}
            <div className="lg:col-span-5 hidden lg:block">
              <div className="hero-stack">
                <TiltCard className="hero-shot hero-shot-back">
                  <img src="/portfolio/labfix.jpg" alt="LabFix" loading="lazy" />
                </TiltCard>
                <TiltCard className="hero-shot hero-shot-front">
                  <div className="browser-bar"><span /><span /><span /></div>
                  <img src="/portfolio/hgtransport.jpg" alt="HG Transport" />
                </TiltCard>
                <div className="hero-badge">
                  <div className="text-2xl font-bold text-white">7 {nl ? 'dagen' : 'days'}</div>
                  <div className="text-xs text-gray-400">{nl ? 'gemiddelde oplevertijd' : 'average delivery'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tech marquee */}
        <div className="relative z-10 border-t border-white/5 py-6 marquee-mask">
          <div className="marquee">
            {[...tech, ...tech].map((t, i) => (
              <span key={i} className="mx-8 text-gray-500 font-medium whitespace-nowrap hover:text-primary-400 transition-colors">{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Services – bento */}
      <section className="py-28 bg-dark-900">
        <div className="container mx-auto px-4 max-w-6xl">
          <AnimateOnScroll>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
              <div>
                <p className="text-primary-400 text-sm font-medium mb-3">{nl ? 'Wat we doen' : 'What we do'}</p>
                <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight max-w-xl">
                  {nl ? 'Alles voor je online zaak, onder één dak.' : 'Everything for your online business, under one roof.'}
                </h2>
              </div>
              <Link to="/diensten" className="inline-flex items-center gap-2 text-gray-300 hover:text-primary-400 transition-colors">
                {nl ? 'Alle diensten' : 'All services'} <Arrow />
              </Link>
            </div>
          </AnimateOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {services.map((s, i) => (
              <AnimateOnScroll key={s.title} delay={i * 0.06} className={s.span}>
                <SpotlightCard className="h-full p-8 rounded-3xl">
                  <div className="w-12 h-12 rounded-2xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center mb-10">
                    <svg className="w-6 h-6 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d={s.icon} />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{s.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{s.desc}</p>
                </SpotlightCard>
              </AnimateOnScroll>
            ))}
            <AnimateOnScroll delay={0.3}>
              <Link to="/prijzen" className="group h-full flex flex-col justify-between p-8 rounded-3xl bg-primary-500 text-dark-950 hover:bg-primary-400 transition-colors min-h-[220px]">
                <span className="text-sm font-semibold opacity-70">{nl ? 'Pakketten' : 'Packages'}</span>
                <div>
                  <div className="text-4xl font-bold tracking-tight">{nl ? 'Vanaf' : 'From'} €650</div>
                  <div className="mt-2 inline-flex items-center gap-2 font-semibold">
                    {nl ? 'Bekijk prijzen' : 'View pricing'}
                    <Arrow className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-dark-950 border-y border-white/5">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-12">
            {[
              { v: <CountUp to={10} suffix="+" />, l: nl ? 'tevreden klanten' : 'happy clients' },
              { v: <CountUp to={10} suffix="+" />, l: nl ? 'opgeleverde projecten' : 'projects delivered' },
              { v: <CountUp to={99.9} decimals={1} suffix="%" />, l: 'uptime' },
              { v: <>&lt;<CountUp to={24} suffix={nl ? 'u' : 'h'} /></>, l: nl ? 'reactietijd' : 'response time' },
            ].map((s, i) => (
              <AnimateOnScroll key={i} delay={i * 0.08}>
                <div className="md:border-l md:border-white/10 md:pl-8">
                  <div className="text-5xl md:text-6xl font-bold text-white tracking-tight tabular-nums">{s.v}</div>
                  <div className="mt-2 text-gray-500">{s.l}</div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Why */}
      <section className="py-28 bg-dark-900">
        <div className="container mx-auto px-4 max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-14">
          <AnimateOnScroll className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <p className="text-primary-400 text-sm font-medium mb-3">{nl ? 'Waarom Varexo' : 'Why Varexo'}</p>
              <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-6">
                {nl ? 'Geen bureau-gedoe. Gewoon goed werk.' : 'No agency fuss. Just good work.'}
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed">
                {nl
                  ? 'Je krijgt de kwaliteit van een groot bureau, met de snelheid en betrokkenheid van een klein team.'
                  : 'You get the quality of a big agency, with the speed and care of a small team.'}
              </p>
            </div>
          </AnimateOnScroll>
          <div className="lg:col-span-7 divide-y divide-white/10 border-y border-white/10">
            {reasons.map((r, i) => (
              <AnimateOnScroll key={r.title} delay={i * 0.06}>
                <div className="why-row group flex gap-8 py-8">
                  <span className="text-sm text-gray-600 tabular-nums pt-1.5 group-hover:text-primary-400 transition-colors">0{i + 1}</span>
                  <div>
                    <h3 className="text-2xl font-semibold text-white mb-2 group-hover:translate-x-1 transition-transform">{r.title}</h3>
                    <p className="text-gray-400">{r.desc}</p>
                  </div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-28 bg-dark-950">
        <div className="container mx-auto px-4 max-w-6xl">
          <AnimateOnScroll animation="reveal-scale">
            <SpotlightCard className="cta-card rounded-[2rem] px-8 py-20 md:px-16 text-center overflow-hidden">
              <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-6 relative">
                {nl ? 'Klaar voor de volgende stap?' : 'Ready for the next step?'}
              </h2>
              <p className="text-lg md:text-xl text-gray-400 max-w-xl mx-auto mb-10 relative">
                {nl
                  ? 'Vertel ons over je plannen. Binnen 24 uur heb je een eerlijk voorstel in je mailbox.'
                  : 'Tell us about your plans. Within 24 hours you will have an honest proposal in your inbox.'}
              </p>
              <Magnetic>
                <Link to="/contact" className="btn-primary-modern btn-lg group relative">
                  {nl ? 'Plan een gratis gesprek' : 'Book a free call'}
                  <Arrow className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Magnetic>
            </SpotlightCard>
          </AnimateOnScroll>
        </div>
      </section>
    </PageTransition>
  );
};

export default Home;
