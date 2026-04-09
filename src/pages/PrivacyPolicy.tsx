import React from 'react';
import PageTransition from '../components/PageTransition';
import { useLanguage } from '../contexts/LanguageContext';

const PrivacyPolicy: React.FC = () => {
  const { t, language } = useLanguage();
  const isNL = language === 'nl';

  return (
    <PageTransition>
    <div className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-white">{t('footer.privacyPolicy')}</h1>
          
          <div className="bg-dark-800 p-8 rounded-lg shadow-lg border border-dark-700">
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-400 mb-6">
                {isNL ? 'Laatst bijgewerkt:' : 'Last updated:'} {new Date().toLocaleDateString(isNL ? 'nl-NL' : 'en-US')}
              </p>

              <h2 className="text-2xl font-semibold mb-4 text-white">1. {isNL ? 'Inleiding' : 'Introduction'}</h2>
              <p className="text-gray-300 mb-6">
                {isNL 
                  ? 'Varexo hecht veel waarde aan de bescherming van jouw persoonsgegevens. In deze privacy policy leggen we uit welke gegevens we verzamelen, waarom we dit doen, en hoe we jouw privacy rechten respecteren.'
                  : 'Varexo values the protection of your personal data. In this privacy policy, we explain what data we collect, why we do so, and how we respect your privacy rights.'}
              </p>

              <h2 className="text-2xl font-semibold mb-4 text-white">2. {isNL ? 'Welke gegevens verzamelen we?' : 'What data do we collect?'}</h2>
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3 text-white">{isNL ? 'Contactformulier' : 'Contact Form'}</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-300">
                  <li>{isNL ? 'Naam' : 'Name'}</li>
                  <li>{isNL ? 'E-mailadres' : 'Email address'}</li>
                  <li>{isNL ? 'Bericht inhoud' : 'Message content'}</li>
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3 text-white">{isNL ? 'Klantportaal' : 'Customer Portal'}</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-300">
                  <li>{isNL ? 'Naam' : 'Name'}</li>
                  <li>{isNL ? 'E-mailadres' : 'Email address'}</li>
                  <li>{isNL ? 'Factuuradres' : 'Billing address'}</li>
                  <li>{isNL ? 'Projectgegevens' : 'Project details'}</li>
                  <li>{isNL ? 'Communicatiegeschiedenis' : 'Communication history'}</li>
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3 text-white">{isNL ? 'Automatisch verzamelde gegevens' : 'Automatically collected data'}</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-300">
                  <li>{isNL ? 'IP-adres' : 'IP address'}</li>
                  <li>{isNL ? 'Browser type en versie' : 'Browser type and version'}</li>
                  <li>{isNL ? 'Tijdstip van bezoek' : 'Time of visit'}</li>
                  <li>{isNL ? 'Bekeken pagina\'s' : 'Pages viewed'}</li>
                </ul>
              </div>

              <h2 className="text-2xl font-semibold mb-4 text-white">3. {isNL ? 'Waarom verzamelen we deze gegevens?' : 'Why do we collect this data?'}</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-300 mb-6">
                <li>{isNL ? 'Voor het verwerken van contactverzoeken en offerteaanvragen' : 'To process contact requests and quote requests'}</li>
                <li>{isNL ? 'Voor het leveren van onze diensten' : 'To deliver our services'}</li>
                <li>{isNL ? 'Voor het beheren van klantrelaties en projecten' : 'To manage customer relationships and projects'}</li>
                <li>{isNL ? 'Voor facturatie en administratie' : 'For billing and administration'}</li>
                <li>{isNL ? 'Voor het verbeteren van onze website en dienstverlening' : 'To improve our website and services'}</li>
                <li>{isNL ? 'Voor wettelijke verplichtingen' : 'For legal obligations'}</li>
              </ul>

              <h2 className="text-2xl font-semibold mb-4 text-white">4. {isNL ? 'Hoe lang bewaren we jouw gegevens?' : 'How long do we keep your data?'}</h2>
              <p className="text-gray-300 mb-6">
                {isNL 
                  ? 'We bewaren jouw persoonsgegevens niet langer dan noodzakelijk voor de doeleinden waarvoor ze zijn verzameld. Specifiek:'
                  : 'We do not keep your personal data longer than necessary for the purposes for which they were collected. Specifically:'}
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-300 mb-6">
                <li>{isNL ? 'Contactformulier gegevens: 2 jaar na laatste contact' : 'Contact form data: 2 years after last contact'}</li>
                <li>{isNL ? 'Klantgegevens: 7 jaar (wettelijke bewaartermijn)' : 'Customer data: 7 years (legal retention period)'}</li>
                <li>{isNL ? 'Bezoekersgegevens: 26 maanden' : 'Visitor data: 26 months'}</li>
              </ul>

              <h2 className="text-2xl font-semibold mb-4 text-white">5. {isNL ? 'Rechten van betrokkene' : 'Rights of the data subject'}</h2>
              <p className="text-gray-300 mb-6">
                {isNL 
                  ? 'Je hebt de volgende rechten met betrekking tot jouw persoonsgegevens:'
                  : 'You have the following rights regarding your personal data:'}
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-300 mb-6">
                <li><strong>{isNL ? 'Inzage:' : 'Access:'}</strong> {isNL ? 'Je kunt vragen welke gegevens we van je hebben' : 'You can ask what data we have about you'}</li>
                <li><strong>{isNL ? 'Rectificatie:' : 'Rectification:'}</strong> {isNL ? 'Je kunt onjuiste gegevens laten corrigeren' : 'You can have incorrect data corrected'}</li>
                <li><strong>{isNL ? 'Verwijdering:' : 'Erasure:'}</strong> {isNL ? 'Je kunt vragen om je gegevens te verwijderen' : 'You can request deletion of your data'}</li>
                <li><strong>{isNL ? 'Beperking:' : 'Restriction:'}</strong> {isNL ? 'Je kunt de verwerking van je gegevens laten beperken' : 'You can have processing of your data restricted'}</li>
                <li><strong>{isNL ? 'Data-overdracht:' : 'Data portability:'}</strong> {isNL ? 'Je kunt je gegevens laten overdragen' : 'You can have your data transferred'}</li>
                <li><strong>{isNL ? 'Bezwaar:' : 'Objection:'}</strong> {isNL ? 'Je kunt bezwaar maken tegen verwerking' : 'You can object to processing'}</li>
              </ul>

              <h2 className="text-2xl font-semibold mb-4 text-white">6. {isNL ? 'Delen van gegevens' : 'Sharing of data'}</h2>
              <p className="text-gray-300 mb-6">
                {isNL 
                  ? 'We delen jouw gegevens alleen met derden als dit noodzakelijk is voor onze dienstverlening of als we wettelijk verplicht zijn. We werken samen met:'
                  : 'We only share your data with third parties if necessary for our services or if legally required. We work with:'}
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-300 mb-6">
                <li>{isNL ? 'Hosting providers (voor website hosting)' : 'Hosting providers (for website hosting)'}</li>
                <li>{isNL ? 'Betalingsverwerkers (voor facturatie)' : 'Payment processors (for billing)'}</li>
                <li>{isNL ? 'E-mail providers (voor communicatie)' : 'Email providers (for communication)'}</li>
              </ul>

              <h2 className="text-2xl font-semibold mb-4 text-white">7. {isNL ? 'Beveiliging' : 'Security'}</h2>
              <p className="text-gray-300 mb-6">
                {isNL 
                  ? 'We nemen passende technische en organisatorische maatregelen om jouw persoonsgegevens te beveiligen tegen verlies, onbevoegde toegang, en onrechtmatige verwerking.'
                  : 'We take appropriate technical and organizational measures to protect your personal data against loss, unauthorized access, and unlawful processing.'}
              </p>

              <h2 className="text-2xl font-semibold mb-4 text-white">8. Cookies</h2>
              <p className="text-gray-300 mb-6">
                {isNL 
                  ? 'Onze website gebruikt cookies voor functionele en analytische doeleinden. Lees onze Cookie Policy voor meer informatie.'
                  : 'Our website uses cookies for functional and analytical purposes. Read our Cookie Policy for more information.'}
              </p>

              <h2 className="text-2xl font-semibold mb-4 text-white">9. {isNL ? 'Contactgegevens' : 'Contact information'}</h2>
              <p className="text-gray-300 mb-6">
                {isNL 
                  ? 'Voor vragen over deze privacy policy of voor het uitoefenen van je rechten, kun je contact met ons opnemen:'
                  : 'For questions about this privacy policy or to exercise your rights, you can contact us:'}
              </p>
              <div className="bg-dark-700 p-4 rounded-lg mb-6 border border-dark-600">
                <p className="text-gray-300">
                  <strong>Varexo</strong><br />
                  E-mail: info@varexo.nl<br />
                  Website: www.varexo.nl
                </p>
              </div>

              <h2 className="text-2xl font-semibold mb-4 text-white">10. {isNL ? 'Wijzigingen' : 'Changes'}</h2>
              <p className="text-gray-300 mb-6">
                {isNL 
                  ? 'We behouden ons het recht voor om deze privacy policy te wijzigen. De meest recente versie is altijd beschikbaar op onze website.'
                  : 'We reserve the right to change this privacy policy. The most recent version is always available on our website.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </PageTransition>
  );
};

export default PrivacyPolicy;
