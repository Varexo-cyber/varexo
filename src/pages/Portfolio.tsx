import React, { useState } from 'react';
import PageTransition from '../components/PageTransition';
import AnimateOnScroll from '../components/AnimateOnScroll';
import SEO from '../components/SEO';
import { useLanguage } from '../contexts/LanguageContext';

interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  technologies: string[];
  link?: string;
}

const CampaignCard: React.FC<{ language: string }> = ({ language }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const images = ['/portfolio/Campagne 1.jpeg', '/portfolio/Campagne 2.jpeg'];

  const nextImage = () => setCurrentImage((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentImage((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div 
      className="group relative overflow-hidden rounded-xl bg-dark-800 border border-dark-700 hover:border-primary-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary-500/20"
      style={{ animation: 'float 3s ease-in-out infinite' }}
    >
      <div className="relative h-80 overflow-hidden">
        {images.map((img, idx) => (
          <img 
            key={idx}
            src={img}
            alt={language === 'nl' ? `Leegstand Meldpunt campagne ${idx + 1}` : `Vacancy Reporting campaign ${idx + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ${
              idx === currentImage ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/30 to-transparent opacity-60" />
        <div className="absolute top-4 left-4">
          <span className="px-4 py-1.5 bg-blue-500 text-white text-xs font-extrabold rounded-full border-2 border-blue-400">
            {language === 'nl' ? 'Advertentie' : 'Ad Campaign'}
          </span>
        </div>
        <button
          onClick={prevImage}
          className="absolute left-3 top-1/2 -translate-y-1/2 bg-dark-900/70 hover:bg-dark-900 text-white p-2 rounded-full border border-dark-600 transition-all hover:scale-110"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={nextImage}
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-dark-900/70 hover:bg-dark-900 text-white p-2 rounded-full border border-dark-600 transition-all hover:scale-110"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentImage(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                idx === currentImage ? 'bg-primary-400 scale-125' : 'bg-white/40 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-2">
          {language === 'nl' ? 'Leegstand Meldpunt - Campagne' : 'Vacancy Reporting - Campaign'}
        </h3>
        <p className="text-gray-400 text-sm mb-4">
          {language === 'nl'
            ? 'Social media advertentiecampagne gericht op het bereiken van vastgoedeigenaren. Meerdere advertentievarianten A/B getest voor maximale conversie en bereik.'
            : 'Social media ad campaign targeting property owners. Multiple ad variants A/B tested for maximum conversion and reach.'}
        </p>
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="text-center bg-dark-700 rounded-lg p-2 border border-dark-600">
            <div className="text-lg font-bold text-primary-400">10K+</div>
            <p className="text-gray-500 text-[10px]">{language === 'nl' ? 'Bereik / dag' : 'Reach / day'}</p>
          </div>
          <div className="text-center bg-dark-700 rounded-lg p-2 border border-dark-600">
            <div className="text-lg font-bold text-primary-400">3.2%</div>
            <p className="text-gray-500 text-[10px]">CTR</p>
          </div>
          <div className="text-center bg-dark-700 rounded-lg p-2 border border-dark-600">
            <div className="text-lg font-bold text-green-400">Active</div>
            <p className="text-gray-500 text-[10px]">Status</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="px-2 py-1 bg-dark-700 text-blue-300 text-xs rounded border border-dark-600">Meta Ads</span>
          <span className="px-2 py-1 bg-dark-700 text-blue-300 text-xs rounded border border-dark-600">Instagram</span>
          <span className="px-2 py-1 bg-dark-700 text-blue-300 text-xs rounded border border-dark-600">Facebook</span>
        </div>
      </div>
    </div>
  );
};

const Portfolio: React.FC = () => {
  const { t, language } = useLanguage();
  
  const projects: Project[] = [
    {
      id: '1',
      title: language === 'nl' ? 'Leegstand Meldpunt' : 'Vacancy Reporting System',
      category: language === 'nl' ? 'Webapplicatie' : 'Web Application',
      description: language === 'nl' 
        ? 'Meldpunt voor het registreren en rapporteren van leegstaande panden. Gebruiksvriendelijke interface met kaartintegratie en automatische rapportage.'
        : 'Reporting system for vacant properties. User-friendly interface with map integration and automatic reporting.',
      image: '/portfolio/download.png',
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
      image: '/portfolio/Directautohulp.png',
      technologies: ['React', 'Node.js', 'Netlify'],
      link: 'https://directautohulp.nl'
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
    <div className="py-20 matrix-dots">
      <div className="container mx-auto px-4">
        <AnimateOnScroll>
        <p className="text-primary-400 text-center font-mono text-sm mb-2 tracking-wider">$ ls projects/</p>
        <h1 className="text-4xl font-bold text-center mb-4 text-white">{language === 'nl' ? 'Ons Portfolio' : 'Our Portfolio'}</h1>
        <p className="text-xl text-center text-gray-400 mb-8 max-w-2xl mx-auto">
          {language === 'nl' ? 'Ontdek onze recente projecten en zie wat we voor jou kunnen betekenen' : 'Discover our recent projects and see what we can do for you'}
        </p>
        </AnimateOnScroll>
        
        {/* Project Grid - Box Style like Guarantees */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {projects.map((project) => (
            <AnimateOnScroll key={project.id} delay={0}>
              {project.link ? (
                <a 
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block rounded-xl bg-dark-800/50 border border-dark-600 hover:border-primary-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary-500/10 hover:-translate-y-1 p-6 h-full"
                >
                  {/* Category Badge */}
                  <div className="mb-4">
                    <span className="px-3 py-1 bg-primary-500/20 text-primary-400 text-xs font-bold rounded-full border border-primary-500/30">
                      {project.category}
                    </span>
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-lg font-bold text-white mb-3 group-hover:text-primary-400 transition-colors">
                    {project.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                    {project.description}
                  </p>
                  
                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech) => (
                      <span 
                        key={tech}
                        className="px-2 py-1 bg-dark-700/50 text-primary-300 text-xs rounded border border-dark-600"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  
                  {/* Link indicator */}
                  <div className="flex items-center text-primary-400 text-sm font-medium">
                    <span>{t('portfolio.viewWebsite')}</span>
                    <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </a>
              ) : (
                <div className="group block rounded-xl bg-dark-800/50 border border-dark-600 hover:border-primary-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary-500/10 hover:-translate-y-1 p-6 h-full">
                  {/* Category Badge */}
                  <div className="mb-4">
                    <span className="px-3 py-1 bg-primary-500/20 text-primary-400 text-xs font-bold rounded-full border border-primary-500/30">
                      {project.category}
                    </span>
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-lg font-bold text-white mb-3 group-hover:text-primary-400 transition-colors">
                    {project.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                    {project.description}
                  </p>
                  
                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech) => (
                      <span 
                        key={tech}
                        className="px-2 py-1 bg-dark-700/50 text-primary-300 text-xs rounded border border-dark-600"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  
                  <span className="text-gray-500 text-sm">{t('portfolio.internalProject')}</span>
                </div>
              )}
            </AnimateOnScroll>
          ))}
        </div>

        {/* Ads / Campagnes Section */}
        <div className="mt-24">
          <AnimateOnScroll>
            <p className="text-primary-400 text-center font-mono text-sm mb-2 tracking-wider">$ ls campaigns/</p>
            <h2 className="text-3xl font-bold text-center mb-4 text-white">
              {language === 'nl' ? 'Advertentiecampagnes' : 'Ad Campaigns'}
            </h2>
            <p className="text-lg text-center text-gray-400 mb-12 max-w-2xl mx-auto">
              {language === 'nl' 
                ? 'Naast websites beheren wij ook advertentiecampagnes die dagelijks duizenden mensen bereiken. Sterk, doelgericht en resultaatgericht.'
                : 'Besides websites, we also manage ad campaigns that reach thousands of people daily. Strong, targeted and results-driven.'}
            </p>
          </AnimateOnScroll>

          <div className="max-w-2xl mx-auto">
            <AnimateOnScroll delay={0}>
              <CampaignCard language={language} />
            </AnimateOnScroll>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-48">
          <h2 className="text-2xl font-bold text-center mb-12 text-white">{t('portfolio.stats.title')}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-400 text-glow mb-2">10+</div>
              <p className="text-gray-400">{t('portfolio.stats.clients')}</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-400 text-glow mb-2">10+</div>
              <p className="text-gray-400">{t('portfolio.stats.projects')}</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-400 text-glow mb-2">99.9%</div>
              <p className="text-gray-400">{t('portfolio.stats.uptime')}</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-400 text-glow mb-2">&lt;24h</div>
              <p className="text-gray-400">{t('portfolio.stats.response')}</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-24 text-center">
          <div className="glass-card p-12 rounded-xl max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-white">{t('portfolio.cta.title')}</h2>
            <p className="text-gray-400 mb-8">
              {t('portfolio.cta.desc')}
            </p>
            <a 
              href="/contact" 
              className="bg-primary-500 text-dark-900 px-8 py-3 rounded-lg font-bold hover:bg-primary-400 transition inline-block glow-emerald">
              {t('portfolio.cta.button')}
            </a>
          </div>
        </div>
      </div>
    </div>
    </PageTransition>
  );
};

export default Portfolio;
