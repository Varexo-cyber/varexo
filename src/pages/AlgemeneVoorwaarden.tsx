import React from 'react';
import PageTransition from '../components/PageTransition';
import { useLanguage } from '../contexts/LanguageContext';

const AlgemeneVoorwaarden: React.FC = () => {
  const { t, language } = useLanguage();
  const isNL = language === 'nl';
  return (
    <PageTransition>
    <div className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-white">{t('footer.terms')}</h1>
          
          <div className="bg-dark-800 p-8 rounded-lg shadow-lg border border-dark-700">
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-400 mb-6">
                {isNL ? 'Laatst bijgewerkt:' : 'Last updated:'} {new Date().toLocaleDateString(isNL ? 'nl-NL' : 'en-US')}
              </p>

              <h2 className="text-2xl font-semibold mb-4 text-white">{isNL ? 'Artikel 1 - Definities' : 'Article 1 - Definitions'}</h2>
              <div className="mb-6">
                <p className="text-gray-300 mb-4">{isNL ? 'In deze algemene voorwaarden wordt verstaan onder:' : 'In these general terms and conditions, the following is understood:'}</p>
                <ul className="list-disc pl-6 space-y-2 text-gray-300">
                  <li><strong>Varexo:</strong> {isNL ? 'De ICT- en webdevelopment onderneming, gevestigd te \'s-Gravenzande, ingeschreven bij de Kamer van Koophandel onder nummer 42042045' : 'The ICT and web development company, established in \'s-Gravenzande, registered at the Chamber of Commerce under number 42042045'}</li>
                  <li><strong>{isNL ? 'Klant' : 'Customer'}:</strong> {isNL ? 'De natuurlijke persoon of rechtspersoon die gebruikmaakt van de diensten van Varexo' : 'The natural person or legal entity using the services of Varexo'}</li>
                  <li><strong>{isNL ? 'Diensten' : 'Services'}:</strong> {isNL ? 'Alle door Varexo aangeboden diensten, waaronder webdesign, webdevelopment, social media beheer en onderhoud' : 'All services offered by Varexo, including web design, web development, social media management and maintenance'}</li>
                  <li><strong>{isNL ? 'Overeenkomst' : 'Agreement'}:</strong> {isNL ? 'De overeenkomst tussen Varexo en de Klant' : 'The agreement between Varexo and the Customer'}</li>
                  <li><strong>{isNL ? 'Website' : 'Website'}:</strong> {isNL ? 'De door Varexo ontwikkelde website of webapplicatie' : 'The website or web application developed by Varexo'}</li>
                </ul>
              </div>

              <h2 className="text-2xl font-semibold mb-4 text-white">{isNL ? 'Artikel 2 - Toepasselijkheid' : 'Article 2 - Applicability'}</h2>
              <p className="text-gray-300 mb-6">
                {isNL 
                  ? 'Deze algemene voorwaarden zijn van toepassing op alle offertes, overeenkomsten en diensten van Varexo. Afwijkingen van deze voorwaarden zijn alleen geldig indien schriftelijk overeengekomen.'
                  : 'These general terms and conditions apply to all quotes, agreements and services of Varexo. Deviations from these conditions are only valid if agreed upon in writing.'}
              </p>

              <h2 className="text-2xl font-semibold mb-4 text-white">{isNL ? 'Artikel 3 - Diensten' : 'Article 3 - Services'}</h2>
              <p className="text-gray-300 mb-6">
                {isNL ? 'Varexo levert de volgende diensten:' : 'Varexo provides the following services:'}
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-300 mb-6">
                <li>{isNL ? 'Webdesign en webdevelopment' : 'Web design and web development'}</li>
                <li>{isNL ? 'Social media beheer' : 'Social media management'}</li>
                <li>{isNL ? 'Website onderhoud en hosting' : 'Website maintenance and hosting'}</li>
                <li>{isNL ? 'Maatwerk software oplossingen' : 'Custom software solutions'}</li>
                <li>{isNL ? 'Advies en consultancy' : 'Advice and consultancy'}</li>
              </ul>

              <h2 className="text-2xl font-semibold mb-4 text-white">{isNL ? 'Artikel 4 - Offertes' : 'Article 4 - Quotes'}</h2>
              <p className="text-gray-300 mb-6">
                {isNL 
                  ? 'Alle offertes zijn vrijblijvend en geldig voor 14 dagen, tenzij anders aangegeven. Varexo behoudt zich het recht voor om offertes in te trekken.'
                  : 'All quotes are non-binding and valid for 14 days, unless otherwise stated. Varexo reserves the right to withdraw quotes.'}
              </p>

              <h2 className="text-2xl font-semibold mb-4 text-white">{isNL ? 'Artikel 5 - Prijzen en Betaling' : 'Article 5 - Prices and Payment'}</h2>
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3 text-white">5.1 {isNL ? 'Prijzen' : 'Prices'}</h3>
                <p className="text-gray-300 mb-4">
                  {isNL 
                    ? 'Alle prijzen zijn exclusief BTW, tenzij anders vermeld. Prijzen zijn gebaseerd op de geldende tarieven op het moment van de offerte.'
                    : 'All prices are excluding VAT, unless otherwise stated. Prices are based on the applicable rates at the time of the quote.'}
                </p>
                
                <h3 className="text-xl font-semibold mb-3 text-white">5.2 {isNL ? 'Betalingstermijnen' : 'Payment Terms'}</h3>
                <p className="text-gray-300 mb-4">
                  {isNL ? 'Betaling geschiedt volgens de volgende afspraken:' : 'Payment is made according to the following agreements:'}
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-300 mb-4">
                  <li>{isNL ? '50% bij aanvang van het project' : '50% at the start of the project'}</li>
                  <li>{isNL ? '50% na oplevering en binnen 24 uur na factuurdatum' : '50% after delivery and within 24 hours of the invoice date'}</li>
                </ul>
                
                <h3 className="text-xl font-semibold mb-3 text-white">5.3 {isNL ? 'Late betaling' : 'Late Payment'}</h3>
                <p className="text-gray-300 mb-4">
                  {isNL 
                    ? 'Bij niet-tijdige betaling is de Klant van rechtswege in verzuim en is Varexo gerechtigd wettelijke rente in rekening te brengen.'
                    : 'In case of late payment, the Customer is automatically in default and Varexo is entitled to charge statutory interest.'}
                </p>
              </div>

              <h2 className="text-2xl font-semibold mb-4 text-white">{isNL ? 'Artikel 6 - Leveringstermijn' : 'Article 6 - Delivery Time'}</h2>
              <p className="text-gray-300 mb-6">
                {isNL 
                  ? 'Opgegeven levertijden zijn indicatief en niet bindend. Overschrijding van een termijn geeft de Klant geen recht op schadevergoeding of ontbinding.'
                  : 'Stated delivery times are indicative and not binding. Exceeding a deadline does not give the Customer the right to compensation or termination.'}
              </p>

              <h2 className="text-2xl font-semibold mb-4 text-white">{isNL ? 'Artikel 7 - Aansprakelijkheid' : 'Article 7 - Liability'}</h2>
              <p className="text-gray-300 mb-6">
                {isNL 
                  ? 'De aansprakelijkheid van Varexo is beperkt tot het bedrag van de uitgevoerde opdracht. Varexo is niet aansprakelijk voor indirecte schade, gevolgschade of bedrijfsschade.'
                  : 'The liability of Varexo is limited to the amount of the executed assignment. Varexo is not liable for indirect damage, consequential damage or business damage.'}
              </p>

              <h2 className="text-2xl font-semibold mb-4 text-white">{isNL ? 'Artikel 8 - Wijzigingen en Meerwerk' : 'Article 8 - Changes and Additional Work'}</h2>
              <p className="text-gray-300 mb-6">
                {isNL 
                  ? 'Wijzigingen in de opdracht door de Klant die leiden tot extra werkzaamheden worden als meerwerk in rekening gebracht tegen de geldende tarieven.'
                  : 'Changes in the assignment by the Customer that lead to additional work will be charged as additional work at the applicable rates.'}
              </p>

              <h2 className="text-2xl font-semibold mb-4 text-white">{isNL ? 'Artikel 9 - Beëindiging' : 'Article 9 - Termination'}</h2>
              <p className="text-gray-300 mb-6">
                {isNL 
                  ? 'Zowel Varexo als de Klant kunnen de overeenkomst beëindigen bij wanprestatie. Opzegging dient schriftelijk te gebeuren met inachtneming van een opzegtermijn van 30 dagen.'
                  : 'Both Varexo and the Customer can terminate the agreement in case of default. Termination must be done in writing with a notice period of 30 days.'}
              </p>

              <h2 className="text-2xl font-semibold mb-4 text-white">{isNL ? 'Artikel 10 - Intellectueel Eigendom' : 'Article 10 - Intellectual Property'}</h2>
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3 text-white">10.1 {isNL ? 'Tijdens project' : 'During project'}</h3>
                <p className="text-gray-300 mb-4">
                  {isNL 
                    ? 'Gedurende de uitvoering van het project blijven alle ontwerpen, code en overige materiaal eigendom van Varexo.'
                    : 'During the execution of the project, all designs, code and other material remain the property of Varexo.'}
                </p>
                
                <h3 className="text-xl font-semibold mb-3 text-white">10.2 {isNL ? 'Na volledige betaling' : 'After full payment'}</h3>
                <p className="text-gray-300 mb-4">
                  {isNL 
                    ? 'Na volledige betaling van het factuurbedrag gaat het intellectueel eigendom over op de Klant, met uitzondering van herbruikbare componenten en frameworks.'
                    : 'After full payment of the invoice amount, the intellectual property transfers to the Customer, with the exception of reusable components and frameworks.'}
                </p>
              </div>

              <h2 className="text-2xl font-semibold mb-4 text-white">{isNL ? 'Artikel 11 - Geheimhouding' : 'Article 11 - Confidentiality'}</h2>
              <p className="text-gray-300 mb-6">
                {isNL 
                  ? 'Beide partijen zijn verplicht tot geheimhouding van alle vertrouwelijke informatie die zij in het kader van de overeenkomst verkrijgen.'
                  : 'Both parties are obliged to maintain confidentiality of all confidential information they obtain in the context of the agreement.'}
              </p>

              <h2 className="text-2xl font-semibold mb-4 text-white">{isNL ? 'Artikel 12 - Klachten' : 'Article 12 - Complaints'}</h2>
              <p className="text-gray-300 mb-6">
                {isNL 
                  ? 'Klachten over de uitvoering van de overeenkomst moeten binnen 14 dagen na ontdekking schriftelijk worden gemeld. Varexo zal de klacht binnen redelijke termijn behandelen.'
                  : 'Complaints about the execution of the agreement must be reported in writing within 14 days of discovery. Varexo will handle the complaint within a reasonable time.'}
              </p>

              <h2 className="text-2xl font-semibold mb-4 text-white">{isNL ? 'Artikel 13 - Toepasselijk recht' : 'Article 13 - Applicable Law'}</h2>
              <p className="text-gray-300 mb-6">
                {isNL 
                  ? 'Op deze algemene voorwaarden en alle overeenkomsten van Varexo is het Nederlands recht van toepassing. Geschillen worden voorgelegd aan de bevoegde rechter in Nederland.'
                  : 'Dutch law applies to these general terms and conditions and all agreements of Varexo. Disputes will be submitted to the competent court in the Netherlands.'}
              </p>

              <h2 className="text-2xl font-semibold mb-4 text-white">{isNL ? 'Artikel 14 - Contactgegevens' : 'Article 14 - Contact Information'}</h2>
              <div className="bg-dark-700 p-4 rounded-lg mb-6 border border-dark-600">
                <p className="text-gray-300">
                  <strong>Varexo</strong><br />
                  E-mail: info@varexo.nl<br />
                  Website: www.varexo.nl<br />
                  KvK: {isNL ? '[later invullen]' : '[to be filled in]'}<br />
                  BTW: {isNL ? '[later invullen]' : '[to be filled in]'}
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
