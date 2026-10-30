import React from 'react';
import { Link } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import AnimateOnScroll from '../components/AnimateOnScroll';
import SEO from '../components/SEO';
import { SpotlightCard } from '../components/Interactive';
import { PageHero, CtaBlock, CheckIcon, ArrowIcon } from '../components/Section';
import { useLanguage } from '../contexts/LanguageContext';

const Diensten: React.FC = () => {
  const { t, language } = useLanguage();
  const nl = language === 'nl';

  const main = [
    {
      title: t('services.webdesign'), desc: t('services.webdesign.desc'),
      icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
      bullets: nl ? ['Responsive op elk apparaat', 'Modern en professioneel', 'Gericht op gebruiksgemak'] : ['Responsive on every device', 'Modern and professional', 'Built for usability'],
    },
    {
      title: t('services.webdev'), desc: t('services.webdev.desc'),
      icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',
      bullets: nl ? ['Maatwerk oplossingen', 'Snelle en veilige code', 'Schaalbaar'] : ['Custom solutions', 'Fast and secure code', 'Scalable'],
    },
    {
      title: nl ? 'Maatwerk software' : 'Custom software',
      desc: nl ? 'Van eenvoudige tools tot complete bedrijfssystemen. Software die jouw processen automatiseert.' : 'From simple tools to complete business systems. Software that automates your processes.',
      icon: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4',
      bullets: nl ? ['Webapplicaties & CRM', 'Database & API', 'Automatisering & koppelingen'] : ['Web apps & CRM', 'Database & API', 'Automation & integrations'],
    },
    {
      title: nl ? 'Mobiele apps' : 'Mobile apps',
      desc: nl ? 'iOS- en Android-apps, inclusief publicatie in de App Store en Google Play.' : 'iOS and Android apps, including App Store and Google Play release.',
      icon: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z',
      bullets: nl ? ['iOS & Android', 'Publicatie in de stores', 'Pushberichten & API'] : ['iOS & Android', 'Store publishing', 'Push & API'],
    },
    {
      title: t('services.social'), desc: t('services.social.desc'),
      icon: 'M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z',
      bullets: nl ? ['Content en planning', 'Community management', 'Analyses en rapportage'] : ['Content and planning', 'Community management', 'Analytics and reporting'],
    },
    {
      title: t('services.hosting'), desc: t('services.hosting.desc'),
      icon: 'M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01',
      bullets: nl ? ['Snelle, betrouwbare hosting', 'Updates en back-ups', 'Beveiliging en monitoring'] : ['Fast, reliable hosting', 'Updates and backups', 'Security and monitoring'],
    },
  ];

  const extra = [
    { title: 'E-mail hosting', desc: nl ? 'Zakelijk e-mailadres op je eigen domein, met spam- en virusfilter.' : 'Business email on your own domain, with spam and virus filtering.' },
    { title: nl ? 'Onderhoud & back-ups' : 'Maintenance & backups', desc: nl ? 'Wekelijkse back-ups, updates en monitoring.' : 'Weekly backups, updates and monitoring.' },
    { title: nl ? 'SEO' : 'SEO', desc: nl ? 'Technische SEO en Search Console, zodat je gevonden wordt.' : 'Technical SEO and Search Console, so people find you.' },
    { title: nl ? 'Logo & huisstijl' : 'Logo & branding', desc: nl ? '3 concepten, 2 revisies en alle bestanden (PNG, SVG, PDF).' : '3 concepts, 2 revisions and all files (PNG, SVG, PDF).' },
    { title: nl ? 'Domeinregistratie' : 'Domain registration', desc: nl ? '.nl of .com, inclusief DNS, SSL en verlenging.' : '.nl or .com, including DNS, SSL and renewal.' },
  ];

  return (
    <PageTransition>
      <SEO
        title="Diensten - Webdesign, Webshops & Social Media"
        description="Ontdek onze diensten: professioneel webdesign, webdevelopment, webshop ontwikkeling, social media beheer, SEO optimalisatie en online marketing. Alles voor jouw online groei."
        keywords="webdesign diensten, webshop laten maken, social media beheer, SEO optimalisatie, online marketing, website onderhoud, webdevelopment diensten"
        canonical="/diensten"
      />

      <PageHero
        eyebrow={nl ? 'Diensten' : 'Services'}
        title={nl ? <>Alles wat je online <span className="serif text-primary-300">nodig</span> hebt.</> : <>Everything you <span className="serif text-primary-300">need</span> online.</>}
        lead={t('services.page.subtitle')}
      />

      <section className="pb-24 bg-dark-950">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {main.map((s, i) => (
              <AnimateOnScroll key={s.title} delay={(i % 3) * 0.06}>
                <SpotlightCard className="surface h-full p-8 flex flex-col">
                  <div className="w-12 h-12 rounded-2xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center mb-8">
                    <svg className="w-6 h-6 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d={s.icon} />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-white mb-2">{s.title}</h2>
                  <p className="text-gray-400 leading-relaxed mb-6">{s.desc}</p>
                  <ul className="space-y-2.5 mt-auto mb-6">
                    {s.bullets.map((b) => (
                      <li key={b} className="flex items-center gap-3 text-sm text-gray-300">
                        <span className="check-dot !w-[18px] !h-[18px]"><CheckIcon className="w-2.5 h-2.5" /></span>{b}
                      </li>
                    ))}
                  </ul>
                  <Link to="/contact" className="inline-flex items-center gap-2 text-sm font-medium text-primary-300 hover:text-primary-200 group">
                    {nl ? 'Meer weten' : 'Learn more'} <ArrowIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </SpotlightCard>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-dark-950 border-t border-white/5">
        <div className="container mx-auto px-4 max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-12">
          <AnimateOnScroll className="lg:col-span-4">
            <span className="eyebrow">Extra</span>
            <h2 className="display text-4xl md:text-5xl mt-4 mb-4">{nl ? <>Losse <span className="serif text-primary-300">diensten.</span></> : <>Individual <span className="serif text-primary-300">services.</span></>}</h2>
            <p className="lead">{nl ? 'Om je online aanwezigheid compleet te maken.' : 'To complete your online presence.'}</p>
          </AnimateOnScroll>
          <div className="lg:col-span-8 divide-y divide-white/10 border-y border-white/10">
            {extra.map((e, i) => (
              <AnimateOnScroll key={e.title} delay={i * 0.05}>
                <div className="group grid grid-cols-1 sm:grid-cols-5 gap-2 sm:gap-6 py-6">
                  <h3 className="sm:col-span-2 text-lg font-semibold text-white group-hover:text-primary-300 transition-colors">{e.title}</h3>
                  <p className="sm:col-span-3 text-gray-400">{e.desc}</p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      <CtaBlock />
    </PageTransition>
  );
};

export default Diensten;
