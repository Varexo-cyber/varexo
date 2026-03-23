import React from 'react';
import PageTransition from '../components/PageTransition';

const PrivacyPolicy: React.FC = () => {
  return (
    <PageTransition>
    <div className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-white">Privacy Policy</h1>
          
          <div className="bg-dark-800 p-8 rounded-lg shadow-lg border border-dark-700">
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-400 mb-6">
                Laatst bijgewerkt: {new Date().toLocaleDateString('nl-NL')}
              </p>

              <h2 className="text-2xl font-semibold mb-4 text-white">1. Inleiding</h2>
              <p className="text-gray-300 mb-6">
                Varexo hecht veel waarde aan de bescherming van jouw persoonsgegevens. 
                In deze privacy policy leggen we uit welke gegevens we verzamelen, waarom we dit doen, 
                en hoe we jouw privacy rechten respecteren.
              </p>

              <h2 className="text-2xl font-semibold mb-4 text-white">2. Welke gegevens verzamelen we?</h2>
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3 text-white">Contactformulier</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-300">
                  <li>Naam</li>
                  <li>E-mailadres</li>
                  <li>Bericht inhoud</li>
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3 text-white">Klantportaal</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-300">
                  <li>Naam</li>
                  <li>E-mailadres</li>
                  <li>Factuuradres</li>
                  <li>Projectgegevens</li>
                  <li>Communicatiegeschiedenis</li>
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3 text-white">Automatisch verzamelde gegevens</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-300">
                  <li>IP-adres</li>
                  <li>Browser type en versie</li>
                  <li>Tijdstip van bezoek</li>
                  <li>Bekeken pagina's</li>
                </ul>
              </div>

              <h2 className="text-2xl font-semibold mb-4 text-white">3. Waarom verzamelen we deze gegevens?</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-300 mb-6">
                <li>Voor het verwerken van contactverzoeken en offerteaanvragen</li>
                <li>Voor het leveren van onze diensten</li>
                <li>Voor het beheren van klantrelaties en projecten</li>
                <li>Voor facturatie en administratie</li>
                <li>Voor het verbeteren van onze website en dienstverlening</li>
                <li>Voor wettelijke verplichtingen</li>
              </ul>

              <h2 className="text-2xl font-semibold mb-4 text-white">4. Hoe lang bewaren we jouw gegevens?</h2>
              <p className="text-gray-300 mb-6">
                We bewaren jouw persoonsgegevens niet langer dan noodzakelijk voor de doeleinden 
                waarvoor ze zijn verzameld. Specifiek:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-300 mb-6">
                <li>Contactformulier gegevens: 2 jaar na laatste contact</li>
                <li>Klantgegevens: 7 jaar (wettelijke bewaartermijn)</li>
                <li>Bezoekersgegevens: 26 maanden</li>
              </ul>

              <h2 className="text-2xl font-semibold mb-4 text-white">5. Rechten van betrokkene</h2>
              <p className="text-gray-300 mb-6">
                Je hebt de volgende rechten met betrekking tot jouw persoonsgegevens:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-300 mb-6">
                <li><strong>Inzage:</strong> Je kunt vragen welke gegevens we van je hebben</li>
                <li><strong>Rectificatie:</strong> Je kunt onjuiste gegevens laten corrigeren</li>
                <li><strong>Verwijdering:</strong> Je kunt vragen om je gegevens te verwijderen</li>
                <li><strong>Beperking:</strong> Je kunt de verwerking van je gegevens laten beperken</li>
                <li><strong>Data-overdracht:</strong> Je kunt je gegevens laten overdragen</li>
                <li><strong>Bezwaar:</strong> Je kunt bezwaar maken tegen verwerking</li>
              </ul>

              <h2 className="text-2xl font-semibold mb-4 text-white">6. Delen van gegevens</h2>
              <p className="text-gray-300 mb-6">
                We delen jouw gegevens alleen met derden als dit noodzakelijk is voor onze dienstverlening 
                of als we wettelijk verplicht zijn. We werken samen met:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-300 mb-6">
                <li>Hosting providers (voor website hosting)</li>
                <li>Betalingsverwerkers (voor facturatie)</li>
                <li>E-mail providers (voor communicatie)</li>
              </ul>

              <h2 className="text-2xl font-semibold mb-4 text-white">7. Beveiliging</h2>
              <p className="text-gray-300 mb-6">
                We nemen passende technische en organisatorische maatregelen om jouw persoonsgegevens 
                te beveiligen tegen verlies, onbevoegde toegang, en onrechtmatige verwerking.
              </p>

              <h2 className="text-2xl font-semibold mb-4 text-white">8. Cookies</h2>
              <p className="text-gray-300 mb-6">
                Onze website gebruikt cookies voor functionele en analytische doeleinden. 
                Lees onze Cookie Policy voor meer informatie.
              </p>

              <h2 className="text-2xl font-semibold mb-4 text-white">9. Contactgegevens</h2>
              <p className="text-gray-300 mb-6">
                Voor vragen over deze privacy policy of voor het uitoefenen van je rechten, 
                kun je contact met ons opnemen:
              </p>
              <div className="bg-dark-700 p-4 rounded-lg mb-6 border border-dark-600">
                <p className="text-gray-300">
                  <strong>Varexo</strong><br />
                  E-mail: info@varexo.nl<br />
                  Website: www.varexo.nl
                </p>
              </div>

              <h2 className="text-2xl font-semibold mb-4 text-white">10. Wijzigingen</h2>
              <p className="text-gray-300 mb-6">
                We behouden ons het recht voor om deze privacy policy te wijzigen. 
                De meest recente versie is altijd beschikbaar op onze website.
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
