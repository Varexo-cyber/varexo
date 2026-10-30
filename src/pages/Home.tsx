import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import AnimateOnScroll from '../components/AnimateOnScroll';
import SEO from '../components/SEO';
import { SpotlightCard, TiltCard, Magnetic, CountUp } from '../components/Interactive';
import { useLanguage } from '../contexts/LanguageContext';

export const Arrow = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
);

export const Check = ({ className = 'w-3 h-3' }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
  </svg>
);

const Lock = () => (
  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const work = [
  { name: 'HG Transport', domain: 'hgexperts.nl', img: '/portfolio/hgtransport.jpg', tag: 'Transport' },
  { name: 'Labfix', domain: 'labfix.nl', img: '/portfolio/labfix.jpg', tag: 'Webshop' },
  { name: 'DirectAutoHulp', domain: 'directautohulp.nl', img: '/portfolio/Directautohulp.png?v=2', tag: 'Pechhulp' },
  { name: 'Samkill', domain: 'samkill.nl', img: '/portfolio/samkill-1.jpg', tag: 'Kleding' },
  { name: 'Leegstand Meldpunt', domain: 'leegstandmeldpunt.nl', img: '/portfolio/download.png?v=2', tag: 'Platform' },
  { name: 'Samkill', domain: 'samkill.nl', img: '/portfolio/samkill-2.jpg', tag: 'Webshop' },
];

const Home: React.FC = () => {
  const { language } = useLanguage();
  const nl = language === 'nl';
  const heroRef = useRef<HTMLElement>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const onHeroMove = (e: React.MouseEvent) => {
    const el = heroRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--hx', `${e.clientX - r.left}px`);
    el.style.setProperty('--hy', `${e.clientY - r.top}px`);
    el.style.setProperty('--px', `${((e.clientX - r.left) / r.width - 0.5).toFixed(3)}`);
    el.style.setProperty('--py', `${((e.clientY - r.top) / r.height - 0.5).toFixed(3)}`);
  };

  const steps = [
    { t: nl ? 'Kennismaking' : 'Intro call', d: nl ? 'We bellen kort en bespreken wat je wilt bereiken. Vrijblijvend.' : 'A short call about what you want to achieve. No strings attached.' },
    { t: nl ? 'Ontwerp' : 'Design', d: nl ? 'Je ziet eerst een ontwerp in jouw stijl. Pas als het goed voelt, bouwen we.' : 'You see a design in your style first. We only build once it feels right.' },
    { t: nl ? 'Bouwen' : 'Build', d: nl ? 'Teksten, foto’s, domein en e-mail: wij regelen het allemaal.' : 'Copy, photos, domain and email: we take care of it all.' },
    { t: nl ? 'Live & onderhoud' : 'Live & care', d: nl ? 'Je site staat online. Wij houden hem snel, veilig en up-to-date.' : 'Your site is online. We keep it fast, secure and up to date.' },
  ];

  const faqs = nl
    ? [
        ['Hoe snel staat mijn website online?', 'De meeste websites staan binnen 7 werkdagen live. Grotere webshops of software plannen we samen in.'],
        ['Wat kost een website?', 'Websites beginnen bij €650. Je krijgt vooraf een vaste prijs, dus geen verrassingen achteraf.'],
        ['Moet ik zelf technische dingen doen?', 'Nee. Domein, hosting, SSL, e-mail en onderhoud regelen wij. Jij levert alleen je verhaal aan.'],
        ['Kan ik later nog dingen laten aanpassen?', 'Altijd. Stuur een berichtje en we passen het aan. Of doe het zelf via je eigen omgeving.'],
      ]
    : [
        ['How quickly will my website be live?', 'Most websites go live within 7 working days. Larger shops or software projects are planned together.'],
        ['What does a website cost?', 'Websites start at €650. You get a fixed price upfront, so no surprises afterwards.'],
        ['Do I need to handle anything technical?', 'No. Domain, hosting, SSL, email and maintenance are on us. You just bring your story.'],
        ['Can I request changes later?', 'Any time. Send us a message and we update it. Or do it yourself in your own dashboard.'],
      ];

  return (
    <PageTransition>
      <SEO
        title="Varexo | Websites & Software op Maat – Vanaf €650"
        description="Varexo bouwt professionele websites, webshops én maatwerk software (CRM, apps, portalen) vanaf €650. Binnen 7 dagen live. Voor ondernemers in NL, BE & UK."
        keywords="website laten maken, software laten maken, maatwerk software, webdesign, webshop laten maken, app laten maken, crm systeem, webdevelopment, social media beheer, SEO"
        canonical="/"
      />

      {/* ───────── Hero ───────── */}
      <section ref={heroRef} onMouseMove={onHeroMove} className="hero-modern relative overflow-hidden bg-dark-950 text-white -mt-[72px] pt-[72px]">
        {/* Tilted wall of real work in the background */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.22]">
          <div className="hero-wall" style={{ transform: 'translate(calc(var(--px) * -30px), calc(var(--py) * -20px)) rotate(-12deg) scale(1.25)' }}>
            {[...work, ...work, ...work].map((w, i) => (
              <img key={i} src={w.img} alt="" loading="lazy" />
            ))}
          </div>
        </div>
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 55% at 50% 45%, rgba(2,6,23,0.92) 20%, rgba(2,6,23,0.6) 60%, #020617 100%)' }} />
        <div className="hero-light absolute inset-0 pointer-events-none" />

        {/* Floating "online" toasts */}
        <div className="hidden lg:block absolute left-[7%] top-[34%] z-10 float-slow">
          <div className="toast">
            <span className="check-dot"><Check /></span>
            <div className="text-left">
              <div className="text-sm font-semibold text-white">HG Transport {nl ? 'staat online' : 'is live'}</div>
              <div className="text-xs text-gray-400 flex items-center gap-1"><Lock /> hgexperts.nl</div>
            </div>
          </div>
        </div>
        <div className="hidden lg:block absolute right-[7%] top-[56%] z-10 float-slow-2">
          <div className="toast">
            <span className="check-dot"><Check /></span>
            <div className="text-left">
              <div className="text-sm font-semibold text-white">Labfix {nl ? 'staat online' : 'is live'}</div>
              <div className="text-xs text-gray-400 flex items-center gap-1"><Lock /> labfix.nl</div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 relative z-10 pt-24 pb-28 lg:pt-36 lg:pb-40 text-center">
          <AnimateOnScroll>
            <div className="inline-flex items-center gap-2 mb-8 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-sm text-gray-300 backdrop-blur">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-400" />
              {nl ? 'Websites vanaf €650 · binnen 7 dagen live' : 'Websites from €650 · live within 7 days'}
            </div>
          </AnimateOnScroll>
          <AnimateOnScroll delay={0.08}>
            <h1 className="display text-[2.9rem] sm:text-7xl lg:text-[6.2rem] mb-8">
              {nl ? 'Jouw website,' : 'Your website,'}
              <br />
              <span className="serif text-primary-300">{nl ? 'volledig' : 'fully'}</span>{' '}
              {nl ? 'geregeld.' : 'taken care of.'}
            </h1>
          </AnimateOnScroll>
          <AnimateOnScroll delay={0.16}>
            <p className="lead sm:text-xl max-w-2xl mx-auto mb-10">
              {nl
                ? 'Wij ontwerpen, bouwen en onderhouden je website, webshop of software op maat. Jij onderneemt, wij regelen de techniek.'
                : 'We design, build and maintain your website, web shop or custom software. You run your business, we handle the tech.'}
            </p>
          </AnimateOnScroll>
          <AnimateOnScroll delay={0.24}>
            <div className="flex flex-wrap justify-center items-center gap-3">
              <Magnetic>
                <Link to="/contact" className="btn-primary-modern group">
                  {nl ? 'Vraag een gratis offerte aan' : 'Get a free quote'}
                  <Arrow className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Magnetic>
              <Link to="/portfolio" className="btn-ghost-modern">{nl ? 'Bekijk ons werk' : 'See our work'}</Link>
            </div>
            <p className="mt-5 text-xs text-gray-500">{nl ? 'Vrijblijvend · reactie binnen 24 uur' : 'No obligation · reply within 24 hours'}</p>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ───────── Bento: fully handled ───────── */}
      <section className="py-28 bg-dark-950">
        <div className="container mx-auto px-4 max-w-6xl">
          <AnimateOnScroll>
            <span className="eyebrow">{nl ? 'Volledig geregeld' : 'Fully handled'}</span>
            <h2 className="display text-4xl md:text-6xl mt-4 mb-5">
              {nl ? <>Jij onderneemt. Wij regelen <span className="serif text-primary-300">de rest.</span></> : <>You run the business. We handle <span className="serif text-primary-300">the rest.</span></>}
            </h2>
            <p className="lead max-w-2xl mb-14">
              {nl ? 'Van ontwerp tot onderhoud: één aanspreekpunt, en je hoeft zelf niets technisch te doen.' : 'From design to maintenance: one point of contact, and nothing technical for you to do.'}
            </p>
          </AnimateOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Design */}
            <AnimateOnScroll className="md:col-span-2">
              <SpotlightCard className="surface h-full p-8 overflow-hidden">
                <h3 className="text-lg font-semibold text-white">{nl ? 'Een ontwerp dat bij je past' : 'A design that fits you'}</h3>
                <p className="text-gray-400 mt-1 max-w-md">{nl ? 'Jouw kleuren, logo en stijl. Geen standaard template.' : 'Your colours, logo and style. No standard template.'}</p>
                <TiltCard className="mt-8 -mb-16 ml-8 md:ml-24 rounded-t-2xl overflow-hidden border border-white/10 shadow-2xl" max={5}>
                  <div className="browser-bar"><span /><span /><span /></div>
                  <img src="/portfolio/hgtransport.jpg" alt="HG Transport" className="w-full h-64 object-cover object-top" loading="lazy" />
                </TiltCard>
              </SpotlightCard>
            </AnimateOnScroll>

            {/* Pages */}
            <AnimateOnScroll delay={0.06}>
              <SpotlightCard className="surface h-full p-8">
                <h3 className="text-lg font-semibold text-white">{nl ? "Alle pagina's" : 'Every page'}</h3>
                <p className="text-gray-400 mt-1">{nl ? 'Van home tot contact, wij zorgen dat alles klopt.' : 'From home to contact, we make sure it all works.'}</p>
                <div className="mt-6 space-y-2">
                  {[['Home', '/'], [nl ? 'Diensten' : 'Services', '/diensten'], [nl ? 'Over ons' : 'About', '/over-ons'], ['Contact', '/contact']].map(([n, p]) => (
                    <div key={p} className="surface-inner flex items-center justify-between px-4 py-2.5 text-sm">
                      <span className="text-gray-200">{n}</span>
                      <span className="flex items-center gap-2 text-gray-500">{p} <span className="check-dot"><Check /></span></span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-right"><span className="chip"><span className="w-1.5 h-1.5 rounded-full bg-primary-400" /> {nl ? 'Website live' : 'Website live'}</span></div>
              </SpotlightCard>
            </AnimateOnScroll>

            {/* Domain */}
            <AnimateOnScroll delay={0.1}>
              <SpotlightCard className="surface h-full p-8">
                <h3 className="text-lg font-semibold text-white">{nl ? 'Je eigen domeinnaam' : 'Your own domain'}</h3>
                <p className="text-gray-400 mt-1">{nl ? 'Wij registreren, koppelen en verlengen.' : 'We register, connect and renew it.'}</p>
                <div className="mt-6 space-y-2">
                  <div className="surface-inner flex items-center justify-between px-4 py-2.5 text-sm">
                    <span className="text-gray-200">jouwbedrijf.nl</span><span className="chip"><Check /> {nl ? 'Beschikbaar' : 'Available'}</span>
                  </div>
                  <div className="surface-inner flex items-center justify-between px-4 py-2.5 text-sm">
                    <span className="text-gray-400">{nl ? 'Automatisch verlengd' : 'Auto renew'}</span><span className="text-primary-400 text-xs font-semibold">● {nl ? 'Actief' : 'Active'}</span>
                  </div>
                </div>
              </SpotlightCard>
            </AnimateOnScroll>

            {/* SSL */}
            <AnimateOnScroll delay={0.14}>
              <SpotlightCard className="surface h-full p-8">
                <h3 className="text-lg font-semibold text-white">{nl ? 'Hosting en SSL' : 'Hosting & SSL'}</h3>
                <p className="text-gray-400 mt-1">{nl ? 'Snel, beveiligd en altijd bereikbaar.' : 'Fast, secure and always online.'}</p>
                <div className="mt-6 surface-inner px-4 py-3 text-sm flex items-center gap-3">
                  <span className="check-dot"><Lock /></span>
                  <span className="text-gray-300"><span className="text-primary-400">https://</span>jouwbedrijf.nl</span>
                </div>
                <div className="mt-3 ml-6 toast">
                  <span className="check-dot"><Check /></span>
                  <div><div className="text-sm font-semibold text-white">{nl ? 'SSL-certificaat actief' : 'SSL certificate active'}</div><div className="text-xs text-gray-400">99,9% uptime</div></div>
                </div>
              </SpotlightCard>
            </AnimateOnScroll>

            {/* Maintenance */}
            <AnimateOnScroll delay={0.18}>
              <SpotlightCard className="surface h-full p-8">
                <h3 className="text-lg font-semibold text-white">{nl ? 'Onderhoud en aanpassingen' : 'Maintenance & changes'}</h3>
                <p className="text-gray-400 mt-1">{nl ? 'Iets veranderen? Laat het ons weten.' : 'Something to change? Just tell us.'}</p>
                <div className="mt-6 space-y-3 text-sm">
                  <div className="surface-inner px-4 py-3 text-gray-300 rounded-br-sm">{nl ? 'Kunnen jullie de openingstijden aanpassen?' : 'Can you update our opening hours?'}</div>
                  <div className="flex justify-end">
                    <span className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-primary-500 text-dark-950 font-semibold">{nl ? 'Staat erop' : 'Done'} <Check /></span>
                  </div>
                </div>
              </SpotlightCard>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* ───────── Process ───────── */}
      <section className="py-28 bg-dark-950 border-t border-white/5">
        <div className="container mx-auto px-4 max-w-6xl">
          <AnimateOnScroll>
            <span className="eyebrow">{nl ? 'Werkwijze' : 'How we work'}</span>
            <h2 className="display text-4xl md:text-6xl mt-4 mb-14 max-w-3xl">
              {nl ? <>Van idee naar live, <span className="serif text-primary-300">zonder gedoe.</span></> : <>From idea to live, <span className="serif text-primary-300">without the hassle.</span></>}
            </h2>
          </AnimateOnScroll>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {steps.map((s, i) => (
              <AnimateOnScroll key={s.t} delay={i * 0.07}>
                <SpotlightCard className="surface h-full p-7 step-card">
                  <div className="w-9 h-9 rounded-full bg-white text-dark-950 flex items-center justify-center text-sm font-bold mb-8">{i + 1}</div>
                  <h3 className="text-lg font-semibold text-white mb-2">{s.t}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{s.d}</p>
                </SpotlightCard>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── Showcase ───────── */}
      <section className="relative py-28 bg-black overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 50% 50% at 30% 0%, rgba(16,185,129,0.12), transparent 70%)' }} />
        <div className="container mx-auto px-4 max-w-6xl relative">
          <AnimateOnScroll>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <span className="eyebrow">{nl ? 'Ons werk' : 'Our work'}</span>
                <h2 className="display text-4xl md:text-6xl mt-4 max-w-2xl">
                  {nl ? <>Gebouwd voor <span className="serif text-primary-300">echte</span> ondernemers.</> : <>Built for <span className="serif text-primary-300">real</span> businesses.</>}
                </h2>
              </div>
              <Link to="/portfolio" className="btn-ghost-modern self-start md:self-auto">{nl ? 'Hele portfolio' : 'Full portfolio'} <Arrow className="w-4 h-4 ml-2" /></Link>
            </div>
          </AnimateOnScroll>
          <div className="showcase mt-16">
            <div className="showcase-plane grid grid-cols-2 md:grid-cols-3 gap-5 md:gap-7">
              {work.map((w, i) => (
                <a key={i} href={`https://${w.domain}`} target="_blank" rel="noopener noreferrer" className="block group">
                  <div className="showcase-item"><img src={w.img} alt={w.name} loading="lazy" /></div>
                  <div className="mt-3 text-sm text-gray-400">
                    <span className="text-white font-medium">{w.name}</span> · {w.tag}
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ───────── Stats ───────── */}
      <section className="py-20 bg-dark-950 border-y border-white/5">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-12">
            {[
              { v: <CountUp to={10} suffix="+" />, l: nl ? 'tevreden klanten' : 'happy clients' },
              { v: <CountUp to={7} />, l: nl ? 'dagen gemiddeld tot live' : 'days on average to launch' },
              { v: <CountUp to={99.9} decimals={1} suffix="%" />, l: 'uptime' },
              { v: <>&lt;<CountUp to={24} suffix={nl ? 'u' : 'h'} /></>, l: nl ? 'reactietijd' : 'response time' },
            ].map((s, i) => (
              <AnimateOnScroll key={i} delay={i * 0.08}>
                <div className="md:border-l md:border-white/10 md:pl-8">
                  <div className="text-5xl md:text-6xl font-semibold text-white tracking-tight tabular-nums">{s.v}</div>
                  <div className="mt-2 text-gray-500">{s.l}</div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── Client portal ───────── */}
      <section className="py-28 bg-dark-950">
        <div className="container mx-auto px-4 max-w-6xl">
          <AnimateOnScroll>
            <span className="eyebrow">{nl ? 'Je eigen omgeving' : 'Your own dashboard'}</span>
            <h2 className="display text-4xl md:text-6xl mt-4 mb-5">
              {nl ? <>Alles <span className="serif text-primary-300">in één</span> overzicht.</> : <>Everything <span className="serif text-primary-300">in one</span> place.</>}
            </h2>
            <p className="lead max-w-2xl mb-14">
              {nl ? 'Je project volgen, facturen inzien en wijzigingen doorgeven. Gewoon in je eigen klantomgeving.' : 'Follow your project, view invoices and request changes. Right in your own client portal.'}
            </p>
          </AnimateOnScroll>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <AnimateOnScroll className="md:col-span-3">
              <SpotlightCard className="surface h-full p-8">
                <h3 className="text-lg font-semibold text-white">{nl ? 'Je bezoekers' : 'Your visitors'}</h3>
                <p className="text-gray-400 mt-1">{nl ? 'Zie hoeveel mensen je website bezoeken.' : 'See how many people visit your website.'}</p>
                <div className="surface-inner mt-6 p-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-xs text-gray-500">{nl ? 'Bezoekers deze maand' : 'Visitors this month'}</div>
                      <div className="text-3xl font-semibold text-white mt-1 tabular-nums"><CountUp to={1284} /></div>
                    </div>
                    <span className="chip">↗ +18%</span>
                  </div>
                  <div className="mt-6 flex items-end gap-2 h-28">
                    {[30, 42, 36, 50, 47, 58, 55, 68, 63, 74, 80, 92].map((h, i) => (
                      <div key={i} className="bar flex-1 rounded-md" style={{ height: `${h}%`, background: `rgba(16,185,129,${0.15 + i * 0.07})`, animationDelay: `${i * 60}ms` }} />
                    ))}
                  </div>
                </div>
              </SpotlightCard>
            </AnimateOnScroll>
            <AnimateOnScroll delay={0.08} className="md:col-span-2">
              <SpotlightCard className="surface h-full p-8">
                <h3 className="text-lg font-semibold text-white">{nl ? 'Je facturen' : 'Your invoices'}</h3>
                <p className="text-gray-400 mt-1">{nl ? 'Alles op één plek, altijd terug te vinden.' : 'All in one place, always easy to find.'}</p>
                <div className="surface-inner mt-6 p-2 space-y-1">
                  {(nl ? ['Oktober', 'September', 'Augustus'] : ['October', 'September', 'August']).map((m, i) => (
                    <div key={m} className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-white/5 transition">
                      <div>
                        <div className="text-sm text-white">{m}</div>
                        <div className="text-xs text-gray-500">INV-2026-00{12 - i}</div>
                      </div>
                      <span className="chip"><Check /> {nl ? 'Betaald' : 'Paid'}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-right">
                  <span className="toast !py-2 text-sm text-white"><span className="check-dot"><Check /></span>{nl ? 'Betaling ontvangen' : 'Payment received'}</span>
                </div>
              </SpotlightCard>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* ───────── FAQ ───────── */}
      <section className="py-28 bg-dark-950 border-t border-white/5">
        <div className="container mx-auto px-4 max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-12">
          <AnimateOnScroll className="lg:col-span-5">
            <span className="eyebrow">FAQ</span>
            <h2 className="display text-4xl md:text-5xl mt-4 mb-5">{nl ? <>Goede <span className="serif text-primary-300">vragen.</span></> : <>Good <span className="serif text-primary-300">questions.</span></>}</h2>
            <p className="lead">{nl ? 'Staat je vraag er niet tussen? Stuur ons een bericht.' : "Can't find your question? Send us a message."}</p>
          </AnimateOnScroll>
          <div className="lg:col-span-7 space-y-3">
            {faqs.map(([q, a], i) => (
              <div key={q} className="surface !rounded-2xl overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between gap-4 text-left px-6 py-5">
                  <span className="text-white font-medium">{q}</span>
                  <span className={`w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-gray-300 transition-transform duration-300 ${openFaq === i ? 'rotate-45' : ''}`}>+</span>
                </button>
                <div className="grid transition-all duration-300" style={{ gridTemplateRows: openFaq === i ? '1fr' : '0fr' }}>
                  <div className="overflow-hidden"><p className="px-6 pb-5 text-gray-400 leading-relaxed">{a}</p></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── CTA ───────── */}
      <section className="pb-28 bg-dark-950">
        <div className="container mx-auto px-4 max-w-6xl">
          <AnimateOnScroll animation="reveal-scale">
            <SpotlightCard className="cta-card rounded-[2rem] px-8 py-20 md:px-16 text-center overflow-hidden border border-white/10">
              <h2 className="display text-4xl md:text-7xl mb-6 relative">
                {nl ? <>Klaar om te <span className="serif text-primary-300">groeien?</span></> : <>Ready to <span className="serif text-primary-300">grow?</span></>}
              </h2>
              <p className="lead md:text-xl max-w-xl mx-auto mb-10 relative">
                {nl ? 'Vertel ons over je plannen. Binnen 24 uur heb je een eerlijk voorstel in je mailbox.' : 'Tell us about your plans. Within 24 hours you will have an honest proposal in your inbox.'}
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
