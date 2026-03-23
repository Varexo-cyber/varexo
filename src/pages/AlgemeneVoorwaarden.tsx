import React from 'react';
import PageTransition from '../components/PageTransition';

const AlgemeneVoorwaarden: React.FC = () => {
  return (
    <PageTransition>
    <div className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-white">Algemene Voorwaarden</h1>
          
          <div className="bg-dark-800 p-8 rounded-lg shadow-lg border border-dark-700">
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-400 mb-6">
                Laatst bijgewerkt: {new Date().toLocaleDateString('nl-NL')}
              </p>

              <h2 className="text-2xl font-semibold mb-4 text-white">Artikel 1 - Definities</h2>
              <div className="mb-6">
                <p className="text-gray-300 mb-4">In deze algemene voorwaarden wordt verstaan onder:</p>
                <ul className="list-disc pl-6 space-y-2 text-gray-300">
                  <li><strong>Varexo:</strong> De ICT- en webdevelopment onderneming, gevestigd in Nederland</li>
                  <li><strong>Klant:</strong> De natuurlijke persoon of rechtspersoon die gebruikmaakt van de diensten van Varexo</li>
                  <li><strong>Diensten:</strong> Alle door Varexo aangeboden diensten, waaronder webdesign, webdevelopment, social media beheer en onderhoud</li>
                  <li><strong>Overeenkomst:</strong> De overeenkomst tussen Varexo en de Klant</li>
                  <li><strong>Website:</strong> De door Varexo ontwikkelde website of webapplicatie</li>
                </ul>
              </div>

              <h2 className="text-2xl font-semibold mb-4 text-white">Artikel 2 - Toepasselijkheid</h2>
              <p className="text-gray-300 mb-6">
                Deze algemene voorwaarden zijn van toepassing op alle offertes, overeenkomsten en diensten 
                van Varexo. Afwijkingen van deze voorwaarden zijn alleen geldig indien schriftelijk overeengekomen.
              </p>

              <h2 className="text-2xl font-semibold mb-4 text-white">Artikel 3 - Diensten</h2>
              <p className="text-gray-300 mb-6">
                Varexo levert de volgende diensten:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-300 mb-6">
                <li>Webdesign en webdevelopment</li>
                <li>Social media beheer</li>
                <li>Website onderhoud en hosting</li>
                <li>Maatwerk software oplossingen</li>
                <li>Advies en consultancy</li>
              </ul>

              <h2 className="text-2xl font-semibold mb-4 text-white">Artikel 4 - Offertes</h2>
              <p className="text-gray-300 mb-6">
                Alle offertes zijn vrijblijvend en geldig voor 14 dagen, tenzij anders aangegeven. 
                Varexo behoudt zich het recht voor om offertes in te trekken.
              </p>

              <h2 className="text-2xl font-semibold mb-4 text-white">Artikel 5 - Prijzen en Betaling</h2>
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3 text-white">5.1 Prijzen</h3>
                <p className="text-gray-300 mb-4">
                  Alle prijzen zijn exclusief BTW, tenzij anders vermeld. Prijzen zijn gebaseerd op de 
                  geldende tarieven op het moment van de offerte.
                </p>
                
                <h3 className="text-xl font-semibold mb-3 text-white">5.2 Betalingstermijnen</h3>
                <p className="text-gray-300 mb-4">
                  Betaling geschiedt volgens de volgende afspraken:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-300 mb-4">
                  <li>50% bij aanvang van het project</li>
                  <li>50% na oplevering en binnen 24 uur na factuurdatum</li>
                </ul>
                
                <h3 className="text-xl font-semibold mb-3 text-white">5.3 Late betaling</h3>
                <p className="text-gray-300 mb-4">
                  Bij niet-tijdige betaling is de Klant van rechtswege in verzuim en is Varexo 
                  gerechtigd wettelijke rente in rekening te brengen.
                </p>
              </div>

              <h2 className="text-2xl font-semibold mb-4 text-white">Artikel 6 - Leveringstermijn</h2>
              <p className="text-gray-300 mb-6">
                Opgegeven levertijden zijn indicatief en niet bindend. Overschrijding van een termijn 
                geeft de Klant geen recht op schadevergoeding of ontbinding.
              </p>

              <h2 className="text-2xl font-semibold mb-4 text-white">Artikel 7 - Aansprakelijkheid</h2>
              <p className="text-gray-300 mb-6">
                De aansprakelijkheid van Varexo is beperkt tot het bedrag van de uitgevoerde opdracht. 
                Varexo is niet aansprakelijk voor indirecte schade, gevolgschade of bedrijfsschade.
              </p>

              <h2 className="text-2xl font-semibold mb-4 text-white">Artikel 8 - Wijzigingen en Meerwerk</h2>
              <p className="text-gray-300 mb-6">
                Wijzigingen in de opdracht door de Klant die leiden tot extra werkzaamheden worden 
                als meerwerk in rekening gebracht tegen de geldende tarieven.
              </p>

              <h2 className="text-2xl font-semibold mb-4 text-white">Artikel 9 - Beëindiging</h2>
              <p className="text-gray-300 mb-6">
                Zowel Varexo als de Klant kunnen de overeenkomst beëindigen bij wanprestatie. 
                Opzegging dient schriftelijk te gebeuren met inachtneming van een opzegtermijn van 30 dagen.
              </p>

              <h2 className="text-2xl font-semibold mb-4 text-white">Artikel 10 - Intellectueel Eigendom</h2>
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3 text-white">10.1 Tijdens project</h3>
                <p className="text-gray-300 mb-4">
                  Gedurende de uitvoering van het project blijven alle ontwerpen, code en overige 
                  materiaal eigendom van Varexo.
                </p>
                
                <h3 className="text-xl font-semibold mb-3 text-white">10.2 Na volledige betaling</h3>
                <p className="text-gray-300 mb-4">
                  Na volledige betaling van het factuurbedrag gaat het intellectueel eigendom over 
                  op de Klant, met uitzondering van herbruikbare componenten en frameworks.
                </p>
              </div>

              <h2 className="text-2xl font-semibold mb-4 text-white">Artikel 11 - Geheimhouding</h2>
              <p className="text-gray-300 mb-6">
                Beide partijen zijn verplicht tot geheimhouding van alle vertrouwelijke informatie 
                die zij in het kader van de overeenkomst verkrijgen.
              </p>

              <h2 className="text-2xl font-semibold mb-4 text-white">Artikel 12 - Klachten</h2>
              <p className="text-gray-300 mb-6">
                Klachten over de uitvoering van de overeenkomst moeten binnen 14 dagen na ontdekking 
                schriftelijk worden gemeld. Varexo zal de klacht binnen redelijke termijn behandelen.
              </p>

              <h2 className="text-2xl font-semibold mb-4 text-white">Artikel 13 - Toepasselijk recht</h2>
              <p className="text-gray-300 mb-6">
                Op deze algemene voorwaarden en alle overeenkomsten van Varexo is het Nederlands recht 
                van toepassing. Geschillen worden voorgelegd aan de bevoegde rechter in Nederland.
              </p>

              <h2 className="text-2xl font-semibold mb-4 text-white">Artikel 14 - Contactgegevens</h2>
              <div className="bg-dark-700 p-4 rounded-lg mb-6 border border-dark-600">
                <p className="text-gray-300">
                  <strong>Varexo</strong><br />
                  E-mail: info@varexo.nl<br />
                  Website: www.varexo.nl<br />
                  KvK: [later invullen]<br />
                  BTW: [later invullen]
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

export default AlgemeneVoorwaarden;
