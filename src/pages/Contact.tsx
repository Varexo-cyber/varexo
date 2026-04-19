import React, { useState } from 'react';
import { submitContactForm } from '../services/contactService';
import PageTransition from '../components/PageTransition';
import AnimateOnScroll from '../components/AnimateOnScroll';
import SEO from '../components/SEO';
import { useLanguage } from '../contexts/LanguageContext';

const Contact: React.FC = () => {
  const { t } = useLanguage();
  
  const [formData, setFormData] = useState({
    naam: '',
    email: '',
    telefoon: '',
    bedrijf: '',
    projectType: '',
    bericht: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const result = await submitContactForm({
      ...formData,
      type: 'quote'
    });

    if (result.success) {
      setMessage('Perfect! Je offerte aanvraag is ontvangen. We sturen je binnen 24 uur een vrijblijvende offerte.');
      setFormData({ naam: '', email: '', telefoon: '', bedrijf: '', projectType: '', bericht: '' });
    } else {
      setMessage('Er is iets misgegaan. Probeer het opnieuw of neem direct contact op via WhatsApp.');
    }

    setLoading(false);
  };

  const handleWhatsAppClick = () => {
    const message = `Hoi Varexo, ik heb interesse in een ${formData.projectType || 'website'}. Mijn naam is ${formData.naam || '[naam]'} en mijn bedrijf is ${formData.bedrijf || '[bedrijfsnaam]'}. Kunnen we een offerte bespreken?`;
    window.open(`https://wa.me/31636075966?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <PageTransition>
    <SEO 
      title="Offerte Aanvragen - Gratis Website Offerte"
      description="Vraag direct een gratis offerte aan voor uw website, webshop of social media management. Snelle respons via contactformulier of WhatsApp. Varexo - Professionele webdesign."
      keywords="offerte aanvragen, website offerte, gratis offerte, webdesign offerte, social media management offerte"
      canonical="/contact"
    />
    <div className="py-20 matrix-dots">
      <div className="container mx-auto px-4">
        <AnimateOnScroll>
        <p className="text-primary-400 text-center font-mono text-sm mb-2 tracking-wider">{t('contact.tag')}</p>
        <h1 className="text-4xl font-bold text-center mb-4 text-white">{t('contact.title')}</h1>
        <p className="text-xl text-center text-gray-400 mb-16 max-w-2xl mx-auto">
          {t('contact.subtitle')}
        </p>
        </AnimateOnScroll>
        
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Offerte Form */}
          <div className="lg:col-span-2">
            <div className="glass-card p-8 rounded-xl">
              <h2 className="text-2xl font-bold mb-6 text-white">{t('contact.form.title')}</h2>
              
              {message && (
                <div className={`mb-6 p-4 rounded-lg ${
                  message.includes('Perfect') 
                    ? 'bg-primary-900 text-primary-300 border border-primary-700' 
                    : 'bg-red-900 text-red-300 border border-red-700'
                }`}>
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="naam" className="block text-gray-300 font-semibold mb-2">
                      {t('contact.form.name')} *
                    </label>
                    <input
                      type="text"
                      id="naam"
                      name="naam"
                      value={formData.naam}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-dark-600 rounded-lg focus:outline-none focus:border-primary-500 bg-dark-700 text-white placeholder-gray-500"
                      placeholder={t('contact.form.name.placeholder')}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-gray-300 font-semibold mb-2">
                      {t('contact.form.email')} *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-dark-600 rounded-lg focus:outline-none focus:border-primary-500 bg-dark-700 text-white placeholder-gray-500"
                      placeholder={t('contact.form.email.placeholder')}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="telefoon" className="block text-gray-300 font-semibold mb-2">
                      {t('contact.form.phone')}
                    </label>
                    <input
                      type="tel"
                      id="telefoon"
                      name="telefoon"
                      value={formData.telefoon}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-dark-600 rounded-lg focus:outline-none focus:border-primary-500 bg-dark-700 text-white placeholder-gray-500"
                      placeholder={t('contact.form.phone.placeholder')}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="bedrijf" className="block text-gray-300 font-semibold mb-2">
                      {t('contact.form.company')}
                    </label>
                    <input
                      type="text"
                      id="bedrijf"
                      name="bedrijf"
                      value={formData.bedrijf}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-dark-600 rounded-lg focus:outline-none focus:border-primary-500 bg-dark-700 text-white placeholder-gray-500"
                      placeholder={t('contact.form.company.placeholder')}
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="projectType" className="block text-gray-300 font-semibold mb-2">
                    {t('contact.form.projectType')} *
                  </label>
                  <select
                    id="projectType"
                    name="projectType"
                    value={formData.projectType}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-dark-600 rounded-lg focus:outline-none focus:border-primary-500 bg-dark-700 text-white"
                  >
                    <option value="">{t('contact.form.projectType.placeholder')}</option>
                    <option value="website">{t('contact.form.projectType.website')}</option>
                    <option value="webshop">{t('contact.form.projectType.webshop')}</option>
                    <option value="social-media">{t('contact.form.projectType.social')}</option>
                    <option value="seo">{t('contact.form.projectType.seo')}</option>
                    <option value="maatwerk">{t('contact.form.projectType.custom')}</option>
                    <option value="onderhoud">{t('contact.form.projectType.maintenance')}</option>
                    <option value="anders">{t('contact.form.projectType.other')}</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="bericht" className="block text-gray-300 font-semibold mb-2">
                    {t('contact.form.description')} *
                  </label>
                  <textarea
                    id="bericht"
                    name="bericht"
                    value={formData.bericht}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-2 border border-dark-600 rounded-lg focus:outline-none focus:border-primary-500 bg-dark-700 text-white placeholder-gray-500"
                    placeholder={t('contact.form.description.placeholder')}
                  ></textarea>
                </div>
                
                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-primary-500 text-dark-900 py-3 rounded-lg font-bold hover:bg-primary-400 transition disabled:opacity-50 disabled:cursor-not-allowed glow-emerald"
                  >
                    {loading ? t('contact.form.sending') : t('contact.form.submit')}
                  </button>
                  
                  <button
                    type="button"
                    onClick={handleWhatsAppClick}
                    className="flex-1 bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-500 transition flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.149-.67.149-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.057-.371-.057-.566-.149-.198-1.356-1.653-1.511-1.95-.149-.297-.074-.458.074-.606.076-.099.173-.149.297-.248.124-.099.248-.198.371-.297.124-.099.198-.198.297-.347.099-.148.05-.297-.05-.445-.099-.148-.894-2.151-1.225-2.943-.322-.788-.645-.676-.894-.676-.248 0-.496-.05-.744-.05-.297 0-.744.149-1.134.676-.39.527-1.48 1.447-1.48 3.531 0 2.084 1.511 4.094 1.723 4.295.213.2 2.966 4.531 7.193 6.354.99.428 1.761.684 2.36.876.99.313 1.894.269 2.607.163.795-.119 2.447-1 2.794-1.965.347-.966.347-1.789.248-1.95-.099-.16-.348-.248-.744-.445z"/>
                    </svg>
                    WhatsApp
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            {/* WhatsApp Card */}
            <div className="relative overflow-hidden bg-gradient-to-br from-green-600 to-green-700 text-white p-8 rounded-xl glow-green">
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-400/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <div className="relative">
                <h3 className="text-2xl font-bold mb-4">{t('contact.whatsapp.title')}</h3>
                <p className="text-green-100 mb-6">
                  {t('contact.whatsapp.desc')}
                </p>
                <button
                  onClick={handleWhatsAppClick}
                  className="w-full bg-white text-green-600 py-3 rounded-lg font-bold hover:bg-green-50 transition flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.149-.67.149-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.057-.371-.057-.566-.149-.198-1.356-1.653-1.511-1.95-.149-.297-.074-.458.074-.606.076-.099.173-.149.297-.248.124-.099.248-.198.371-.297.124-.099.198-.198.297-.347.099-.148.05-.297-.05-.445-.099-.148-.894-2.151-1.225-2.943-.322-.788-.645-.676-.894-.676-.248 0-.496-.05-.744-.05-.297 0-.744.149-1.134.676-.39.527-1.48 1.447-1.48 3.531 0 2.084 1.511 4.094 1.723 4.295.213.2 2.966 4.531 7.193 6.354.99.428 1.761.684 2.36.876.99.313 1.894.269 2.607.163.795-.119 2.447-1 2.794-1.965.347-.966.347-1.789.248-1.95-.099-.16-.348-.248-.744-.445z"/>
                  </svg>
                  {t('contact.whatsapp.button')}
                </button>
              </div>
            </div>

            {/* Contact Info */}
            <div className="glass-card p-6 rounded-xl">
              <h3 className="text-xl font-semibold mb-4 text-white">{t('contact.info.title')}</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-primary-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a href="mailto:info@varexo.nl" className="text-gray-300 hover:text-primary-400 transition-colors">info@varexo.nl</a>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-primary-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <a href="tel:+31636075966" className="text-gray-300 hover:text-primary-400 transition-colors">+31 6 36075966</a>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-primary-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-gray-300">{t('contact.info.response')}</span>
                </div>
              </div>
            </div>

            {/* Why Choose Us */}
            <div className="glass-card p-6 rounded-xl">
              <h3 className="text-xl font-semibold mb-4 text-white">{t('contact.why.title')}</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-primary-400 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300 text-sm">{t('contact.why.quote')}</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-primary-400 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300 text-sm">{t('contact.why.pricing')}</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-primary-400 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300 text-sm">{t('contact.why.uptime')}</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-primary-400 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300 text-sm">{t('contact.why.personal')}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Process Steps */}
        <div className="glass-card p-8 rounded-xl max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8 text-white">{t('contact.process.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-500 text-dark-900 rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-3">1</div>
              <h3 className="font-semibold text-white mb-2">{t('contact.process.step1.title')}</h3>
              <p className="text-gray-400 text-sm">{t('contact.process.step1.desc')}</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-500 text-dark-900 rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-3">2</div>
              <h3 className="font-semibold text-white mb-2">{t('contact.process.step2.title')}</h3>
              <p className="text-gray-400 text-sm">{t('contact.process.step2.desc')}</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-500 text-dark-900 rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-3">3</div>
              <h3 className="font-semibold text-white mb-2">{t('contact.process.step3.title')}</h3>
              <p className="text-gray-400 text-sm">{t('contact.process.step3.desc')}</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-500 text-dark-900 rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-3">4</div>
              <h3 className="font-semibold text-white mb-2">{t('contact.process.step4.title')}</h3>
              <p className="text-gray-400 text-sm">{t('contact.process.step4.desc')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </PageTransition>
  );
};

export default Contact;
