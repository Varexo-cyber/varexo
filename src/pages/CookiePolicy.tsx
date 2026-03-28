import React from 'react';
import PageTransition from '../components/PageTransition';
import { useLanguage } from '../contexts/LanguageContext';

const CookiePolicy: React.FC = () => {
  const { t } = useLanguage();
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

              <h2 className="text-2xl font-semibold mb-4 text-white">1. Wat zijn cookies?</h2>
              <p className="text-gray-300 mb-6">
                Cookies zijn kleine tekstbestanden die op jouw computer, tablet of mobiele apparaat 
                worden opgeslagen wanneer je onze website bezoekt. Ze helpen ons om de website beter 
                te laten functioneren en jouw gebruikerservaring te verbeteren.
              </p>

              <h2 className="text-2xl font-semibold mb-4 text-white">2. Welke cookies gebruiken we?</h2>
              
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3 text-white">2.1 Essentiële cookies</h3>
                <p className="text-gray-300 mb-4">
                  Deze cookies zijn noodzakelijk voor de basisfunctionaliteit van de website:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-300 mb-4">
                  <li>Sessie cookies voor gebruikersauthenticatie</li>
                  <li>Beveiligingstokens</li>
                  <li>Load balancing cookies</li>
                </ul>
                <p className="text-gray-400 text-sm mb-4">
                  <strong>Opslagperiode:</strong> Sessie tot 24 uur
                </p>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3 text-white">2.2 Analytische cookies</h3>
                <p className="text-gray-300 mb-4">
                  Deze cookies helpen ons begrijpen hoe bezoekers onze website gebruiken:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-300 mb-4">
                  <li>Google Analytics</li>
                  <li>Bezoekersstatistieken</li>
                  <li>Tijd op pagina</li>
                  <li>Gevolgde paden</li>
                </ul>
                <p className="text-gray-400 text-sm mb-4">
                  <strong>Opslagperiode:</strong> 26 maanden
                </p>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3 text-white">2.3 Functionele cookies</h3>
                <p className="text-gray-300 mb-4">
                  Deze cookies onthouden jouw voorkeuren en instellingen:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-300 mb-4">
                  <li>Taalvoorkeuren</li>
                  <li>Cookie toestemming</li>
                  <li>Formulier data</li>
                </ul>
                <p className="text-gray-400 text-sm mb-4">
                  <strong>Opslagperiode:</strong> 1 jaar
                </p>
              </div>

              <h2 className="text-2xl font-semibold mb-4 text-white">3. Waarom gebruiken we cookies?</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-300 mb-6">
                <li><strong>Functioneel:</strong> Om de website correct te laten werken</li>
                <li><strong>Analytics:</strong> Om websiteprestaties te meten en te verbeteren</li>
                <li><strong>Gebruikerservaring:</strong> Om gepersonaliseerde content te tonen</li>
                <li><strong>Beveiliging:</strong> Om de website te beschermen tegen fraude</li>
              </ul>

              <h2 className="text-2xl font-semibold mb-4 text-white">4. Cookie toestemming</h2>
              <p className="text-gray-300 mb-6">
                Wanneer je voor het eerst onze website bezoekt, zie je een cookie banner. 
                Hier kun je kiezen welke cookies je accepteert:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-300 mb-6">
                <li><strong>Alleen essentiële cookies:</strong> Noodzakelijke cookies alleen</li>
                <li><strong>Alle cookies accepteren:</strong> Essentiële + analytische + functionele cookies</li>
                <li><strong>Weigeren:</strong> Alleen strikt noodzakelijke cookies</li>
              </ul>

              <h2 className="text-2xl font-semibold mb-4 text-white">5. Cookies beheren</h2>
              <p className="text-gray-300 mb-6">
                Je kunt op elk moment jouw cookie voorkeuren wijzigen via:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-300 mb-6">
                <li>De cookie instellingen knop onderaan de website</li>
                <li>Jouw browser instellingen</li>
                <li>Google Ads instellingen (voor advertentie cookies)</li>
  </ul>

              <h2 className="text-2xl font-semibold mb-4 text-white">6. Cookies in je browser</h2>
              <p className="text-gray-300 mb-6">
                Je kunt cookies blokkeren of verwijderen via je browser instellingen. 
                Let op: dit kan de functionaliteit van onze website beïnvloeden.
              </p>
              
              <div className="bg-dark-700 p-4 rounded-lg mb-6 border border-dark-600">
                <h3 className="font-semibold mb-2 text-white">Veelgebruikte browsers:</h3>
                <ul className="space-y-1 text-gray-300 text-sm">
                  <li><strong>Chrome:</strong> Instellingen → Privacy en beveiliging → Cookies</li>
                  <li><strong>Firefox:</strong> Opties → Privacy & Beveiliging → Cookies</li>
                  <li><strong>Safari:</strong> Voorkeuren → Privacy → Cookies</li>
                  <li><strong>Edge:</strong> Instellingen → Cookies en sitepermissies</li>
                </ul>
              </div>

              <h2 className="text-2xl font-semibold mb-4 text-white">7. Third-party cookies</h2>
              <p className="text-gray-300 mb-6">
                Onze website maakt gebruik van enkele third-party services die cookies kunnen plaatsen:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-300 mb-6">
                <li><strong>Google Analytics:</strong> Voor website statistieken</li>
                <li><strong>Google Fonts:</strong> Voor lettertypen</li>
                <li><strong>YouTube/Vimeo:</strong> Voor video embeds</li>
              </ul>

              <h2 className="text-2xl font-semibold mb-4 text-white">8. Cookie updates</h2>
              <p className="text-gray-300 mb-6">
                We kunnen deze cookie policy van tijd tot tijd bijwerken. De meest recente versie 
                is altijd beschikbaar op onze website. Belangrijke wijzigingen communiceren we 
                via de website of e-mail.
              </p>

              <h2 className="text-2xl font-semibold mb-4 text-white">9. Contact</h2>
              <p className="text-gray-300 mb-6">
                Als je vragen hebt over ons cookiebeleid, neem dan contact met ons op:
              </p>
              <div className="bg-dark-700 p-4 rounded-lg mb-6 border border-dark-600">
                <p className="text-gray-300">
                  <strong>Varexo</strong><br />
                  E-mail: info@varexo.nl<br />
                  Website: www.varexo.nl
                </p>
              </div>

              <div className="bg-primary-900 p-4 rounded-lg border border-primary-700">
                <h3 className="font-semibold mb-2 text-primary-300">Samenvatting</h3>
                <p className="text-gray-300 text-sm">
                  We gebruiken cookies om onze website te verbeteren en jouw ervaring te optimaliseren. 
                  Essentiële cookies zijn altijd nodig, andere cookies kun je accepteren of weigeren. 
                  Jouw privacy en keuzevrijheid staan voorop.
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
