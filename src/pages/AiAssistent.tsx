import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import AnimateOnScroll from '../components/AnimateOnScroll';
import SEO from '../components/SEO';
import SpeakerVisual from '../components/SpeakerVisual';
import RexoBanner, { RexoMark } from '../components/RexoBanner';
import { SpotlightCard, Magnetic } from '../components/Interactive';
import { ArrowIcon, CheckIcon } from '../components/Section';
import { useLanguage } from '../contexts/LanguageContext';

const WA_NUMBER = '31636075966';
const wa = (text: string) => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;

const WaIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
);

// Chat bubbles that type out one after another around the speaker
const ConversationLoop: React.FC<{ lines: [string, string][] }> = ({ lines }) => {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % lines.length), 3600);
    return () => clearInterval(id);
  }, [lines.length]);
  const [q, a] = lines[i];
  return (
    <div key={i} className="convo">
      <div className="convo-q">{q}</div>
      <div className="convo-a"><span className="w-1.5 h-1.5 rounded-full bg-primary-400" />{a}</div>
    </div>
  );
};

const AiAssistent: React.FC = () => {
  const { language } = useLanguage();
  const nl = language === 'nl';

  const packages = [
    {
      name: nl ? 'Basis' : 'Basic',
      who: nl ? '1 kamer · 1 speaker' : '1 room · 1 speaker',
      once: '300', monthly: '19,99',
      features: nl
        ? ['Persoonlijke AI-assistent ingesteld', 'Installatie bij jou op locatie', 'Uitleg zodat je direct kunt praten', 'Updates en onderhoud inbegrepen', 'Hulp via WhatsApp']
        : ['Personal AI assistant set up', 'Installed at your location', 'Walkthrough so you can start talking right away', 'Updates and maintenance included', 'Support via WhatsApp'],
    },
    {
      name: nl ? 'Thuis' : 'Home',
      who: nl ? 'Woonkamer & leefruimte' : 'Living room & living space',
      once: '699', monthly: '34,99', featured: true,
      features: nl
        ? ['Alles uit Basis', 'Afgestemd op jouw huishouden', 'Meerdere speakers mogelijk', 'Koppelingen met je eigen apps en apparaten', 'Voorrang bij vragen en aanpassingen']
        : ['Everything in Basic', 'Tuned to your household', 'Multiple speakers possible', 'Connections to your own apps and devices', 'Priority for questions and changes'],
    },
    {
      name: nl ? 'Zakelijk' : 'Business',
      who: nl ? 'Kantoor, praktijk of winkel' : 'Office, practice or shop',
      once: '1.399,99', monthly: '89,99',
      features: nl
        ? ['Alles uit Thuis', 'Ingericht met jouw bedrijfsinformatie', 'Meerdere ruimtes en speakers', 'Afspraken over privacy op de werkvloer', 'Zakelijke support met vaste contactpersoon']
        : ['Everything in Home', 'Set up with your business information', 'Multiple rooms and speakers', 'Clear privacy agreements for the workplace', 'Business support with a fixed contact'],
    },
  ];

  const uses = nl
    ? [
        ['Gewoon vragen stellen', 'Van "wat staat er vandaag op de planning?" tot "hoe lang moet een ei koken?". Praat zoals je met een mens praat.'],
        ['Herinneringen & notities', 'Zeg het hardop en het staat genoteerd. Geen app openen, geen typen.'],
        ['Je huis aansturen', 'Lampen, muziek en andere slimme apparaten, als ze gekoppeld kunnen worden.'],
        ['Vergaderen zonder gedoe', 'De Jabra Speak is gemaakt voor heldere spraak in een ruimte. Ideaal aan tafel of op kantoor.'],
        ['Afgestemd op jou', 'Wij stellen hem in op jouw situatie, jouw taal en jouw manier van werken.'],
        ['Altijd up-to-date', 'Wij houden alles bij. Jij merkt alleen dat het werkt.'],
      ]
    : [
        ['Just ask questions', 'From "what is on today?" to "how long should an egg boil?". Talk like you talk to a person.'],
        ['Reminders & notes', 'Say it out loud and it is noted. No app, no typing.'],
        ['Control your home', 'Lights, music and other smart devices, where they can be connected.'],
        ['Hassle-free meetings', 'The Jabra Speak is built for clear speech in a room. Ideal at the table or in the office.'],
        ['Tuned to you', 'We set it up for your situation, your language and the way you work.'],
        ['Always up to date', 'We keep everything running. You only notice that it works.'],
      ];

  const steps = nl
    ? [['Kennismaken', 'We bespreken wat je wilt en welke ruimte(s).'], ['Wij regelen de hardware', 'We kopen de Jabra Speak(s) en stellen alles vooraf in.'], ['Installatie aan huis', 'We komen langs, installeren en testen het op jouw adres.'], ['Praten maar', 'Je kunt direct beginnen. Wij blijven het onderhouden.']]
    : [['Intro', 'We discuss what you want and which room(s).'], ['We handle the hardware', 'We buy the Jabra Speak(s) and set everything up in advance.'], ['Installed at your place', 'We visit, install and test it at your address.'], ['Start talking', 'You can start right away. We keep maintaining it.']];

  const faqs = nl
    ? [
        ['Zit de speaker bij de prijs in?', 'Nee. De pakketprijzen zijn exclusief de Jabra Speak. Die kost €100 per stuk (excl. btw). Wij kopen hem voor je in en stellen hem in.'],
        ['Moet ik zelf iets installeren?', 'Nee. We komen bij je langs en installeren alles op je adres. Je hoeft alleen te zeggen waar hij moet staan.'],
        ['Wat zit er in het maandbedrag?', 'De AI-dienst, updates, onderhoud en hulp als er iets is. Zo blijft alles werken zonder dat jij ernaar om hoeft te kijken.'],
        ['Hoe zit het met mijn privacy?', 'Voor de installatie leggen we je duidelijk uit wat er met je gesprekken gebeurt en maken we daar afspraken over. Op kantoor stemmen we dat ook af met je team.'],
        ['Kan ik een andere prijs of een pakket op maat krijgen?', 'Zeker. Stuur ons een WhatsApp-bericht, dan maken we een offerte die past bij jouw situatie.'],
        ['Kan ik later uitbreiden?', 'Ja. Extra kamers of speakers voegen we gewoon toe.'],
      ]
    : [
        ['Is the speaker included in the price?', 'No. Package prices exclude the Jabra Speak, which costs €100 each (excl. VAT). We buy it for you and set it up.'],
        ['Do I have to install anything myself?', 'No. We visit and install everything at your address. You just tell us where it should go.'],
        ['What does the monthly fee cover?', 'The AI service, updates, maintenance and help when needed, so everything keeps working without you having to think about it.'],
        ['What about my privacy?', 'Before installing, we clearly explain what happens to your conversations and agree on it together. For offices we also align with your team.'],
        ['Can I get a different price or a custom package?', 'Absolutely. Send us a WhatsApp message and we will make a quote that fits your situation.'],
        ['Can I expand later?', 'Yes. We simply add extra rooms or speakers.'],
      ];

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Rexo AI – AI-assistent met Jabra Speak, installatie aan huis',
      serviceType: 'AI spraakassistent installatie',
      provider: { '@type': 'Organization', name: 'Varexo', url: 'https://varexo.nl' },
      areaServed: 'NL',
      url: 'https://varexo.nl/ai-assistent',
      offers: packages.map((p) => ({
        '@type': 'Offer',
        name: p.name,
        price: p.once.replace('.', '').replace(',', '.'),
        priceCurrency: 'EUR',
        description: `${p.who}. Eenmalig €${p.once} + €${p.monthly} per maand, excl. btw en excl. speaker.`,
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
    },
  ];

  return (
    <PageTransition>
      <SEO
        title={nl ? 'Rexo AI – AI-assistent voor thuis & kantoor, geïnstalleerd aan huis' : 'Rexo AI – AI assistant for home & office, installed at your place'}
        description={nl
          ? 'Rexo AI: een eigen AI-assistent in je kamer, huis of kantoor. Wij kopen de Jabra Speak, stellen alles in en installeren het bij jou op locatie. Vanaf €300 + €19,99 p/m.'
          : 'Your own AI assistant in your room, home or office. We buy the Jabra Speak, set everything up and install it at your place. From €300 + €19.99 p/m.'}
        keywords="Rexo AI, Rexo, AI assistent thuis, AI assistent kantoor, Jabra Speak, slimme speaker installatie, spraakassistent laten installeren, AI in huis, AI voor bedrijven, Varexo AI"
        canonical="/ai-assistent"
        jsonLd={jsonLd}
      />

      {/* ───────── Hero ───────── */}
      <section className="relative overflow-hidden bg-dark-950 -mt-[72px] pt-[72px]">
        <div className="aurora" />
        <div className="hero-grid absolute inset-0 pointer-events-none" />
        <div className="container mx-auto px-4 max-w-7xl relative z-10 pt-16 pb-20 lg:pt-24 lg:pb-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6">
              <AnimateOnScroll>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/30 text-primary-200 text-sm mb-8">
                  <span className="px-2 py-0.5 rounded-full bg-primary-500 text-dark-950 text-xs font-bold">{nl ? 'Nieuw' : 'New'}</span>
                  {nl ? 'Maak kennis met' : 'Meet'} <RexoMark className="text-base" />
                </span>
              </AnimateOnScroll>
              <AnimateOnScroll delay={0.06}>
                <h1 className="display text-[3rem] sm:text-7xl xl:text-[5.6rem]">
                  {nl ? <>Praat met je <span className="serif text-primary-300">kamer.</span><br />Hij praat terug.</> : <>Talk to your <span className="serif text-primary-300">room.</span><br />It talks back.</>}
                </h1>
              </AnimateOnScroll>
              <AnimateOnScroll delay={0.12}>
                <p className="lead sm:text-xl max-w-xl mt-8 mb-10">
                  {nl
                    ? 'Rexo AI is je eigen AI-assistent in je woonkamer, huis of kantoor. Wij kopen de Jabra Speak, stellen alles in en installeren het bij jou thuis. Jij hoeft alleen nog te praten.'
                    : 'Rexo AI is your own AI assistant in your living room, home or office. We buy the Jabra Speak, set everything up and install it at your place. All you do is talk.'}
                </p>
              </AnimateOnScroll>
              <AnimateOnScroll delay={0.18}>
                <div className="flex flex-wrap items-center gap-3">
                  <Magnetic>
                    <a href="#pakketten" className="btn-primary-modern group">
                      {nl ? 'Bekijk de pakketten' : 'See the packages'}
                      <ArrowIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </a>
                  </Magnetic>
                  <a href={wa(nl ? 'Hoi Varexo! Ik heb interesse in Rexo AI.' : 'Hi Varexo! I am interested in Rexo AI.')} target="_blank" rel="noopener noreferrer" className="btn-ghost-modern gap-2">
                    <WaIcon className="w-4 h-4" /> WhatsApp
                  </a>
                </div>
                <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-400">
                  {(nl ? ['Installatie aan huis', 'Vanaf €300 eenmalig', 'Geen technische kennis nodig'] : ['Installed at your home', 'From €300 one-off', 'No tech skills needed']).map((x) => (
                    <span key={x} className="flex items-center gap-2"><span className="check-dot !w-[18px] !h-[18px]"><CheckIcon className="w-2.5 h-2.5" /></span>{x}</span>
                  ))}
                </div>
              </AnimateOnScroll>
            </div>

            <div className="lg:col-span-6">
              <div className="relative max-w-[560px] mx-auto">
                <SpeakerVisual className="w-full aspect-square" hotspots />
                <div className="flex justify-center -mt-6 min-h-[96px]">
                  <ConversationLoop lines={nl
                    ? [['"Wat staat er vandaag op de planning?"', 'Om 10:00 een afspraak met Daan en om 14:00 bellen met de leverancier.'], ['"Zet de lampen in de woonkamer op 30%."', 'Gedaan. Fijne avond!'], ['"Onthoud dat ik melk moet halen."', 'Staat genoteerd voor vanavond.']]
                    : [['"What is on my schedule today?"', 'A meeting with Daan at 10:00 and a supplier call at 14:00.'], ['"Dim the living room lights to 30%."', 'Done. Enjoy your evening!'], ['"Remember I need to buy milk."', 'Noted for tonight.']]} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <RexoBanner />

      {/* ───────── What it does ───────── */}
      <section className="py-28 bg-dark-950">
        <div className="container mx-auto px-4 max-w-7xl">
          <AnimateOnScroll>
            <span className="eyebrow">{nl ? 'Wat kan Rexo?' : 'What can Rexo do?'}</span>
            <h2 className="display text-4xl md:text-6xl mt-4 mb-14 max-w-3xl">{nl ? <>Een assistent die <span className="serif text-primary-300">altijd</span> luistert als je hem nodig hebt.</> : <>An assistant that is <span className="serif text-primary-300">always</span> there when you need it.</>}</h2>
          </AnimateOnScroll>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {uses.map(([t, d], i) => (
              <AnimateOnScroll key={t} delay={(i % 3) * 0.06}>
                <SpotlightCard className="surface h-full p-8">
                  <div className="text-sm text-primary-400 mb-6 tabular-nums">0{i + 1}</div>
                  <h3 className="text-xl font-semibold text-white mb-2">{t}</h3>
                  <p className="text-gray-400 leading-relaxed">{d}</p>
                </SpotlightCard>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── Spotlight on the speaker ───────── */}
      <section className="relative py-28 bg-black overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 45% 55% at 30% 50%, rgba(16,185,129,0.16), transparent 70%)' }} />
        <div className="container mx-auto px-4 max-w-7xl relative grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <AnimateOnScroll animation="reveal-scale">
            <SpeakerVisual className="w-full max-w-[560px] mx-auto aspect-square" hotspots />
            <p className="text-center text-sm text-gray-500 mt-2">{nl ? 'Ga met je muis over de groene punten (of tik erop) voor uitleg per knop.' : 'Hover over (or tap) the green dots to learn what each button does.'}</p>
          </AnimateOnScroll>
          <AnimateOnScroll>
            <span className="eyebrow">{nl ? 'De hardware' : 'The hardware'}</span>
            <h2 className="display text-4xl md:text-6xl mt-4 mb-6">Jabra Speak <span className="serif text-primary-300">510.</span></h2>
            <p className="lead mb-8">
              {nl
                ? 'Een speaker en microfoon in één, gemaakt om spraak in een hele ruimte helder op te vangen. Wij kopen hem voor je in, stellen hem in en zetten hem neer waar hij het beste werkt.'
                : 'A speaker and microphone in one, built to pick up speech clearly across a whole room. We buy it for you, set it up and place it where it works best.'}
            </p>
            <div className="surface-inner inline-flex items-center gap-4 px-5 py-4">
              <div className="text-3xl font-semibold text-white">€100</div>
              <div className="text-sm text-gray-400 leading-tight">{nl ? 'per speaker' : 'per speaker'}<br /><span className="text-gray-500">{nl ? 'excl. btw, los van je pakket' : 'excl. VAT, on top of your package'}</span></div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ───────── How it works ───────── */}
      <section className="py-28 bg-dark-950">
        <div className="container mx-auto px-4 max-w-7xl">
          <AnimateOnScroll>
            <span className="eyebrow">{nl ? 'Zo werkt het' : 'How it works'}</span>
            <h2 className="display text-4xl md:text-6xl mt-4 mb-14">{nl ? <>Wij doen het werk. <span className="serif text-primary-300">Jij praat.</span></> : <>We do the work. <span className="serif text-primary-300">You talk.</span></>}</h2>
          </AnimateOnScroll>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {steps.map(([t, d], i) => (
              <AnimateOnScroll key={t} delay={i * 0.07}>
                <SpotlightCard className="surface h-full p-7">
                  <div className="w-10 h-10 rounded-full bg-white text-dark-950 flex items-center justify-center font-bold mb-8">{i + 1}</div>
                  <h3 className="text-lg font-semibold text-white mb-2">{t}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{d}</p>
                </SpotlightCard>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── Pricing ───────── */}
      <section id="pakketten" className="py-28 bg-dark-950 border-t border-white/5 scroll-mt-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <AnimateOnScroll>
            <div className="text-center mb-14">
              <span className="eyebrow">{nl ? 'Pakketten' : 'Packages'}</span>
              <h2 className="display text-4xl md:text-6xl mt-4 mb-4">{nl ? <>Kies je <span className="serif text-primary-300">ruimte.</span></> : <>Choose your <span className="serif text-primary-300">space.</span></>}</h2>
              <p className="lead max-w-xl mx-auto">{nl ? 'Alle prijzen excl. btw en excl. Jabra Speak (€100 per stuk).' : 'All prices excl. VAT and excl. Jabra Speak (€100 each).'}</p>
            </div>
          </AnimateOnScroll>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
            {packages.map((p, i) => (
              <AnimateOnScroll key={p.name} delay={i * 0.08}>
                <SpotlightCard className={`h-full p-8 md:p-10 flex flex-col rounded-[1.75rem] ${p.featured ? 'price-featured' : 'surface'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-2xl font-semibold text-white">{p.name}</h3>
                    {p.featured && <span className="chip !bg-primary-500 !text-dark-950">{nl ? 'Meest gekozen' : 'Most popular'}</span>}
                  </div>
                  <p className="text-gray-400 mb-8">{p.who}</p>
                  <div className="mb-1 flex items-baseline gap-2">
                    <span className="text-5xl font-semibold text-white tracking-tight">€{p.once}</span>
                    <span className="text-gray-400 text-sm">{nl ? 'eenmalig' : 'one-off'}</span>
                  </div>
                  <div className="text-primary-300 font-medium mb-8">+ €{p.monthly} {nl ? 'per maand' : 'per month'}</div>
                  <ul className="space-y-3 mb-10">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-start gap-3 text-gray-200"><span className="check-dot mt-0.5"><CheckIcon /></span>{f}</li>
                    ))}
                  </ul>
                  <a
                    href={wa(nl ? `Hoi Varexo! Ik wil graag het ${p.name}-pakket voor Rexo AI (€${p.once} + €${p.monthly} p/m).` : `Hi Varexo! I would like the ${p.name} Rexo AI package (€${p.once} + €${p.monthly} p/m).`)}
                    target="_blank" rel="noopener noreferrer"
                    className={`mt-auto justify-center ${p.featured ? 'btn-primary-modern' : 'btn-ghost-modern'}`}
                  >
                    {nl ? `Kies ${p.name}` : `Choose ${p.name}`} <ArrowIcon className="w-4 h-4 ml-2" />
                  </a>
                </SpotlightCard>
              </AnimateOnScroll>
            ))}
          </div>

          {/* Custom quote */}
          <AnimateOnScroll>
            <SpotlightCard className="surface mt-4 p-8 md:p-10 flex flex-col md:flex-row md:items-center gap-6">
              <div className="flex-1">
                <h3 className="text-2xl font-semibold text-white mb-2">{nl ? <>Iets anders in gedachten? <span className="serif text-primary-300">Laten we praten.</span></> : <>Something else in mind? <span className="serif text-primary-300">Let's talk.</span></>}</h3>
                <p className="text-gray-400">{nl ? 'Meer ruimtes, een ander budget of een speciale wens? We maken graag een offerte op maat en kunnen andere prijzen afspreken. Stuur ons gewoon een WhatsApp-bericht.' : 'More rooms, a different budget or a special request? We are happy to make a custom quote and agree on different pricing. Just send us a WhatsApp message.'}</p>
              </div>
              <a href={wa(nl ? 'Hoi Varexo! Ik wil graag een offerte op maat voor een AI-assistent.' : 'Hi Varexo! I would like a custom quote for an AI assistant.')} target="_blank" rel="noopener noreferrer"
                className="shrink-0 inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-[#25D366] text-white font-semibold hover:brightness-110 transition">
                <WaIcon /> {nl ? 'Offerte via WhatsApp' : 'Quote via WhatsApp'}
              </a>
            </SpotlightCard>
          </AnimateOnScroll>
        </div>
      </section>

      <RexoBanner />

      {/* ───────── FAQ ───────── */}
      <section className="py-24 bg-dark-950 border-t border-white/5">
        <div className="container mx-auto px-4 max-w-4xl">
          <AnimateOnScroll>
            <h2 className="display text-4xl md:text-5xl mb-10 text-center">{nl ? <>Veelgestelde <span className="serif text-primary-300">vragen.</span></> : <>Frequently asked <span className="serif text-primary-300">questions.</span></>}</h2>
          </AnimateOnScroll>
          <FaqList items={faqs} />
        </div>
      </section>

      {/* ───────── CTA ───────── */}
      <section className="relative bg-dark-950 pt-10 pb-28 overflow-hidden">
        <div className="aurora aurora-bottom" />
        <div className="container mx-auto px-4 max-w-5xl relative z-10 text-center">
          <div className="mb-6"><RexoMark className="text-4xl md:text-5xl" /></div>
          <h2 className="display text-5xl md:text-8xl mb-8">{nl ? <>Klaar om te <span className="serif text-primary-300">praten?</span></> : <>Ready to <span className="serif text-primary-300">talk?</span></>}</h2>
          <div className="flex flex-wrap justify-center gap-3">
            <Magnetic>
              <a href={wa(nl ? 'Hoi Varexo! Ik wil graag een AI-assistent bij mij thuis/op kantoor.' : 'Hi Varexo! I would like an AI assistant at my home/office.')} target="_blank" rel="noopener noreferrer" className="btn-primary-modern btn-lg gap-2">
                <WaIcon /> {nl ? 'Stuur een WhatsApp' : 'Send a WhatsApp'}
              </a>
            </Magnetic>
            <Link to="/contact" className="btn-ghost-modern">{nl ? 'Of gebruik het contactformulier' : 'Or use the contact form'}</Link>
          </div>
        </div>
      </section>
    </PageTransition>
  );
};

const FaqList: React.FC<{ items: string[][] }> = ({ items }) => {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="border-t border-white/10">
      {items.map(([q, a], i) => (
        <div key={q} className="border-b border-white/10">
          <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center justify-between gap-6 text-left py-6 group">
            <span className="text-lg md:text-xl text-white group-hover:text-primary-300 transition-colors">{q}</span>
            <span className={`shrink-0 w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-300 transition-all duration-300 ${open === i ? 'rotate-45 bg-primary-500 text-dark-950 border-primary-500' : ''}`}>+</span>
          </button>
          <div className="grid transition-all duration-300" style={{ gridTemplateRows: open === i ? '1fr' : '0fr' }}>
            <div className="overflow-hidden"><p className="pb-6 text-gray-400 leading-relaxed max-w-2xl">{a}</p></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AiAssistent;
