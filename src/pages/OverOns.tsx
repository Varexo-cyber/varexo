import React from 'react';
import PageTransition from '../components/PageTransition';
import AnimateOnScroll from '../components/AnimateOnScroll';
import SEO from '../components/SEO';
import { SpotlightCard, CountUp } from '../components/Interactive';
import { PageHero, CtaBlock, CheckIcon } from '../components/Section';
import { useLanguage } from '../contexts/LanguageContext';

const OverOns: React.FC = () => {
  const { t, language } = useLanguage();
  const nl = language === 'nl';

  return (
    <PageTransition>
      <SEO
        title="Over Ons - Webdesign Bureau Nederland"
        description="Leer meer over Varexo, een professioneel webdesign- en webdevelopmentbureau uit Nederland. Wij combineren creativiteit met technologie voor jouw online succes."
        keywords="over varexo, webdesign bureau, webdevelopment bureau Nederland, wie zijn wij, webdesigner Nederland"
        canonical="/over-ons"
      />

      <PageHero
        eyebrow={t('about.title')}
        title={nl ? <>Een klein team met <span className="serif text-primary-300">grote</span> standaarden.</> : <>A small team with <span className="serif text-primary-300">high</span> standards.</>}
        lead={t('about.company.desc1')}
      />

      <section className="pb-24 bg-dark-950">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <AnimateOnScroll className="lg:col-span-7">
              <SpotlightCard className="surface h-full p-10">
                <span className="eyebrow">{t('about.company.name')}</span>
                <p className="text-gray-300 text-lg leading-relaxed mt-6">{t('about.company.desc2')}</p>
              </SpotlightCard>
            </AnimateOnScroll>
            <AnimateOnScroll delay={0.08} className="lg:col-span-5">
              <div className="grid grid-cols-2 gap-4 h-full">
                {[
                  { v: <CountUp to={10} suffix="+" />, l: nl ? 'klanten' : 'clients' },
                  { v: <CountUp to={7} />, l: nl ? 'dagen tot live' : 'days to launch' },
                  { v: '€650', l: nl ? 'vanaf' : 'starting at' },
                  { v: '24u', l: nl ? 'reactietijd' : 'response time' },
                ].map((s, i) => (
                  <SpotlightCard key={i} className="surface p-6 flex flex-col justify-end min-h-[140px]">
                    <div className="text-4xl font-semibold text-white tracking-tight">{s.v}</div>
                    <div className="text-sm text-gray-500 mt-1">{s.l}</div>
                  </SpotlightCard>
                ))}
              </div>
            </AnimateOnScroll>
            <AnimateOnScroll className="lg:col-span-6">
              <SpotlightCard className="surface h-full p-10">
                <h3 className="text-2xl font-semibold text-white mb-3">{t('about.mission.title')}</h3>
                <p className="text-gray-400 leading-relaxed">{t('about.mission.desc')}</p>
              </SpotlightCard>
            </AnimateOnScroll>
            <AnimateOnScroll delay={0.08} className="lg:col-span-6">
              <SpotlightCard className="surface h-full p-10">
                <h3 className="text-2xl font-semibold text-white mb-3">{t('about.vision.title')}</h3>
                <p className="text-gray-400 leading-relaxed">{t('about.vision.desc')}</p>
              </SpotlightCard>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      <section className="py-24 bg-dark-950 border-t border-white/5">
        <div className="container mx-auto px-4 max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-12">
          <AnimateOnScroll className="lg:col-span-5">
            <span className="eyebrow">{nl ? 'Waarom wij' : 'Why us'}</span>
            <h2 className="display text-4xl md:text-5xl mt-4">{t('about.why.title')}</h2>
          </AnimateOnScroll>
          <div className="lg:col-span-7 divide-y divide-white/10 border-y border-white/10">
            {['experience', 'personal', 'roi', 'transparent', 'fast'].map((k, i) => (
              <AnimateOnScroll key={k} delay={i * 0.05}>
                <div className="group flex items-center gap-5 py-6">
                  <span className="check-dot"><CheckIcon /></span>
                  <span className="text-lg text-gray-200 group-hover:translate-x-1 transition-transform">{t(`about.why.${k}`)}</span>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      <CtaBlock text={t('about.cta.desc')} button={t('about.cta.button')} />
    </PageTransition>
  );
};

export default OverOns;
