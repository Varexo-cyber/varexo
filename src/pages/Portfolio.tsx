import React from 'react';
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

const Portfolio: React.FC = () => {
  const { t, language } = useLanguage();
  const nl = language === 'nl';

  const projects: Project[] = [
    {
      id: '1',
      title: 'Dekvloerexperts',
      category: nl ? 'Bedrijfswebsite' : 'Business Website',
      description: nl
        ? 'Website voor een specialist in zandcement dekvloeren, actief in heel Nederland. Duidelijke diensten, projecten en een snelle offerte-aanvraag via formulier, WhatsApp of telefoon.'
        : 'Website for a sand-cement screed specialist working across the Netherlands. Clear services, projects and fast quote requests via form, WhatsApp or phone.',
      image: '/portfolio/dekvloerexperts.jpg',
      technologies: ['React', 'TypeScript', 'Tailwind CSS'],
      link: 'https://dekvloerexperts.nl'
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
        lead={nl ? 'Een selectie van websites en webshops die we voor ondernemers hebben gebouwd.' : 'A selection of websites and web shops we built for business owners.'}
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


      <CtaBlock title={t('portfolio.cta.title')} text={t('portfolio.cta.desc')} button={t('portfolio.cta.button')} />
    </PageTransition>
  );
};

export default Portfolio;
