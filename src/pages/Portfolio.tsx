import React, { useState } from 'react';
import PageTransition from '../components/PageTransition';
import AnimateOnScroll from '../components/AnimateOnScroll';
import SEO from '../components/SEO';
import { useLanguage } from '../contexts/LanguageContext';
import { SpotlightCard, TiltCard } from '../components/Interactive';
import { PageHero, CtaBlock, ArrowIcon } from '../components/Section';

interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  technologies: string[];
  link?: string;
}

interface Campaign {
  id: string;
  title: string;
  description: string;
  images: string[];
  stats: {
    reach: string;
    conversions: string;
    status: string;
  };
  tags: string[];
}

const CampaignCard: React.FC<{ campaign: Campaign; language: string }> = ({ campaign, language }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const nl = language === 'nl';
  const go = (d: number) => setCurrentImage((p) => (p + d + campaign.images.length) % campaign.images.length);

  return (
    <SpotlightCard className="surface h-full overflow-hidden">
      <div className="relative bg-black/40" style={{ height: 420 }}>
        {campaign.images.map((img, idx) => (
          <img key={idx} src={img} alt={`${campaign.title} ${idx + 1}`}
            className={`absolute inset-0 w-full h-full object-contain transition-all duration-500 ${idx === currentImage ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`} />
        ))}
        <span className="absolute top-4 left-4 chip !bg-dark-950/80 backdrop-blur">{nl ? 'Advertentie' : 'Ad campaign'}</span>
        {[-1, 1].map((d) => (
          <button key={d} onClick={() => go(d)} aria-label={d < 0 ? 'Previous' : 'Next'}
            className={`absolute ${d < 0 ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-dark-950/70 backdrop-blur border border-white/10 text-white hover:bg-white hover:text-dark-950 transition flex items-center justify-center`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={d < 0 ? 'M15 19l-7-7 7-7' : 'M9 5l7 7-7 7'} /></svg>
          </button>
        ))}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
          {campaign.images.map((_, idx) => (
            <button key={idx} onClick={() => setCurrentImage(idx)} className={`h-1.5 rounded-full transition-all ${idx === currentImage ? 'w-6 bg-primary-400' : 'w-1.5 bg-white/40'}`} />
          ))}
        </div>
      </div>
      <div className="p-7">
        <h3 className="text-xl font-semibold text-white mb-2">{campaign.title}</h3>
        <p className="text-gray-400 text-sm leading-relaxed mb-6">{campaign.description}</p>
        <div className="grid grid-cols-3 gap-2 mb-5">
          {[[campaign.stats.reach, nl ? 'bereik / dag' : 'reach / day'], [campaign.stats.conversions, nl ? 'leads / dag' : 'leads / day'], [campaign.stats.status, 'status']].map(([v, l]) => (
            <div key={l} className="surface-inner p-3">
              <div className="text-lg font-semibold text-white">{v}</div>
              <div className="text-[11px] text-gray-500">{l}</div>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {campaign.tags.map((tag) => <span key={tag} className="text-xs text-gray-400 px-2.5 py-1 rounded-full border border-white/10">{tag}</span>)}
        </div>
      </div>
    </SpotlightCard>
  );
};

const Portfolio: React.FC = () => {
  const { t, language } = useLanguage();
  const nl = language === 'nl';

  const projects: Project[] = [
    {
      id: '1',
      title: language === 'nl' ? 'Leegstand Meldpunt' : 'Vacancy Reporting System',
      category: language === 'nl' ? 'Bedrijfswebsite' : 'Business Website',
      description: language === 'nl' 
        ? 'Meldpunt voor het registreren en rapporteren van leegstaande panden. Gebruiksvriendelijke interface met kaartintegratie en automatische rapportage.'
        : 'Reporting system for vacant properties. User-friendly interface with map integration and automatic reporting.',
      image: '/portfolio/download.png?v=2',
      technologies: ['React', 'Node.js', 'Maps API'],
      link: 'https://leegstandmeldpunt.nl'
    },
    {
      id: '2',
      title: 'DirectAutoHulp',
      category: language === 'nl' ? 'Bedrijfswebsite' : 'Business Website',
      description: language === 'nl'
        ? 'Complete bedrijfswebsite voor autotransport, pechhulp en auto-inkoop. 24/7 bereikbaar met contactformulier, WhatsApp-integratie en professioneel design.'
        : 'Complete business website for car transport, roadside assistance and car purchasing. 24/7 available with contact form, WhatsApp integration and professional design.',
      image: '/portfolio/Directautohulp.png?v=2',
      technologies: ['React', 'Node.js', 'TypeScript'],
      link: 'https://directautohulp.nl'
    },
    {
      id: '3',
      title: 'HG Transport',
      category: language === 'nl' ? 'Bedrijfswebsite' : 'Business Website',
      description: language === 'nl'
        ? 'Professionele website voor internationaal transport en logistiek. Focus op eenvoud, betrouwbaarheid en snelle offerte-aanvragen voor wegtransport.'
        : 'Professional website for international transport and logistics. Focus on simplicity, reliability and quick quote requests for road transport.',
      image: '/portfolio/hgtransport.jpg',
      technologies: ['React', 'Tailwind CSS', 'Framer Motion'],
      link: 'https://hgexperts.nl'
    },
    {
      id: '4',
      title: 'Labfix',
      category: language === 'nl' ? 'Webshop' : 'Webshop',
      description: language === 'nl'
        ? 'Moderne webshop voor laboratoriumbenodigdheden en chemische producten. Gebruiksvriendelijk bestelproces met voorraadbeheer en veilige betalingen.'
        : 'Modern webshop for laboratory supplies and chemical products. User-friendly ordering process with inventory management and secure payments.',
      image: '/portfolio/labfix.jpg',
      technologies: ['React', 'Node.js', 'Payment API'],
      link: 'https://labfix.nl'
    }
  ];

  const campaigns: Campaign[] = [
    {
      id: '1',
      title: language === 'nl' ? 'Leegstand Meldpunt - Campagne' : 'Vacancy Reporting - Campaign',
      description: language === 'nl'
        ? 'Social media advertentiecampagne gericht op het bereiken van vastgoedeigenaren. Meerdere advertentievarianten A/B getest voor maximale conversie.'
        : 'Social media ad campaign targeting property owners. Multiple ad variants A/B tested for maximum conversion and reach.',
      images: ['/portfolio/Campagne 1.jpeg', '/portfolio/Campagne 2.jpeg'],
      stats: {
        reach: '10K+',
        conversions: '3.2%',
        status: 'Active'
      },
      tags: ['Meta Ads', 'Instagram', 'Facebook']
    },
    {
      id: '2',
      title: 'SAMKILL CLOTHING',
      description: language === 'nl'
        ? 'Social media advertentiecampagne voor premium streetwear merk. Focus op de nieuwe lente/zomer collectie 2026 en online verkoop.'
        : 'Social media ad campaign for premium streetwear brand. Focused on the new spring/summer 2026 collection and online sales.',
      images: ['/portfolio/samkill-1.jpg', '/portfolio/samkill-2.jpg'],
      stats: {
        reach: '2K+',
        conversions: '3-4 / dag',
        status: 'Active'
      },
      tags: ['Streetwear', 'E-commerce', 'Social Media']
    }
  ];
  
  return (
    <PageTransition>
      <SEO
        title={language === 'nl' ? "Portfolio - Onze Projecten & Websites" : "Portfolio - Our Projects & Websites"}
        description={language === 'nl' ? "Bekijk ons portfolio met professionele websites en webshops. Van startups tot gevestigde bedrijven, wij leveren maatwerk webdesign dat resultaat oplevert." : "View our portfolio with professional websites and webshops. From startups to established companies, we deliver custom web design that delivers results."}
        keywords={language === 'nl' ? "portfolio webdesign, website voorbeelden, webshop voorbeelden, webdesign projecten, gemaakte websites" : "portfolio web design, website examples, webshop examples, web design projects, made websites"}
        canonical="/portfolio"
      />

      <PageHero
        eyebrow="Portfolio"
        title={nl ? <>Werk waar we <span className="serif text-primary-300">trots</span> op zijn.</> : <>Work we are <span className="serif text-primary-300">proud</span> of.</>}
        lead={nl ? 'Een selectie van websites, webshops en campagnes die we voor ondernemers hebben gebouwd.' : 'A selection of websites, web shops and campaigns we built for business owners.'}
      />

      <section className="pb-24 bg-dark-950">
        <div className="container mx-auto px-4 max-w-6xl space-y-6">
          {projects.map((p, i) => (
            <AnimateOnScroll key={p.id}>
              <a href={p.link} target="_blank" rel="noopener noreferrer" className="block group">
                <SpotlightCard className="surface overflow-hidden">
                  <div className={`flex flex-col lg:flex-row items-center ${i % 2 ? 'lg:flex-row-reverse' : ''}`}>
                    <div className="w-full lg:w-7/12 p-6 md:p-10">
                      <TiltCard className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-dark-900" max={5}>
                        <div className="browser-bar"><span /><span /><span /><em className="ml-3 not-italic text-[11px] text-gray-500">{p.link?.replace('https://', '')}</em></div>
                        <img src={p.image} alt={p.title} loading="lazy" className="w-full aspect-[16/10] object-cover object-top group-hover:scale-[1.02] transition-transform duration-700" />
                      </TiltCard>
                    </div>
                    <div className="w-full lg:w-5/12 p-6 pt-0 md:p-10">
                      <span className="chip mb-5">{p.category}</span>
                      <h2 className="display text-3xl md:text-4xl mb-4">{p.title}</h2>
                      <p className="text-gray-400 leading-relaxed mb-6">{p.description}</p>
                      <div className="flex flex-wrap gap-2 mb-8">
                        {p.technologies.map((tech) => <span key={tech} className="text-xs text-gray-400 px-2.5 py-1 rounded-full border border-white/10">{tech}</span>)}
                      </div>
                      <span className="inline-flex items-center gap-2 text-sm font-medium text-white group-hover:text-primary-300 transition-colors">
                        {t('portfolio.viewWebsite')} <ArrowIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </div>
                </SpotlightCard>
              </a>
            </AnimateOnScroll>
          ))}
        </div>
      </section>

      <section className="py-24 bg-dark-950 border-t border-white/5">
        <div className="container mx-auto px-4 max-w-6xl">
          <AnimateOnScroll>
            <span className="eyebrow">{nl ? 'Campagnes' : 'Campaigns'}</span>
            <h2 className="display text-4xl md:text-5xl mt-4 mb-4">{nl ? <>Meer dan alleen <span className="serif text-primary-300">websites.</span></> : <>More than just <span className="serif text-primary-300">websites.</span></>}</h2>
            <p className="lead max-w-2xl mb-12">
              {nl ? 'We beheren ook advertentiecampagnes die dagelijks duizenden mensen bereiken.' : 'We also run ad campaigns that reach thousands of people every day.'}
            </p>
          </AnimateOnScroll>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {campaigns.map((c, i) => (
              <AnimateOnScroll key={c.id} delay={i * 0.08}>
                <CampaignCard campaign={c} language={language} />
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      <CtaBlock title={t('portfolio.cta.title')} text={t('portfolio.cta.desc')} button={t('portfolio.cta.button')} />
    </PageTransition>
  );
};

export default Portfolio;
