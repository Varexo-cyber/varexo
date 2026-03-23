import React, { useState } from 'react';
import { submitContactForm } from '../services/contactService';
import PageTransition from '../components/PageTransition';
import AnimateOnScroll from '../components/AnimateOnScroll';
import SEO from '../components/SEO';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    naam: '',
    email: '',
    bericht: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      type: 'contact'
    });

    if (result.success) {
      setMessage('Bedankt voor je bericht! We nemen zo snel mogelijk contact met je op.');
      setFormData({ naam: '', email: '', bericht: '' });
    } else {
      setMessage('Er is iets misgegaan. Probeer het opnieuw.');
    }

    setLoading(false);
  };

  return (
    <PageTransition>
    <SEO 
      title="Contact - Gratis Offerte Aanvragen"
      description="Neem contact op met Varexo voor een gratis offerte. Wij helpen je met webdesign, webdevelopment en social media beheer. Snel antwoord, persoonlijke aanpak."
      keywords="contact webdesign, offerte website, gratis offerte, webdesigner contact, website laten maken offerte"
      canonical="/contact"
    />
    <div className="py-20 tech-grid">
      <div className="container mx-auto px-4">
        <AnimateOnScroll>
        <p className="text-primary-400 text-center font-mono text-sm mb-2 tracking-wider">$ ping varexo.nl</p>
        <h1 className="text-4xl font-bold text-center mb-4 text-white">Contact</h1>
        <p className="text-gray-400 text-center mb-16 max-w-xl mx-auto">Stuur een request, wij sturen een response</p>
        </AnimateOnScroll>
        
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="glass-card p-8 rounded-xl">
            <h2 className="text-2xl font-bold mb-6 text-white">Stuur ons een bericht</h2>
            
            {message && (
              <div className={`mb-6 p-4 rounded-lg ${
                message.includes('Bedankt') 
                  ? 'bg-primary-900 text-primary-300 border border-primary-700' 
                  : 'bg-red-900 text-red-300 border border-red-700'
              }`}>
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label htmlFor="naam" className="block text-gray-300 font-semibold mb-2">
                  Naam *
                </label>
                <input
                  type="text"
                  id="naam"
                  name="naam"
                  value={formData.naam}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-dark-600 rounded-lg focus:outline-none focus:border-primary-500 bg-dark-700 text-white placeholder-gray-500"
                  placeholder="Jouw naam"
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="email" className="block text-gray-300 font-semibold mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-dark-600 rounded-lg focus:outline-none focus:border-primary-500 bg-dark-700 text-white placeholder-gray-500"
                  placeholder="jouw@email.nl"
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="bericht" className="block text-gray-300 font-semibold mb-2">
                  Bericht *
                </label>
                <textarea
                  id="bericht"
                  name="bericht"
                  value={formData.bericht}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-2 border border-dark-600 rounded-lg focus:outline-none focus:border-primary-500 bg-dark-700 text-white placeholder-gray-500"
                  placeholder="Waar kunnen we je mee helpen?"
                ></textarea>
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-500 text-dark-900 py-3 rounded-lg font-bold hover:bg-primary-400 transition disabled:opacity-50 disabled:cursor-not-allowed glow-emerald"
              >
                {loading ? 'Versturen...' : 'Verstuur'}
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div>
            <div className="relative overflow-hidden bg-gradient-to-br from-primary-600 to-primary-700 text-white p-8 rounded-xl mb-8 glow-emerald">
              <h2 className="text-2xl font-bold mb-6">Contactgegevens</h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>info@varexo.nl</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>Binnen 24 uur reactie</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Werkzaam in heel Nederland</span>
                </div>
              </div>
            </div>

            <div className="glass-card p-8 rounded-xl">
              <h3 className="text-xl font-semibold mb-4 text-white">Waarom contact opnemen?</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-primary-400 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300">Vrijblijvend adviesgesprek</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-primary-400 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300">Gratis offerte binnen 24 uur</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-primary-400 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300">Technische vragen en support</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-primary-400 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300">Partnerschapsmogelijkheden</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8 text-white">Veelgestelde Vragen</h2>
          <div className="space-y-4">
            <div className="glass-card card-hover p-6 rounded-xl">
              <h3 className="font-semibold mb-2 text-white">Hoe snel kan mijn website online staan?</h3>
              <p className="text-gray-400">
                Dit hangt af van het gekozen pakket. Een Basic website kan binnen 1-2 weken online staan, 
                terwijl maatwerk projecten 4-8 weken duren.
              </p>
            </div>
            <div className="glass-card card-hover p-6 rounded-xl">
              <h3 className="font-semibold mb-2 text-white">Werken jullie ook met vaste prijzen?</h3>
              <p className="text-gray-400">
                Ja, al onze pakketten hebben vaste prijzen. Bij maatwerk projecten ontvang je altijd 
                een gedetailleerde offerte vooraf.
              </p>
            </div>
            <div className="glass-card card-hover p-6 rounded-xl">
              <h3 className="font-semibold mb-2 text-white">Kan ik mijn website zelf beheren?</h3>
              <p className="text-gray-400">
                Ja, we geven altijd uitleg over hoe je zelf content kunt aanpassen. Optioneel kunnen we 
                ook het beheer voor je verzorgen.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </PageTransition>
  );
};

export default Contact;
