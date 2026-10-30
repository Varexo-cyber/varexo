import React from 'react';
import PageTransition from '../components/PageTransition';
import AnimateOnScroll from '../components/AnimateOnScroll';
import SEO from '../components/SEO';
import { SpotlightCard } from '../components/Interactive';
import { PageHero, CtaBlock } from '../components/Section';
import { useLanguage } from '../contexts/LanguageContext';

const Werkwijze: React.FC = () => {
  const { t, language } = useLanguage();
  const nl = language === 'nl';

  const expect = [
    { k: 'communication', icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' },
    { k: 'timeline', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
    { k: 'quality', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
    { k: 'aftercare', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
  ];

  return (
    <PageTransition>
      <SEO
        title="Werkwijze - Hoe Wij Websites Bouwen"
        description="Ontdek onze werkwijze: van intake tot oplevering. Wij bouwen professionele websites in 4 stappen. Persoonlijk, transparant en resultaatgericht."
        keywords="werkwijze webdesign, hoe website laten maken, webdesign proces, website ontwikkeling stappen"
        canonical="/werkwijze"
      />

      <PageHero
        eyebrow={nl ? 'Werkwijze' : 'Process'}
        title={nl ? <>Van eerste gesprek tot <span className="serif text-primary-300">livegang.</span></> : <>From first call to <span className="serif text-primary-300">launch.</span></>}
        lead={nl ? 'Vijf heldere stappen. Je weet altijd waar we staan en wat er nog komt.' : 'Five clear steps. You always know where we are and what comes next.'}
      />

      <section className="pb-24 bg-dark-950">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="relative">
            <div className="absolute left-[19px] top-2 bottom-2 w-px bg-gradient-to-b from-primary-500/60 via-white/10 to-transparent" />
            {[1, 2, 3, 4, 5].map((n, i) => (
              <AnimateOnScroll key={n} delay={i * 0.05}>
                <div className="relative flex gap-8 pb-10 group">
                  <div className="relative z-10 w-10 h-10 shrink-0 rounded-full bg-dark-950 border border-white/15 group-hover:border-primary-400 group-hover:bg-primary-500 group-hover:text-dark-950 text-white flex items-center justify-center text-sm font-semibold transition-colors">
                    {n}
                  </div>
                  <SpotlightCard className="surface flex-1 p-7">
                    <h3 className="text-xl font-semibold text-white mb-2">{t(`process.step${n}.title`).replace(/^\d+\.\s*/, "")}</h3>
                    <p className="text-gray-400 leading-relaxed">{t(`process.step${n}.desc`)}</p>
                  </SpotlightCard>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-dark-950 border-t border-white/5">
        <div className="container mx-auto px-4 max-w-6xl">
          <AnimateOnScroll>
            <span className="eyebrow">{nl ? 'Wat je mag verwachten' : 'What to expect'}</span>
            <h2 className="display text-4xl md:text-5xl mt-4 mb-12">{t('process.expect.title')}</h2>
          </AnimateOnScroll>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {expect.map((e, i) => (
              <AnimateOnScroll key={e.k} delay={i * 0.06}>
                <SpotlightCard className="surface h-full p-8">
                  <div className="w-11 h-11 rounded-2xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center mb-6">
                    <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d={e.icon} />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{t(`process.expect.${e.k}.title`)}</h3>
                  <p className="text-gray-400 leading-relaxed">{t(`process.expect.${e.k}.desc`)}</p>
                </SpotlightCard>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      <CtaBlock text={t('process.cta.desc')} button={t('process.cta.button')} />
    </PageTransition>
  );
};

export default Werkwijze;
