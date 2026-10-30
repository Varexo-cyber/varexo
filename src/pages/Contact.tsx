import React, { useState } from 'react';
import { submitContactForm } from '../services/contactService';
import PageTransition from '../components/PageTransition';
import AnimateOnScroll from '../components/AnimateOnScroll';
import SEO from '../components/SEO';
import { useLanguage } from '../contexts/LanguageContext';
import { SpotlightCard } from '../components/Interactive';
import { PageHero, ArrowIcon, CheckIcon } from '../components/Section';

const Contact: React.FC = () => {
  const { t, language } = useLanguage();
  const nl = language === 'nl';
  const [honeypot, setHoneypot] = useState('');
  
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
      website: honeypot,
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

  const projectTypes = [
    ['website', t('contact.form.projectType.website')],
    ['webshop', t('contact.form.projectType.webshop')],
    ['maatwerk', t('contact.form.projectType.custom')],
    ['social-media', t('contact.form.projectType.social')],
    ['seo', t('contact.form.projectType.seo')],
    ['onderhoud', t('contact.form.projectType.maintenance')],
    ['anders', t('contact.form.projectType.other')],
  ];

  return (
    <PageTransition>
      <SEO
        title="Offerte Aanvragen - Gratis Website Offerte"
        description="Vraag direct een gratis offerte aan voor uw website, webshop of social media management. Snelle respons via contactformulier of WhatsApp. Varexo - Professionele webdesign."
        keywords="offerte aanvragen, website offerte, gratis offerte, webdesign offerte, social media management offerte"
        canonical="/contact"
      />

      <PageHero
        eyebrow={nl ? 'Contact' : 'Contact'}
        title={nl ? <>Laten we iets moois <span className="serif text-primary-300">bouwen.</span></> : <>Let&apos;s build something <span className="serif text-primary-300">great.</span></>}
        lead={t('contact.subtitle')}
      />

      <section className="pb-28 bg-dark-950">
        <div className="container mx-auto px-4 max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-4">
          <AnimateOnScroll className="lg:col-span-8">
            <div className="surface p-6 md:p-10">
              <h2 className="text-2xl font-semibold text-white mb-1">{t('contact.form.title')}</h2>
              <p className="text-gray-400 mb-8">{nl ? 'Vrijblijvend. We reageren binnen 24 uur.' : 'No obligation. We reply within 24 hours.'}</p>

              {message && (
                <div className={`mb-6 p-4 rounded-2xl text-sm ${message.startsWith('Perfect') ? 'bg-primary-500/10 text-primary-200 border border-primary-500/30' : 'bg-red-500/10 text-red-300 border border-red-500/30'}`}>
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Honeypot: invisible for people, bots fill it in */}
                <input type="text" name="website" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

                <div>
                  <span className="label">{t('contact.form.projectType')} *</span>
                  <div className="flex flex-wrap gap-2">
                    {projectTypes.map(([v, l]) => (
                      <button type="button" key={v} onClick={() => setFormData({ ...formData, projectType: v })}
                        className={`px-4 py-2 rounded-full text-sm border transition ${formData.projectType === v ? 'bg-primary-500 border-primary-500 text-dark-950 font-semibold' : 'border-white/10 text-gray-300 hover:border-white/30'}`}>
                        {l}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="naam" className="label">{t('contact.form.name')} *</label>
                    <input type="text" id="naam" name="naam" value={formData.naam} onChange={handleChange} required className="field" placeholder={t('contact.form.name.placeholder')} />
                  </div>
                  <div>
                    <label htmlFor="email" className="label">{t('contact.form.email')} *</label>
                    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className="field" placeholder={t('contact.form.email.placeholder')} />
                  </div>
                  <div>
                    <label htmlFor="telefoon" className="label">{t('contact.form.phone')}</label>
                    <input type="tel" id="telefoon" name="telefoon" value={formData.telefoon} onChange={handleChange} className="field" placeholder={t('contact.form.phone.placeholder')} />
                  </div>
                  <div>
                    <label htmlFor="bedrijf" className="label">{t('contact.form.company')}</label>
                    <input type="text" id="bedrijf" name="bedrijf" value={formData.bedrijf} onChange={handleChange} className="field" placeholder={t('contact.form.company.placeholder')} />
                  </div>
                </div>

                <div>
                  <label htmlFor="bericht" className="label">{t('contact.form.description')} *</label>
                  <textarea id="bericht" name="bericht" value={formData.bericht} onChange={handleChange} required rows={5} className="field resize-none" placeholder={t('contact.form.description.placeholder')} />
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button type="submit" disabled={loading || !formData.projectType} className="btn-primary-modern justify-center flex-1 disabled:opacity-50 disabled:cursor-not-allowed">
                    {loading ? t('contact.form.sending') : t('contact.form.submit')}
                    {!loading && <ArrowIcon />}
                  </button>
                  <button type="button" onClick={handleWhatsAppClick} className="btn-ghost-modern justify-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg> WhatsApp
                  </button>
                </div>
              </form>
            </div>
          </AnimateOnScroll>

          <div className="lg:col-span-4 space-y-4">
            <AnimateOnScroll delay={0.06}>
              <SpotlightCard className="surface p-8">
                <h3 className="text-lg font-semibold text-white mb-5">{t('contact.info.title')}</h3>
                <div className="space-y-2">
                  <a href="mailto:info@varexo.nl" className="surface-inner flex items-center justify-between px-4 py-3 text-sm text-gray-200 hover:border-primary-500/40 transition">info@varexo.nl <ArrowIcon /></a>
                  <a href="tel:+31636075966" className="surface-inner flex items-center justify-between px-4 py-3 text-sm text-gray-200 hover:border-primary-500/40 transition">+31 6 36075966 <ArrowIcon /></a>
                  <button onClick={handleWhatsAppClick} className="w-full surface-inner flex items-center justify-between px-4 py-3 text-sm text-gray-200 hover:border-primary-500/40 transition">{t('contact.whatsapp.button')} <ArrowIcon /></button>
                </div>
                <p className="mt-5 text-sm text-gray-500 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-primary-400 animate-pulse" />{t('contact.info.response')}</p>
              </SpotlightCard>
            </AnimateOnScroll>
            <AnimateOnScroll delay={0.12}>
              <SpotlightCard className="surface p-8">
                <h3 className="text-lg font-semibold text-white mb-5">{t('contact.why.title')}</h3>
                <ul className="space-y-3">
                  {['quote', 'pricing', 'uptime', 'personal'].map((k) => (
                    <li key={k} className="flex items-start gap-3 text-sm text-gray-300"><span className="check-dot mt-0.5"><CheckIcon /></span>{t(`contact.why.${k}`)}</li>
                  ))}
                </ul>
              </SpotlightCard>
            </AnimateOnScroll>
          </div>

          <AnimateOnScroll className="lg:col-span-12">
            <div className="surface p-8 md:p-10 mt-4">
              <h2 className="text-xl font-semibold text-white mb-8">{t('contact.process.title')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {[1, 2, 3, 4].map((n) => (
                  <div key={n}>
                    <div className="w-9 h-9 rounded-full bg-white text-dark-950 flex items-center justify-center text-sm font-bold mb-4">{n}</div>
                    <h3 className="font-semibold text-white mb-1">{t(`contact.process.step${n}.title`)}</h3>
                    <p className="text-gray-400 text-sm">{t(`contact.process.step${n}.desc`)}</p>
                  </div>
                ))}
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>
    </PageTransition>
  );
};

export default Contact;
