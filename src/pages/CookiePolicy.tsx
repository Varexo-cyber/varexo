import React from 'react';
import PageTransition from '../components/PageTransition';
import { useLanguage } from '../contexts/LanguageContext';

const CookiePolicy: React.FC = () => {
  const { t, language } = useLanguage();
  const isNL = language === 'nl';
  return (
    <PageTransition>
    <div className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-white">{t('footer.cookiePolicy')}</h1>
          
          <div className="bg-dark-800 p-8 rounded-lg shadow-lg border border-dark-700">
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-400 mb-6">
                {t('language') === 'nl' ? 'Laatst bijgewerkt:' : 'Last updated:'} {new Date().toLocaleDateString('nl-NL')}
              </p>

              <h2 className="text-2xl font-semibold mb-4 text-white">1. {isNL ? 'Wat zijn cookies?' : 'What are cookies?'}</h2>
              <p className="text-gray-300 mb-6">
                {isNL 
                  ? 'Cookies zijn kleine tekstbestanden die op jouw computer, tablet of mobiele apparaat worden opgeslagen wanneer je onze website bezoekt. Ze helpen ons om de website beter te laten functioneren en jouw gebruikerservaring te verbeteren.'
                  : 'Cookies are small text files that are stored on your computer, tablet, or mobile device when you visit our website. They help us make the website work better and improve your user experience.'}
              </p>

              <h2 className="text-2xl font-semibold mb-4 text-white">2. {isNL ? 'Welke cookies gebruiken we?' : 'What cookies do we use?'}</h2>
              
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3 text-white">2.1 {isNL ? 'Essentiële cookies' : 'Essential cookies'}</h3>
                <p className="text-gray-300 mb-4">
                  {isNL ? 'Deze cookies zijn noodzakelijk voor de basisfunctionaliteit van de website:' : 'These cookies are necessary for the basic functionality of the website:'}
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-300 mb-4">
                  <li>Sessie cookies voor gebruikersauthenticatie</li>
                  <li>Beveiligingstokens</li>
                  <li>Load balancing cookies</li>
                </ul>
                <p className="text-gray-400 text-sm mb-4">
                  <strong>{isNL ? 'Opslagperiode:' : 'Storage period:'}</strong> {isNL ? 'Sessie tot 24 uur' : 'Session up to 24 hours'}
                </p>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3 text-white">2.2 {isNL ? 'Analytische cookies' : 'Analytics cookies'}</h3>
                <p className="text-gray-300 mb-4">
                  {isNL ? 'Deze cookies helpen ons begrijpen hoe bezoekers onze website gebruiken:' : 'These cookies help us understand how visitors use our website:'}
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-300 mb-4">
                  <li>Google Analytics</li>
                  <li>Bezoekersstatistieken</li>
                  <li>Tijd op pagina</li>
                  <li>Gevolgde paden</li>
                </ul>
                <p className="text-gray-400 text-sm mb-4">
                  <strong>{isNL ? 'Opslagperiode:' : 'Storage period:'}</strong> {isNL ? '26 maanden' : '26 months'}
                </p>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3 text-white">2.3 {isNL ? 'Functionele cookies' : 'Functional cookies'}</h3>
                <p className="text-gray-300 mb-4">
                  {isNL ? 'Deze cookies onthouden jouw voorkeuren en instellingen:' : 'These cookies remember your preferences and settings:'}
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-300 mb-4">
                  <li>Taalvoorkeuren</li>
                  <li>Cookie toestemming</li>
                  <li>Formulier data</li>
                </ul>
                <p className="text-gray-400 text-sm mb-4">
                  <strong>{isNL ? 'Opslagperiode:' : 'Storage period:'}</strong> {isNL ? '1 jaar' : '1 year'}
                </p>
              </div>

              <h2 className="text-2xl font-semibold mb-4 text-white">3. {isNL ? 'Waarom gebruiken we cookies?' : 'Why do we use cookies?'}</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-300 mb-6">
                <li><strong>{isNL ? 'Functioneel:' : 'Functional:'}</strong> {isNL ? 'Om de website correct te laten werken' : 'To make the website work properly'}</li>
                <li><strong>Analytics:</strong> {isNL ? 'Om websiteprestaties te meten en te verbeteren' : 'To measure and improve website performance'}</li>
                <li><strong>{isNL ? 'Gebruikerservaring:' : 'User experience:'}</strong> {isNL ? 'Om gepersonaliseerde content te tonen' : 'To show personalized content'}</li>
                <li><strong>{isNL ? 'Beveiliging:' : 'Security:'}</strong> {isNL ? 'Om de website te beschermen tegen fraude' : 'To protect the website against fraud'}</li>
              </ul>

              <h2 className="text-2xl font-semibold mb-4 text-white">4. {isNL ? 'Cookie toestemming' : 'Cookie consent'}</h2>
              <p className="text-gray-300 mb-6">
                {isNL 
                  ? 'Wanneer je voor het eerst onze website bezoekt, zie je een cookie banner. Hier kun je kiezen welke cookies je accepteert:'
                  : 'When you first visit our website, you will see a cookie banner. Here you can choose which cookies you accept:'}
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-300 mb-6">
                <li><strong>{isNL ? 'Alleen essentiële cookies:' : 'Essential cookies only:'}</strong> {isNL ? 'Noodzakelijke cookies alleen' : 'Necessary cookies only'}</li>
                <li><strong>{isNL ? 'Alle cookies accepteren:' : 'Accept all cookies:'}</strong> {isNL ? 'Essentiële + analytische + functionele cookies' : 'Essential + analytics + functional cookies'}</li>
                <li><strong>{isNL ? 'Weigeren:' : 'Decline:'}</strong> {isNL ? 'Alleen strikt noodzakelijke cookies' : 'Only strictly necessary cookies'}</li>
              </ul>

              <h2 className="text-2xl font-semibold mb-4 text-white">5. {isNL ? 'Cookies beheren' : 'Managing cookies'}</h2>
              <p className="text-gray-300 mb-6">
                {isNL ? 'Je kunt op elk moment jouw cookie voorkeuren wijzigen via:' : 'You can change your cookie preferences at any time via:'}
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-300 mb-6">
                <li>{isNL ? 'De cookie instellingen knop onderaan de website' : 'The cookie settings button at the bottom of the website'}</li>
                <li>{isNL ? 'Jouw browser instellingen' : 'Your browser settings'}</li>
                <li>{isNL ? 'Google Ads instellingen (voor advertentie cookies)' : 'Google Ads settings (for advertising cookies)'}</li>
  </ul>

              <h2 className="text-2xl font-semibold mb-4 text-white">6. {isNL ? 'Cookies in je browser' : 'Cookies in your browser'}</h2>
              <p className="text-gray-300 mb-6">
                {isNL 
                  ? 'Je kunt cookies blokkeren of verwijderen via je browser instellingen. Let op: dit kan de functionaliteit van onze website beïnvloeden.'
                  : 'You can block or delete cookies via your browser settings. Note: this may affect the functionality of our website.'}
              </p>
              
              <div className="bg-dark-700 p-4 rounded-lg mb-6 border border-dark-600">
                <h3 className="font-semibold mb-2 text-white">{isNL ? 'Veelgebruikte browsers:' : 'Common browsers:'}</h3>
                <ul className="space-y-1 text-gray-300 text-sm">
                  <li><strong>Chrome:</strong> {isNL ? 'Instellingen → Privacy en beveiliging → Cookies' : 'Settings → Privacy and security → Cookies'}</li>
                  <li><strong>Firefox:</strong> {isNL ? 'Opties → Privacy & Beveiliging → Cookies' : 'Options → Privacy & Security → Cookies'}</li>
                  <li><strong>Safari:</strong> {isNL ? 'Voorkeuren → Privacy → Cookies' : 'Preferences → Privacy → Cookies'}</li>
                  <li><strong>Edge:</strong> {isNL ? 'Instellingen → Cookies en sitepermissies' : 'Settings → Cookies and site permissions'}</li>
                </ul>
              </div>

              <h2 className="text-2xl font-semibold mb-4 text-white">7. {isNL ? 'Third-party cookies' : 'Third-party cookies'}</h2>
              <p className="text-gray-300 mb-6">
                {isNL 
                  ? 'Onze website maakt gebruik van enkele third-party services die cookies kunnen plaatsen:'
                  : 'Our website uses several third-party services that may place cookies:'}
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-300 mb-6">
                <li><strong>Google Analytics:</strong> {isNL ? 'Voor website statistieken' : 'For website statistics'}</li>
                <li><strong>Google Fonts:</strong> {isNL ? 'Voor lettertypen' : 'For fonts'}</li>
                <li><strong>YouTube/Vimeo:</strong> {isNL ? 'Voor video embeds' : 'For video embeds'}</li>
              </ul>

              <h2 className="text-2xl font-semibold mb-4 text-white">8. {isNL ? 'Cookie updates' : 'Cookie updates'}</h2>
              <p className="text-gray-300 mb-6">
                {isNL 
                  ? 'We kunnen deze cookie policy van tijd tot tijd bijwerken. De meest recente versie is altijd beschikbaar op onze website. Belangrijke wijzigingen communiceren we via de website of e-mail.'
                  : 'We may update this cookie policy from time to time. The most recent version is always available on our website. We will communicate important changes via the website or email.'}
              </p>

              <h2 className="text-2xl font-semibold mb-4 text-white">9. {isNL ? 'Contact' : 'Contact'}</h2>
              <p className="text-gray-300 mb-6">
                {isNL 
                  ? 'Als je vragen hebt over ons cookiebeleid, neem dan contact met ons op:'
                  : 'If you have questions about our cookie policy, please contact us:'}
              </p>
              <div className="bg-dark-700 p-4 rounded-lg mb-6 border border-dark-600">
                <p className="text-gray-300">
                  <strong>Varexo</strong><br />
                  E-mail: info@varexo.nl<br />
                  Website: www.varexo.nl
                </p>
              </div>

              <div className="bg-primary-900 p-4 rounded-lg border border-primary-700">
                <h3 className="font-semibold mb-2 text-primary-300">{isNL ? 'Samenvatting' : 'Summary'}</h3>
                <p className="text-gray-300 text-sm">
                  {isNL 
                    ? 'We gebruiken cookies om onze website te verbeteren en jouw ervaring te optimaliseren. Essentiële cookies zijn altijd nodig, andere cookies kun je accepteren of weigeren. Jouw privacy en keuzevrijheid staan voorop.'
                    : 'We use cookies to improve our website and optimize your experience. Essential cookies are always needed, other cookies you can accept or decline. Your privacy and freedom of choice come first.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </PageTransition>
  );
};

export default CookiePolicy;
