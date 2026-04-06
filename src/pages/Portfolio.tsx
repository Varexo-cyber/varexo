import React from 'react';
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
        
        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {projects.map((project, index) => (
            <AnimateOnScroll key={project.id} delay={index * 100}>
              <div className="group relative overflow-hidden rounded-xl bg-dark-800 border border-dark-700 hover:border-primary-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary-500/10">
                {/* Image Container */}
                <div className="relative h-56 overflow-hidden">
                  <div 
                    className="absolute inset-0 bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center group-hover:scale-110 transition-transform duration-500"
                  >
                    {project.link ? (
                      <img 
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="text-center">
                        <svg className="w-16 h-16 text-white/30 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span className="text-white/50 text-sm">{project.title}</span>
                      </div>
                    )}
                  </div>
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="px-4 py-1.5 bg-primary-500 text-dark-900 text-xs font-extrabold rounded-full border-2 border-primary-400 glow-badge">
                      {language === 'nl' ? project.category : project.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary-400 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {project.description}
                  </p>
                  
                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech) => (
                      <span 
                        key={tech}
                        className="px-2 py-1 bg-dark-700 text-primary-300 text-xs rounded border border-dark-600"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Action Button */}
                  {project.link ? (
                    <a 
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-primary-400 hover:text-primary-300 text-sm font-medium transition-colors"
                    >
                      {t('portfolio.viewWebsite')}
                      <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </a>
                  ) : (
                    <span className="text-gray-500 text-sm">{t('portfolio.internalProject')}</span>
                  )}
                </div>
              </div>
            </AnimateOnScroll>
          ))}
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
