// SEO landing pages data
// These pages exist at /:slug routes but are NOT visible in the main navigation.
// They are designed for SEO purposes - to rank on Google for specific keywords.

export interface LandingPageData {
  title: string; // SEO title (max 60 chars)
  description: string; // Meta description (max 155 chars)
  keywords?: string;
  h1: string;
  intro: string;
  sections: { h2: string; text: string }[];
  cta: { text: string; button: string };
  language?: 'nl' | 'en';
}

// ============================================================
// CITY TEMPLATE - NL
// ============================================================
const nlCity = (city: string, region?: string): LandingPageData => ({
  title: `Webdesign ${city} | Vanaf €650 | Varexo - 7 Dagen Live`,
  description: `Webdesign ${city} nodig? Varexo levert jouw professionele website binnen 7 dagen live. Vanaf €650 (korting tot 31 mei). React & Next.js maatwerk.`,
  keywords: `webdesign ${city.toLowerCase()}, website laten maken ${city.toLowerCase()}, webdevelopment ${city.toLowerCase()}, website ${city.toLowerCase()}`,
  h1: `Webdesign ${city} – Professionele Websites Vanaf €650`,
  intro: `Op zoek naar webdesign in ${city} dat écht resultaat oplevert? Bij Varexo bouwen wij snelle, schaalbare en professionele websites voor ondernemers, ZZP'ers en MKB-bedrijven uit ${city}${region ? ` en omgeving ${region}` : ''}. Of je nu een nieuwe website nodig hebt of jouw huidige site wilt vernieuwen — wij leveren maatwerk binnen 7 dagen live. Tijdelijk al vanaf €650 (normaal €849,99) tot 31 mei. Met React & Next.js technologie zorgen we voor een website die snel laadt, mooi oogt en converteert.`,
  sections: [
    {
      h2: `Webdesign ${city} op maat – speciaal voor jouw bedrijf`,
      text: `Iedere onderneming in ${city} is uniek. Daarom geloven wij niet in standaard templates, maar in webdesign op maat. Of je nu een restaurant, advocatenkantoor, bouwbedrijf of webshop hebt in ${city} — Varexo ontwerpt een website die past bij jouw merk, doelgroep en doelen. Wij combineren modern design met krachtige techniek (React & Next.js) zodat jouw website niet alleen mooi is, maar ook razendsnel laadt en hoog scoort in Google. Resultaat: meer bezoekers, meer leads, meer omzet voor jouw bedrijf in ${city}.`,
    },
    {
      h2: `Binnen 7 dagen live – mét garantie op nieuwe klanten`,
      text: `Tijd is geld, zeker voor ondernemers in ${city}. Daarom hebben wij ons proces volledig geoptimaliseerd: jouw nieuwe website staat binnen 7 werkdagen live. Geen lange wachttijden, geen eindeloze revisierondes — wel een professioneel resultaat. Sterker nog: wij geven garantie op nieuwe klanten. Door slimme SEO-optimalisatie en een conversiegerichte structuur zorgen wij dat jouw website daadwerkelijk leads oplevert. Krijg je geen resultaat? Dan kijken we samen wat er beter kan, kosteloos. Zo simpel.`,
    },
    {
      h2: `Meer dan webdesign – ook maatwerk software`,
      text: `Varexo is meer dan alleen een webdesignbureau in ${city}. Wij bouwen ook maatwerk software waarmee je jouw bedrijf efficiënter runt: van CRM-systemen en klantportalen tot urenregistratie, facturatiesoftware en API-koppelingen. Heb je een idee voor een app of platform? Wij ontwikkelen het van A tot Z, volledig op jouw wensen afgestemd. Eén partij voor jouw website én software — dat scheelt tijd, geld én gedoe. Profiteer nu van €200 korting tot 31 mei.`,
    },
  ],
  cta: {
    text: `Klaar om jouw bedrijf in ${city} online te laten groeien?`,
    button: 'Start mijn project',
  },
});

// ============================================================
// CITY TEMPLATE - BE
// ============================================================
const beCity = (city: string): LandingPageData => ({
  title: `Webdesign ${city} | Vanaf €650 | Varexo - 7 Dagen Live`,
  description: `Webdesign ${city} nodig? Varexo bouwt jouw professionele website binnen 7 dagen. Vanaf €650 (actie tot 31 mei). Maatwerk in React & Next.js.`,
  keywords: `webdesign ${city.toLowerCase()}, website laten maken ${city.toLowerCase()}, webdevelopment ${city.toLowerCase()} belgië`,
  h1: `Webdesign ${city} – Snelle & Professionele Websites`,
  intro: `Zoek je webdesign in ${city}? Varexo bouwt razendsnelle en professionele websites voor Belgische ondernemers en KMO's. Of je nu in hartje ${city} zit of in de regio actief bent — wij leveren maatwerk binnen 7 dagen live. Vanaf €650 (normaal €849,99) tot 31 mei. Dankzij moderne technologieën zoals React en Next.js krijg je een website die snel, mooi én vindbaar is in Google.`,
  sections: [
    {
      h2: `Webdesign ${city} op maat`,
      text: `Geen standaard templates, maar échte websites op maat. Voor restaurants, vrije beroepen, webshops of dienstverleners in ${city} — Varexo ontwerpt jouw site rond jouw merk en klanten. Modern design gecombineerd met krachtige techniek zorgt voor topprestaties: snelle laadtijden, hoge Google-rankings en meer conversies. Zo wordt jouw website een échte verkoopmotor voor je zaak in ${city}.`,
    },
    {
      h2: `Binnen 7 dagen live + garantie op nieuwe klanten`,
      text: `Geen weken of maanden wachten. Onze workflow zorgt dat jouw website binnen 7 werkdagen live staat in ${city}. Daarbovenop geven wij garantie op nieuwe klanten: door SEO en conversiegerichte design zorgen wij dat je site daadwerkelijk leads oplevert. Komt het resultaat niet, dan optimaliseren wij gratis verder. Resultaatgericht webdesign, zonder risico.`,
    },
    {
      h2: `Ook maatwerk software voor Belgische bedrijven`,
      text: `Varexo bouwt naast websites ook maatwerk software: CRM, planningssystemen, klantportalen, facturatie en API-koppelingen. Eén partner voor al je digitale projecten in ${city}. Met React, Next.js en moderne backend-tech leveren wij schaalbare oplossingen die jouw bedrijf laten groeien. Profiteer van €200 korting tot 31 mei.`,
    },
  ],
  cta: { text: `Klaar om door te groeien in ${city}?`, button: 'Vraag offerte aan' },
});

// ============================================================
// CITY TEMPLATE - UK (English)
// ============================================================
const ukCity = (city: string): LandingPageData => ({
  title: `Web Design ${city} | From £650 | Varexo - Live in 7 Days`,
  description: `Looking for web design in ${city}? Varexo builds professional websites in 7 days. From £650 (offer until 31 May). React & Next.js custom builds.`,
  keywords: `web design ${city.toLowerCase()}, website design ${city.toLowerCase()}, web development ${city.toLowerCase()}, website ${city.toLowerCase()} uk`,
  h1: `Web Design ${city} – Professional Websites From £650`,
  intro: `Looking for high-quality web design in ${city}? At Varexo, we build fast, scalable and professional websites for entrepreneurs, freelancers and SMEs across ${city} and the wider UK. Whether you need a brand-new website or want to upgrade your current one — we deliver custom-built sites within 7 days, live. Starting from just £650 (normally £849.99) until 31 May. Powered by React & Next.js for blazing-fast performance and Google-friendly results.`,
  sections: [
    {
      h2: `Custom web design ${city} – tailored to your business`,
      text: `Every business in ${city} is different. That's why we don't use generic templates — we build websites that match your brand, audience and goals. From restaurants and law firms to construction companies and online shops, Varexo creates a site that works specifically for your industry. Modern design + powerful tech (React & Next.js) = a website that loads fast, looks great and ranks high in Google. The result? More visitors, more leads, more revenue for your ${city} business.`,
    },
    {
      h2: `Live in 7 days – with new customer guarantee`,
      text: `Time is money, especially in ${city}. Our optimised process means your new website goes live in just 7 working days. No long waiting times, no endless revision rounds — just a professional result you can use right away. Plus: we guarantee new customers. Through smart SEO and conversion-focused design, we make sure your site actually generates leads. No results? We optimise further at no cost. Risk-free web design.`,
    },
    {
      h2: `More than web design – custom software too`,
      text: `Varexo isn't just a web design agency in ${city}. We also build custom software solutions: CRM systems, customer portals, time tracking, invoicing software and API integrations. Have an idea for an app or platform? We develop it from start to finish, fully tailored to your needs. One partner for your website AND software — saves time, money and hassle. Get £200 discount until 31 May.`,
    },
  ],
  cta: { text: `Ready to grow your business in ${city}?`, button: 'Start my project' },
  language: 'en',
});

// ============================================================
// NICHE TEMPLATE
// ============================================================
const niche = (
  niche: string,
  nicheLower: string,
  desc: string,
  features: string,
  examples: string
): LandingPageData => ({
  title: `Website Laten Maken ${niche} | Vanaf €650 | Varexo`,
  description: `Website laten maken voor ${nicheLower}? Varexo bouwt jouw professionele website binnen 7 dagen. Vanaf €650 (actie tot 31 mei). Garantie op klanten.`,
  keywords: `website laten maken ${nicheLower}, webdesign ${nicheLower}, website ${nicheLower}`,
  h1: `Website Laten Maken voor ${niche} – Vanaf €650`,
  intro: `Een professionele website is essentieel voor elke ${nicheLower}. Bij Varexo bouwen wij websites speciaal afgestemd op ${nicheLower}: ${desc} Wij leveren binnen 7 dagen een live website, vanaf €650 (normaal €849,99) tot 31 mei. Met focus op design, SEO en conversie. Zo word je sneller gevonden door nieuwe klanten en groei je harder dan je concurrenten.`,
  sections: [
    {
      h2: `Wat maakt een goede website voor ${niche.toLowerCase()}?`,
      text: `Een succesvolle website voor ${nicheLower} is meer dan alleen mooi. Het draait om vertrouwen wekken, vindbaarheid in Google én eenvoudig contact opnemen. ${features} Wij combineren strakke design met sterke SEO en duidelijke CTA's, zodat bezoekers snel klanten worden. Onze websites laden razendsnel (Core Web Vitals score 90+) en zijn volledig responsive — perfect voor mobiele bezoekers.`,
    },
    {
      h2: `Belangrijke functies voor ${nicheLower}`,
      text: `${examples} Daarnaast zorgen wij voor SEO-optimalisatie zodat je gevonden wordt op zoekwoorden zoals "${nicheLower} [jouw stad]". Een Google Bedrijfsprofiel-koppeling, reviews-integratie en lokale schema markup zijn standaard inbegrepen. Alles wat een ${nicheLower} nodig heeft om online te scoren.`,
    },
    {
      h2: `Binnen 7 dagen online + garantie op nieuwe klanten`,
      text: `Geen tijd te verliezen. Wij leveren jouw website binnen 7 werkdagen live af, inclusief domein, hosting, SSL en SEO basis. Geen verrassingen, vaste prijs vanaf €650. En het beste: wij geven garantie op nieuwe klanten. Levert je website geen resultaat? Dan optimaliseren wij gratis verder tot het wél werkt. Zo lopen wij samen het pad naar online succes.`,
    },
  ],
  cta: { text: `Klaar om als ${nicheLower} online te scoren?`, button: 'Vraag offerte aan' },
});

// ============================================================
// ALL PAGES
// ============================================================
export const seoLandingPages: Record<string, LandingPageData> = {
  // === NL CITIES (19) ===
  'webdesign-amsterdam': nlCity('Amsterdam', 'Noord-Holland'),
  'webdesign-rotterdam': nlCity('Rotterdam', 'Zuid-Holland'),
  'webdesign-den-haag': nlCity('Den Haag', 'Zuid-Holland'),
  'webdesign-utrecht': nlCity('Utrecht'),
  'webdesign-eindhoven': nlCity('Eindhoven', 'Brabant'),
  'webdesign-tilburg': nlCity('Tilburg', 'Brabant'),
  'webdesign-groningen': nlCity('Groningen'),
  'webdesign-almere': nlCity('Almere', 'Flevoland'),
  'webdesign-breda': nlCity('Breda', 'Brabant'),
  'webdesign-nijmegen': nlCity('Nijmegen', 'Gelderland'),
  'webdesign-haarlem': nlCity('Haarlem', 'Noord-Holland'),
  'webdesign-arnhem': nlCity('Arnhem', 'Gelderland'),
  'webdesign-enschede': nlCity('Enschede', 'Overijssel'),
  'webdesign-apeldoorn': nlCity('Apeldoorn', 'Gelderland'),
  'webdesign-zoetermeer': nlCity('Zoetermeer', 'Zuid-Holland'),
  'webdesign-zwolle': nlCity('Zwolle', 'Overijssel'),
  'webdesign-deventer': nlCity('Deventer', 'Overijssel'),
  'webdesign-leiden': nlCity('Leiden', 'Zuid-Holland'),
  'webdesign-dordrecht': nlCity('Dordrecht', 'Zuid-Holland'),

  // === BE CITIES (5) ===
  'webdesign-antwerpen': beCity('Antwerpen'),
  'webdesign-gent': beCity('Gent'),
  'webdesign-brussel': beCity('Brussel'),
  'webdesign-brugge': beCity('Brugge'),
  'webdesign-leuven': beCity('Leuven'),

  // === UK CITIES (7) ===
  'web-design-london': ukCity('London'),
  'web-design-manchester': ukCity('Manchester'),
  'web-design-birmingham': ukCity('Birmingham'),
  'web-design-leeds': ukCity('Leeds'),
  'web-design-glasgow': ukCity('Glasgow'),
  'web-design-liverpool': ukCity('Liverpool'),
  'web-design-bristol': ukCity('Bristol'),

  // === UK GENERAL/SERVICE PAGES ===
  'website-design-uk': {
    title: 'Website Design UK | From £650 | Varexo - 7 Days Live',
    description: 'Professional website design across the UK. Live in 7 days, from £650 (offer ends 31 May). React & Next.js custom builds with new customer guarantee.',
    keywords: 'website design uk, web design uk, professional website uk, website builder uk',
    h1: 'Website Design UK – Professional Sites From £650',
    intro: `Varexo delivers professional website design across the UK. From London to Manchester, Birmingham to Glasgow — we build fast, modern and conversion-focused websites for businesses of all sizes. Live in 7 days, from £650 (normally £849.99) until 31 May. Powered by React & Next.js for the ultimate performance.`,
    sections: [
      { h2: 'Why choose Varexo for UK web design', text: 'We combine sleek design with powerful technology to deliver websites that perform. Every site is custom-built, mobile-first, SEO-optimised and lightning-fast. Whether you\'re a startup or established company, we build a site that grows with you. Plus: new customer guarantee — no leads, no problem, we keep optimising for free.' },
      { h2: 'Live in 7 days, no compromise on quality', text: 'Our streamlined process gets your website live within 7 working days. Domain, hosting, SSL and basic SEO included. Fixed price, no surprises. We work transparently with regular updates so you always know what\'s happening.' },
      { h2: 'Custom software development too', text: 'Beyond websites, Varexo builds custom software: CRM systems, customer portals, time tracking, invoicing platforms and API integrations. One partner for all your digital needs across the UK.' },
    ],
    cta: { text: 'Ready to launch your UK business online?', button: 'Start my project' },
    language: 'en',
  },
  'custom-software-development-uk': {
    title: 'Custom Software Development UK | Varexo',
    description: 'Custom software development across the UK. CRM, portals, ERP, APIs and more. Built with React, Next.js & modern tech. Get your free consultation today.',
    keywords: 'custom software development uk, bespoke software uk, software development london, custom software',
    h1: 'Custom Software Development UK – Built For Your Business',
    intro: `Need custom software for your UK business? Varexo develops bespoke software solutions tailored exactly to your processes. From CRM systems and customer portals to ERP, scheduling and invoicing platforms — we build it from scratch using React, Next.js and modern backend technology.`,
    sections: [
      { h2: 'Why custom software beats off-the-shelf', text: 'Off-the-shelf software forces you to adapt to it. Custom software adapts to YOU. We analyse your workflow, identify bottlenecks and build software that automates your business — saving hours every week and eliminating manual errors.' },
      { h2: 'Modern tech stack, scalable architecture', text: 'We use React, Next.js, Node.js and PostgreSQL — proven technologies trusted by global enterprises. Your software is fast, secure, scalable and future-proof. API integrations with your existing tools (Google, Microsoft, Stripe, etc.) are standard.' },
      { h2: 'Transparent pricing & full support', text: 'No hidden costs, no vendor lock-in. You own the code. We offer ongoing maintenance, feature additions and 24/7 support. From small tools to enterprise platforms — we deliver bespoke software that drives real ROI.' },
    ],
    cta: { text: 'Got a software idea? Let\'s build it.', button: 'Book free consultation' },
    language: 'en',
  },
  'web-development-uk': {
    title: 'Web Development UK | React & Next.js | Varexo',
    description: 'Web development across the UK with React, Next.js and modern frameworks. Fast, scalable, SEO-friendly websites and web apps from £650.',
    keywords: 'web development uk, react development uk, nextjs development, web app development',
    h1: 'Web Development UK – Modern, Fast, Scalable',
    intro: `Looking for top-tier web development in the UK? Varexo specialises in modern web development using React, Next.js, TypeScript and Node.js. We build websites and web applications that load in milliseconds, scale effortlessly and rank high in Google.`,
    sections: [
      { h2: 'React & Next.js specialists', text: 'We are React & Next.js experts. These frameworks power some of the world\'s biggest websites (Netflix, Hulu, TikTok). Your website gets the same enterprise-grade performance — fast, SEO-friendly and beautifully animated.' },
      { h2: 'From websites to web apps', text: 'Need more than a website? We build full-blown web applications: dashboards, SaaS platforms, e-commerce systems, booking platforms and customer portals. All custom-built, mobile-first and integrated with your existing tools.' },
      { h2: 'Live in 7 days, with guarantee', text: 'Standard websites are live in 7 days, larger projects in 2-4 weeks. Fixed pricing, full transparency, plus our new customer guarantee. We don\'t just deliver code — we deliver business results.' },
    ],
    cta: { text: 'Ready to build something amazing?', button: 'Get started today' },
    language: 'en',
  },

  // === SERVICE / GENERAL PAGES (NL) ===
  'website-laten-maken': {
    title: 'Website Laten Maken | Vanaf €650 | Varexo - 7 Dagen Live',
    description: 'Website laten maken? Varexo bouwt jouw professionele website binnen 7 dagen live. Vanaf €650 (actie tot 31 mei). React & Next.js maatwerk met garantie.',
    keywords: 'website laten maken, website bouwen, professionele website, webdesign, website laten bouwen',
    h1: 'Website Laten Maken – Vanaf €650, Binnen 7 Dagen Live',
    intro: `Wil jij een website laten maken die echt resultaat oplevert? Varexo bouwt razendsnelle, mooie en converterende websites op maat. Geen standaard templates, maar een unieke website die past bij jouw merk. Vanaf €650 (normaal €849,99) tot 31 mei. Binnen 7 dagen live, mét garantie op nieuwe klanten.`,
    sections: [
      { h2: 'Wat krijg je bij Varexo?', text: 'Een professionele website met modern design, snelle laadtijden, SEO-optimalisatie en mobiele weergave. Inclusief domein, hosting, SSL-certificaat en eerste maand support. Geen verrassingen achteraf — vaste prijs vanaf €650. Bouwen wij voor jou een website? Dan krijg je een complete oplossing waar je direct mee aan de slag kunt.' },
      { h2: 'React & Next.js — de modernste technologie', text: 'Wij bouwen niet met WordPress alleen, maar met React en Next.js. Dit zorgt voor websites die in milliseconden laden, perfect scoren op Core Web Vitals en uitstekend ranken in Google. Resultaat: meer bezoekers, meer leads en meer omzet voor jouw bedrijf.' },
      { h2: 'Garantie op nieuwe klanten', text: 'Wij geven écht garantie. Levert je website geen nieuwe klanten op? Dan optimaliseren wij kosteloos verder tot het wél werkt. Door slimme SEO en conversiegerichte design zorgen wij ervoor dat jouw site daadwerkelijk leads oplevert. Zo loop jij geen risico.' },
    ],
    cta: { text: 'Klaar om jouw nieuwe website te lanceren?', button: 'Vraag gratis offerte aan' },
  },
  'webshop-laten-maken': {
    title: 'Webshop Laten Maken | Vanaf €650 | Varexo - Snel Online',
    description: 'Webshop laten maken? Varexo bouwt jouw professionele webshop binnen 7-14 dagen live. Vanaf €650 (actie tot 31 mei). iDEAL, Stripe & meer.',
    keywords: 'webshop laten maken, online winkel bouwen, webshop bouwen, e-commerce website',
    h1: 'Webshop Laten Maken – Verkoop Online Vanaf €650',
    intro: `Wil je een webshop laten maken waarmee je direct kunt gaan verkopen? Varexo bouwt razendsnelle, mooie en converterende webshops met iDEAL, creditcard, PayPal en meer betaalmethoden. Vanaf €650 (normaal €849,99) tot 31 mei. Binnen 7-14 dagen live, inclusief productpagina's en checkout.`,
    sections: [
      { h2: 'Alles wat een succesvolle webshop nodig heeft', text: 'Productpagina\'s, winkelwagen, checkout, betaalintegraties (iDEAL, Stripe, PayPal), voorraadbeheer, verzendkosten, kortingscodes, klantaccount — wij regelen het allemaal. Inclusief een dashboard waar jij eenvoudig producten kunt toevoegen, voorraad beheren en bestellingen verwerken.' },
      { h2: 'Snel, mobielvriendelijk en SEO-geoptimaliseerd', text: '70% van webshop bezoekers komt via mobiel. Daarom bouwen wij elke webshop mobile-first met razendsnelle laadtijden. Met sterke SEO en gestructureerde productdata word jij gevonden in Google Shopping en organische resultaten. Meer bezoekers = meer verkopen.' },
      { h2: 'Koppelingen met boekhouding & verzending', text: 'Wij integreren jouw webshop met populaire systemen: Moneybird, Exact, Snelstart, MyParcel, PostNL, DHL en meer. Zo wordt jouw orderverwerking vrijwel volledig automatisch. Geen handmatig werk meer — meer tijd voor jouw business.' },
    ],
    cta: { text: 'Klaar om online te gaan verkopen?', button: 'Start mijn webshop' },
  },
  'software-laten-maken': {
    title: 'Software Laten Maken | Maatwerk | Varexo',
    description: 'Software laten maken op maat? Varexo ontwikkelt CRM, portalen, ERP en meer met React & Next.js. Schaalbaar, veilig en snel. Vraag offerte aan.',
    keywords: 'software laten maken, maatwerk software, custom software, software ontwikkeling',
    h1: 'Software Laten Maken – Maatwerk Voor Jouw Bedrijf',
    intro: `Heb je software nodig die exact past bij jouw bedrijfsproces? Varexo ontwikkelt maatwerk software van A tot Z: CRM-systemen, klantportalen, planningstools, ERP, dashboards en API-koppelingen. Gebouwd met React, Next.js en moderne backend-tech. Schaalbaar, veilig en gericht op jouw ROI.`,
    sections: [
      { h2: 'Waarom maatwerk software?', text: 'Standaard software dwingt je om je proces aan te passen. Maatwerk software past zich aan JOU aan. Wij analyseren jouw workflow, identificeren knelpunten en bouwen software die uren werk per week scheelt. Geen abonnementskosten meer voor functies die je niet gebruikt.' },
      { h2: 'Modern, schaalbaar en veilig', text: 'Wij gebruiken React, Next.js, Node.js en PostgreSQL — bewezen technologieën die wereldwijd door grote bedrijven worden vertrouwd. Jouw software is snel, veilig (encryptie, GDPR-compliant) en groeit mee met jouw bedrijf. Integraties met Google, Microsoft, Stripe etc. zijn standaard.' },
      { h2: 'Transparant proces, jij bezit de code', text: 'Geen vendor lock-in: jij wordt eigenaar van de code. Wij leveren onderhoud, doorontwikkeling en support op aanvraag. Van kleine tools tot enterprise-platforms — wij maken software die écht werkt voor jouw business.' },
    ],
    cta: { text: 'Heb jij een softwareidee? Laten we het bouwen.', button: 'Plan gratis adviesgesprek' },
  },
  'app-laten-maken': {
    title: 'App Laten Maken | iOS, Android & Web | Varexo',
    description: 'App laten maken voor iOS, Android of als webapp? Varexo ontwikkelt razendsnelle apps met React Native & Next.js. Vanaf maatwerk offerte.',
    keywords: 'app laten maken, mobiele app bouwen, react native app, webapp ontwikkeling',
    h1: 'App Laten Maken – Voor iOS, Android & Web',
    intro: `Wil je een app laten maken? Varexo ontwikkelt mobiele apps voor iOS en Android, plus razendsnelle webapps. Met React Native bouwen wij één app die op alle platforms werkt — bespaart jou tijd én geld. Modern design, snelle prestaties en een focus op gebruikerservaring.`,
    sections: [
      { h2: 'Eén codebase, alle platforms', text: 'Met React Native bouwen wij apps die zowel op iOS als Android draaien vanuit één codebase. Sneller te ontwikkelen, goedkoper te onderhouden en functioneel identiek aan native apps. Camera, GPS, push-notificaties — alles werkt soepel.' },
      { h2: 'Webapps die voelen als native', text: 'Geen tijd of budget voor een mobiele app? Een Progressive Web App (PWA) in Next.js werkt direct in de browser, kan op het startscherm geïnstalleerd worden en stuurt push-notificaties. Goedkoper, sneller online en zonder app store gedoe.' },
      { h2: 'Van idee tot lancering', text: 'Wij begeleiden je door het hele proces: concept, design, ontwikkeling, testen, app store submission en marketing. Jij focust op je business, wij regelen de techniek. Inclusief 1 maand gratis support na lancering.' },
    ],
    cta: { text: 'Heb jij een app-idee? Laten we praten.', button: 'Vraag offerte aan' },
  },
  'maatwerk-software': {
    title: 'Maatwerk Software Laten Maken | Varexo',
    description: 'Maatwerk software op maat van jouw bedrijf. Bespaar uren werk, automatiseer processen. Gebouwd met moderne tech door Varexo. Vraag offerte aan.',
    keywords: 'maatwerk software, custom software, software op maat, maatwerk applicatie',
    h1: 'Maatwerk Software – Volledig Op Maat Voor Jouw Bedrijf',
    intro: `Standaard software niet flexibel genoeg? Varexo ontwikkelt maatwerk software die exact past bij jouw bedrijfsproces. Van eenvoudige tools tot complexe ERP-systemen — wij bouwen het. Modern, schaalbaar en met focus op gebruiksgemak.`,
    sections: [
      { h2: 'Wat is maatwerk software?', text: 'Maatwerk software wordt speciaal voor jou gebouwd, gebaseerd op jouw unieke processen en wensen. Geen onnodige features, geen abonnementen, geen compromissen. Volledig eigendom van jouw bedrijf, jij bepaalt de richting.' },
      { h2: 'Wanneer kies je voor maatwerk?', text: 'Als bestaande software niet aansluit, je teveel tijd kwijt bent aan handmatige taken, of je een uniek bedrijfsproces hebt. Maatwerk verdient zich vaak binnen 6-12 maanden terug door tijdsbesparing en efficiëntiewinst.' },
      { h2: 'Onze aanpak', text: 'Wij starten met een analyse van jouw processen, daarna ontwerp, ontwikkeling en oplevering. Iteratief, transparant en in samenspraak met jou. Na livegang bieden wij onderhoud, doorontwikkeling en support — alles in één pakket.' },
    ],
    cta: { text: 'Klaar om jouw bedrijf te automatiseren?', button: 'Vraag gratis adviesgesprek' },
  },
  'crm-systeem-laten-maken': {
    title: 'CRM Systeem Laten Maken | Maatwerk | Varexo',
    description: 'CRM systeem laten maken op maat? Varexo bouwt jouw CRM met klantbeheer, leads, deals en rapportage. Snel, schaalbaar en betaalbaar.',
    keywords: 'crm systeem laten maken, maatwerk crm, custom crm, klantbeheer software',
    h1: 'CRM Systeem Laten Maken – Op Maat Voor Jouw Sales',
    intro: `Een CRM dat écht past bij jouw verkoopproces? Varexo ontwikkelt maatwerk CRM-systemen waarmee je leads, klanten, deals en taken centraal beheert. Geen Salesforce-tarieven, geen gedwongen functies — alleen wat jij nodig hebt.`,
    sections: [
      { h2: 'Functies van jouw CRM', text: 'Klantbeheer, lead-tracking, sales pipeline, taken & afspraken, e-mail integratie, rapportages, gebruikersrechten — alles wat je nodig hebt. Op maat uitgebreid met functies specifiek voor jouw branche.' },
      { h2: 'Integratie met je bestaande tools', text: 'Koppelingen met Google Workspace, Microsoft 365, Outlook, Mailchimp, telefoonsystemen, boekhouding (Moneybird, Exact) en meer. Alle data centraal — geen losse tools meer.' },
      { h2: 'Schaalbaar mee met jouw groei', text: 'Begin klein, groei groot. Onze CRM-systemen schalen mee van 5 tot 5000 gebruikers. Snelle prestaties gegarandeerd door moderne tech (React, Next.js, PostgreSQL).' },
    ],
    cta: { text: 'Tijd voor een CRM dat écht werkt?', button: 'Vraag offerte aan' },
  },
  'urenregistratie-systeem': {
    title: 'Urenregistratie Systeem Laten Maken | Varexo',
    description: 'Urenregistratie systeem op maat. Snel uren boeken, projecten bijhouden, automatisch factureren. Modern en gebruiksvriendelijk. Vraag offerte aan.',
    keywords: 'urenregistratie systeem, uren bijhouden software, urenregistratie app, urenregistratie maatwerk',
    h1: 'Urenregistratie Systeem Laten Maken',
    intro: `Stop met Excel — start met een professioneel urenregistratie systeem op maat. Snel uren boeken, projecten bijhouden, automatische facturatie. Werkt op desktop, tablet én mobiel.`,
    sections: [
      { h2: 'Waarom een eigen urenregistratie systeem?', text: 'Standaard tools zijn vaak duur per gebruiker per maand. Een eigen systeem heb je voor altijd, zonder maandelijkse kosten. Plus: volledig op maat van jouw werkprocessen, projecten en facturatie-eisen.' },
      { h2: 'Functies', text: 'Snel uren boeken (mobiel of desktop), projecten en taken beheren, urenstaten goedkeuren, automatisch facturen genereren, rapportages, koppeling met boekhouding. Met focus op gebruiksgemak — medewerkers boeken hun uren in seconden.' },
      { h2: 'Integratie met facturatie', text: 'Koppelingen met Moneybird, Exact, Snelstart en eigen facturatiesoftware. Met één klik factureer je alle uren van een project of klant. Bespaart uren administratief werk per week.' },
    ],
    cta: { text: 'Klaar om uren professioneel te registreren?', button: 'Vraag offerte aan' },
  },
  'administratie-systeem': {
    title: 'Administratie Systeem Laten Maken | Varexo',
    description: 'Administratie systeem op maat voor jouw bedrijf. Centraliseer klanten, facturen, voorraad en meer. Modern, snel en gebruiksvriendelijk.',
    keywords: 'administratie systeem, administratie software, administratie maatwerk',
    h1: 'Administratie Systeem Laten Maken Op Maat',
    intro: `Jouw hele administratie in één centraal systeem. Klanten, facturen, voorraad, urenregistratie, rapportages — Varexo bouwt het op maat van jouw bedrijf. Modern dashboard, snelle prestaties en gebruiksgemak voor het hele team.`,
    sections: [
      { h2: 'Centraliseer al je administratie', text: 'Geen losse tools meer voor klanten, facturen, voorraad of uren. Alles in één systeem, op maat gebouwd. Sneller werken, minder fouten, beter overzicht.' },
      { h2: 'Toegang vanaf elk apparaat', text: 'Cloud-based, dus toegankelijk vanaf desktop, laptop, tablet en mobiel. Gebruikersrechten per medewerker, dus iedereen ziet alleen wat hij/zij mag zien.' },
      { h2: 'Schaalbaar en toekomstbestendig', text: 'Begin met de basis, breid uit naarmate jouw bedrijf groeit. Wij ontwikkelen door en blijven het systeem ondersteunen. Nooit meer vastzitten aan verouderde software.' },
    ],
    cta: { text: 'Tijd voor één centraal administratie systeem?', button: 'Vraag offerte aan' },
  },
  'boekhoudsoftware-laten-maken': {
    title: 'Boekhoudsoftware Laten Maken | Maatwerk | Varexo',
    description: 'Boekhoudsoftware op maat laten maken? Varexo bouwt jouw eigen boekhoudsysteem met facturen, BTW, koppelingen en rapportages.',
    keywords: 'boekhoudsoftware laten maken, eigen boekhoudprogramma, boekhouding maatwerk',
    h1: 'Boekhoudsoftware Laten Maken – Volledig Op Maat',
    intro: `Standaard boekhoudprogramma's zoals Moneybird of Exact te beperkt? Varexo bouwt boekhoudsoftware op maat: facturen, BTW-aangiftes, bankkoppelingen, rapportages — exact zoals jij het wilt. Geen maandelijkse kosten per gebruiker, jouw eigen systeem.`,
    sections: [
      { h2: 'Voor wie is maatwerk boekhoudsoftware?', text: 'Voor accountants en grotere bedrijven met unieke administratieve eisen, branches met specifieke regelgeving (zorg, bouw, retail) of bedrijven die te veel betalen voor SaaS-licenties. Eenmalige investering, jaren plezier.' },
      { h2: 'Functies', text: 'Inkoop & verkoop facturen, BTW-aangifte, bankkoppelingen (Rabobank, ING, ABN), rapportages, multi-administraties, gebruikersrechten en exports voor de fiscus. Volledig op maat uit te breiden.' },
      { h2: 'Veilig & GDPR-compliant', text: 'Boekhoudgegevens zijn gevoelig. Wij bouwen met sterke encryptie, regelmatige backups en GDPR-compliance. Hosted in Europa op betrouwbare servers.' },
    ],
    cta: { text: 'Klaar voor jouw eigen boekhoudsoftware?', button: 'Vraag gratis adviesgesprek' },
  },
  'personeelsplanning-systeem': {
    title: 'Personeelsplanning Systeem Laten Maken | Varexo',
    description: 'Personeelsplanning systeem op maat. Roosters, beschikbaarheid, urenregistratie en meer. Snel, mobielvriendelijk en betaalbaar.',
    keywords: 'personeelsplanning systeem, planningssysteem, roosterplanning software',
    h1: 'Personeelsplanning Systeem Op Maat',
    intro: `Roosters maken in Excel? Tijd voor iets beters. Varexo bouwt personeelsplanning systemen op maat: roosters, beschikbaarheid, ruilingen, urenregistratie en notificaties. Werkt naadloos op desktop én mobiel.`,
    sections: [
      { h2: 'Slim plannen, minder werk', text: 'Drag-and-drop roosterplanning, automatische beschikbaarheidscheck, conflict-detectie en push-notificaties naar medewerkers. Je maakt in minuten een rooster waar uren overheen ging.' },
      { h2: 'Zelf beschikbaarheid doorgeven', text: 'Medewerkers geven zelf hun beschikbaarheid door, kunnen diensten ruilen en zien hun rooster live. Bespaart jou eindeloos heen-en-weer mailen of bellen.' },
      { h2: 'Integratie met urenregistratie & loonadministratie', text: 'Gepland = geregistreerd. Inclusief koppelingen met loonadministratie en urenregistratie. Eén systeem, alles in sync.' },
    ],
    cta: { text: 'Tijd voor slimme personeelsplanning?', button: 'Vraag offerte aan' },
  },
  'facturatie-systeem': {
    title: 'Facturatie Systeem Laten Maken | Varexo',
    description: 'Facturatie systeem op maat. Snel facturen versturen, automatisch herinneringen, BTW en betalingen volgen. Modern en betaalbaar.',
    keywords: 'facturatie systeem, factuursoftware, facturatie maatwerk',
    h1: 'Facturatie Systeem – Snel En Geautomatiseerd Factureren',
    intro: `Saldo facturen in Excel? Stop. Varexo bouwt een facturatiesysteem op maat: snel factureren, automatische herinneringen, online betaling en boekhoudkoppeling. Geen abonnementen — jouw eigen systeem.`,
    sections: [
      { h2: 'Sneller dan ooit factureren', text: 'In 30 seconden een factuur opmaken, opslaan, e-mailen en automatisch boeken. Met templates, herhaalfacturen en bulk-acties bespaar je uren administratie per maand.' },
      { h2: 'Automatische betalingsherinneringen', text: 'Onbetaalde factuur? Het systeem stuurt automatisch herinneringen op door jou ingestelde momenten. Klanten kunnen direct online betalen via iDEAL of creditcard.' },
      { h2: 'Boekhoudkoppeling & rapportages', text: 'Alle facturen automatisch in jouw boekhouding. Real-time inzicht in omzet, openstaande posten en debiteuren. Volledig BTW-compliant en geschikt voor de fiscus.' },
    ],
    cta: { text: 'Klaar voor sneller en slimmer factureren?', button: 'Vraag offerte aan' },
  },
  'voorraadbeheer-systeem': {
    title: 'Voorraadbeheer Systeem Laten Maken | Varexo',
    description: 'Voorraadbeheer systeem op maat. Real-time voorraad, barcode scannen, leveranciers en automatische bestellingen. Modern en gebruiksvriendelijk.',
    keywords: 'voorraadbeheer systeem, voorraadsoftware, magazijn software',
    h1: 'Voorraadbeheer Systeem – Volledig Op Maat',
    intro: `Voorraad bijhouden in Excel werkt niet meer. Varexo bouwt voorraadbeheer systemen op maat: real-time voorraad, barcode scanning, leveranciers, bestellingen en rapportages. Voor magazijnen, retail en groothandel.`,
    sections: [
      { h2: 'Real-time voorraad inzicht', text: 'Altijd actuele voorraad, ook bij meerdere locaties of webshops tegelijk. Mutaties direct verwerkt, automatische waarschuwingen bij lage voorraad.' },
      { h2: 'Barcode scanning', text: 'Scan producten met telefoon of barcodescanner voor in/uit-boekingen. Razendsnel inventariseren, geen typfouten meer.' },
      { h2: 'Leveranciers & automatische bestellingen', text: 'Leveranciersbeheer, automatische bestelvoorstellen op basis van voorraadniveau en verkoopsnelheid. Bespaart uren werk per week en voorkomt nee-verkopen.' },
    ],
    cta: { text: 'Klaar voor slim voorraadbeheer?', button: 'Vraag offerte aan' },
  },
  'klantportaal-laten-maken': {
    title: 'Klantportaal Laten Maken | Maatwerk | Varexo',
    description: 'Klantportaal op maat. Klanten loggen in, zien projecten, facturen, documenten en chatten met jou. Modern, veilig en converterend.',
    keywords: 'klantportaal laten maken, customer portal, klantenportaal software',
    h1: 'Klantportaal Laten Maken – Professionele Klantbeleving',
    intro: `Geef jouw klanten een professioneel portaal waar ze projecten, facturen, documenten en berichten kunnen inzien. Varexo bouwt klantportalen op maat — gekoppeld aan jouw systemen, in jouw huisstijl.`,
    sections: [
      { h2: 'Wat kan een klantportaal?', text: 'Klanten loggen in om projecten te volgen, facturen te downloaden, documenten te uploaden, taken te zien en met jou te chatten. Eén centrale plek waar alle communicatie en data samenkomt.' },
      { h2: 'Bespaar tijd & verhoog tevredenheid', text: 'Klanten zien direct hun status zonder jou te bellen. Documenten centraal in plaats van email-chaos. Resultaat: minder support-vragen, snellere processen en blijere klanten.' },
      { h2: 'Veilig & in jouw huisstijl', text: 'Volledig in jouw branding, eigen domein (portaal.jouwbedrijf.nl), sterke beveiliging (2FA, encryptie) en GDPR-compliant. Inclusief koppelingen met jouw bestaande systemen.' },
    ],
    cta: { text: 'Tijd voor een professioneel klantportaal?', button: 'Vraag offerte aan' },
  },
  'api-koppeling-laten-maken': {
    title: 'API Koppeling Laten Maken | Varexo',
    description: 'API koppeling laten maken? Wij verbinden systemen: webshops, boekhouding, CRM, ERP. Snelle, betrouwbare integraties op maat.',
    keywords: 'api koppeling, api integratie, software koppelen, systeem integratie',
    h1: 'API Koppeling Laten Maken – Verbind Jouw Systemen',
    intro: `Jouw webshop, CRM en boekhouding praten niet met elkaar? Varexo bouwt API-koppelingen waarmee data automatisch tussen systemen stroomt. Geen handmatig overtypen meer — jouw business draait soepeler dan ooit.`,
    sections: [
      { h2: 'Wat is een API koppeling?', text: 'Een API (Application Programming Interface) laat verschillende softwaresystemen automatisch met elkaar communiceren. Zo wordt een nieuwe webshop-bestelling direct in je boekhouding én voorraad geboekt — zonder dat jij iets hoeft te doen.' },
      { h2: 'Welke systemen koppelen wij?', text: 'Moneybird, Exact, Snelstart, WooCommerce, Shopify, Magento, Lightspeed, MyParcel, PostNL, Mailchimp, HubSpot, Salesforce — en alles wat een API heeft. Ook custom integraties tussen eigen systemen.' },
      { h2: 'Betrouwbaar, snel en monitorbaar', text: 'Onze koppelingen zijn robuust gebouwd: error handling, retry-mechanismen, logging en monitoring. Faalt een API? Dan weet je het direct en lost de koppeling het automatisch op of stuurt een melding.' },
    ],
    cta: { text: 'Welke systemen wil jij koppelen?', button: 'Plan adviesgesprek' },
  },
  'wordpress-website-laten-maken': {
    title: 'WordPress Website Laten Maken | Varexo',
    description: 'WordPress website laten maken? Varexo bouwt snelle, mooie WordPress sites. Veilig, SEO-vriendelijk en eenvoudig zelf te beheren.',
    keywords: 'wordpress website laten maken, wordpress site, wordpress webdesign',
    h1: 'WordPress Website Laten Maken',
    intro: `Wil je een WordPress website laten maken die snel laadt, goed scoort in Google en eenvoudig zelf te onderhouden is? Varexo bouwt professionele WordPress sites op maat — geen kant-en-klare templates maar custom design dat past bij jouw merk.`,
    sections: [
      { h2: 'Waarom WordPress?', text: 'WordPress is de populairste CMS ter wereld (40% van het internet draait erop). Reden? Eenvoudig zelf te beheren, enorme plugin-bibliotheek en SEO-vriendelijk. Perfect voor blogs, bedrijfssites en webshops (WooCommerce).' },
      { h2: 'Sneller dan standaard WordPress', text: 'Standaard WordPress is vaak traag. Wij optimaliseren voor snelheid: caching, image optimization, lazy loading, CDN en lichtgewicht thema\'s. Resultaat: paginas die binnen 1 seconde laden — Google houdt ervan.' },
      { h2: 'Veilig en up-to-date', text: 'Beveiliging is essentieel. Wij installeren security plugins, regelen automatische updates, dagelijkse backups en SSL-certificaat. Jij hoeft je geen zorgen te maken — wij beheren het.' },
    ],
    cta: { text: 'Klaar voor jouw professionele WordPress site?', button: 'Vraag offerte aan' },
  },
  'react-website-laten-maken': {
    title: 'React Website Laten Maken | Varexo',
    description: 'React website laten maken? Varexo bouwt razendsnelle React websites die perfect scoren op Core Web Vitals en hoog ranken in Google.',
    keywords: 'react website laten maken, react webdesign, react developer nederland',
    h1: 'React Website Laten Maken – Razendsnel & Modern',
    intro: `React is de meest gebruikte JavaScript-library ter wereld (Facebook, Instagram, Netflix). Varexo bouwt razendsnelle React websites en webapps op maat. Resultaat: websites die in milliseconden laden en perfect scoren op Core Web Vitals.`,
    sections: [
      { h2: 'Waarom React?', text: 'React maakt websites razendsnel en interactief. Geen pagina-refresh meer bij navigatie, soepele animaties en componenten die hergebruikt worden. Perfect voor moderne websites, dashboards en webapps.' },
      { h2: 'SEO + React = Next.js', text: 'Standaard React is niet ideaal voor SEO. Daarom gebruiken wij Next.js — een React framework dat server-side rendering toevoegt. Resultaat: een React website die OOK perfect indexeerbaar is door Google.' },
      { h2: 'Wat krijg je?', text: 'Custom design, snelle laadtijden (1-2 seconden), perfecte mobiele weergave, SEO-optimalisatie, hosting op moderne infrastructuur (Vercel/Netlify) en eigen CMS zodat je zelf content kunt aanpassen.' },
    ],
    cta: { text: 'Klaar voor een snelle React website?', button: 'Vraag offerte aan' },
  },
  'nextjs-website-laten-maken': {
    title: 'Next.js Website Laten Maken | Varexo',
    description: 'Next.js website laten maken? Varexo is gespecialiseerd in Next.js. Razendsnel, SEO-perfect en schaalbaar. Vraag offerte aan.',
    keywords: 'nextjs website laten maken, next.js developer, nextjs webdesign',
    h1: 'Next.js Website Laten Maken – De Beste Van Beide Werelden',
    intro: `Next.js combineert het beste van React met server-side rendering — perfect voor moderne, snelle én SEO-vriendelijke websites. Varexo is gespecialiseerd in Next.js development. Wij bouwen alles van marketing-sites tot complete SaaS-platforms.`,
    sections: [
      { h2: 'Waarom Next.js?', text: 'Next.js is gebouwd door Vercel en wordt gebruikt door TikTok, Hulu, Twitch en duizenden andere grote sites. Het levert razendsnelle prestaties, perfecte SEO, automatische image optimization en server-side rendering — alles wat je nodig hebt.' },
      { h2: 'SEO + snelheid + interactiviteit', text: 'Veel frameworks dwingen je tot een keuze: snel óf interactief óf SEO-vriendelijk. Next.js levert alles tegelijk. Resultaat: websites die in 1 seconde laden, perfect scoren op Lighthouse én hoog ranken in Google.' },
      { h2: 'Onze Next.js expertise', text: 'Wij gebruiken Next.js voor zowat al onze projecten. Dynamische routes, API routes, ISR, image optimization, internationalization — wij kennen het allemaal. Plus: hosting op Vercel/Netlify voor edge-snelheid wereldwijd.' },
    ],
    cta: { text: 'Klaar voor de beste website-tech beschikbaar?', button: 'Vraag offerte aan' },
  },
  'webdesign-op-maat': {
    title: 'Webdesign Op Maat | Vanaf €650 | Varexo',
    description: 'Webdesign op maat? Varexo ontwerpt unieke websites die passen bij jouw merk. Geen templates, alleen origineel design. Vanaf €650.',
    keywords: 'webdesign op maat, custom webdesign, uniek webdesign, maatwerk website',
    h1: 'Webdesign Op Maat – Uniek Design Voor Jouw Merk',
    intro: `Geen kant-en-klare templates, maar uniek webdesign dat past bij jouw merk. Varexo ontwerpt websites op maat: vanaf de eerste schets tot de laatste regel code. Zo onderscheid je jezelf écht van de concurrentie.`,
    sections: [
      { h2: 'Wat is webdesign op maat?', text: 'Bij maatwerk webdesign starten wij met een blanco canvas. Geen template, geen pre-made layout. Wij ontwerpen elk element specifiek voor jouw merk: kleuren, typografie, layout, animaties — alles uniek voor jou.' },
      { h2: 'Onderscheid je van de concurrentie', text: 'Templatesites lijken allemaal op elkaar. Met een unieke website val je op, blijven bezoekers langer en bouw je sterker merk-vertrouwen op. Resultaat: hogere conversies en meer klanten.' },
      { h2: 'Inclusief brand strategie', text: 'Voor we ontwerpen, leren wij jouw merk kennen: doelgroep, USP\'s, concurrenten, gewenste uitstraling. Zo wordt het design geen kunstje, maar een strategisch verlengstuk van jouw business.' },
    ],
    cta: { text: 'Klaar voor een unieke website?', button: 'Vraag offerte aan' },
  },
  'seo-optimalisatie': {
    title: 'SEO Optimalisatie | Word Gevonden in Google | Varexo',
    description: 'SEO optimalisatie voor jouw website. Hoger ranken in Google, meer organisch verkeer en meer klanten. Vanaf €89,99 per maand.',
    keywords: 'seo optimalisatie, seo specialist, zoekmachine optimalisatie, google ranking',
    h1: 'SEO Optimalisatie – Word Gevonden In Google',
    intro: `Een mooie website is niet genoeg — je moet ook gevonden worden. Varexo levert SEO optimalisatie die jouw website hoger laat ranken in Google. Meer organisch verkeer, meer leads, meer omzet. Vanaf €89,99 per maand.`,
    sections: [
      { h2: 'Wat is SEO?', text: 'SEO (Search Engine Optimization) is het optimaliseren van jouw website zodat Google deze hoger weergeeft in zoekresultaten. Hoe hoger je rankt op relevante zoekwoorden, hoe meer bezoekers en potentiële klanten je krijgt.' },
      { h2: 'Onze SEO-aanpak', text: 'Technische SEO (snelheid, structured data, mobiele weergave), on-page SEO (content, koppen, meta tags), zoekwoordenanalyse, content strategie en link building. Maandelijkse rapportages tonen jouw vooruitgang in zoekresultaten.' },
      { h2: 'Resultaat binnen 3-6 maanden', text: 'SEO is een marathon, geen sprint. Maar binnen 3-6 maanden zien klanten meestal duidelijke verbeteringen: hogere rankings, meer organisch verkeer en meer aanvragen. Voor langdurige groei en lagere advertentiekosten.' },
    ],
    cta: { text: 'Klaar om hoger in Google te ranken?', button: 'Plan SEO adviesgesprek' },
  },
  'website-laten-bouwen': {
    title: 'Website Laten Bouwen | Vanaf €650 | Varexo',
    description: 'Website laten bouwen? Varexo bouwt jouw professionele website binnen 7 dagen live. Vanaf €650 (actie tot 31 mei). Met garantie op klanten.',
    keywords: 'website laten bouwen, website bouwen, websitebouwer, websitebureau',
    h1: 'Website Laten Bouwen – Snel, Mooi En Professioneel',
    intro: `Op zoek naar een betrouwbare partij om jouw website te laten bouwen? Varexo levert in 7 dagen een complete, professionele website af. Vanaf €650 (normaal €849,99) tot 31 mei. Inclusief design, ontwikkeling, hosting en SEO.`,
    sections: [
      { h2: 'Het complete pakket', text: 'Wij regelen alles: design, ontwikkeling, domein, hosting, SSL-certificaat en eerste maand support. Geen losse partijen of verrassingen — één vaste prijs vanaf €650 voor een volledig werkende website.' },
      { h2: 'Hoe gaat het in zijn werk?', text: 'Stap 1: kennismaking en wensen bespreken. Stap 2: ontwerp en feedback. Stap 3: ontwikkeling en testen. Stap 4: oplevering en livegang. Allemaal binnen 7 werkdagen, met dagelijkse updates over de voortgang.' },
      { h2: 'Wat na de bouw?', text: 'Onze service stopt niet bij de oplevering. Optioneel kun je kiezen voor maandelijks onderhoud, hosting, SEO of doorontwikkeling. Wij blijven jouw partner — voor zo lang jij dat wilt.' },
    ],
    cta: { text: 'Klaar om jouw website te laten bouwen?', button: 'Vraag gratis offerte' },
  },
  'social-media-beheer': {
    title: 'Social Media Beheer | Vanaf €399 | Varexo',
    description: 'Social media beheer door Varexo. Wij verzorgen jouw Instagram, Facebook & LinkedIn. Pakketten vanaf €399/maand met advertenties.',
    keywords: 'social media beheer, social media management, instagram beheer, facebook beheer',
    h1: 'Social Media Beheer – Laat Jouw Bedrijf Groeien Online',
    intro: `Geen tijd voor social media? Wij wel. Varexo verzorgt jouw social media beheer: content creatie, posts plannen, engagement, ads en rapportages. Pakketten vanaf €399 per maand. Resultaat: meer volgers, meer bereik en meer klanten.`,
    sections: [
      { h2: 'Wat doen wij?', text: 'Content creatie (foto, video, design), posts plannen, dagelijkse engagement, hashtag-strategie, advertentiecampagnes, influencer outreach en maandelijkse rapportages. Voor Instagram, Facebook, LinkedIn en TikTok.' },
      { h2: 'Onze pakketten', text: 'Starter (€399/m): 12 posts + ads. Groei (€699/m): 20 posts + uitgebreide ads. Dominant (€999/m): 30 posts + premium ads + community management. Ieder pakket bevat strategie, content en rapportage.' },
      { h2: 'Bewezen resultaten', text: 'Onze klanten zien gemiddeld 200-500% groei in volgers en engagement binnen 3 maanden. Door slimme advertenties en kwalitatieve content zorgen we voor échte business-resultaten — niet alleen vanity metrics.' },
    ],
    cta: { text: 'Klaar om groot te worden op social?', button: 'Bekijk pakketten' },
  },
  'goedkope-website-laten-maken': {
    title: 'Goedkope Website Laten Maken | Vanaf €650 | Varexo',
    description: 'Goedkope website laten maken zonder in te leveren op kwaliteit? Varexo bouwt vanaf €650 een professionele website binnen 7 dagen.',
    keywords: 'goedkope website laten maken, betaalbare website, voordelige website',
    h1: 'Goedkope Website Laten Maken – Professioneel Vanaf €650',
    intro: `Wil je een goedkope website laten maken zonder concessies te doen aan kwaliteit? Varexo levert een complete professionele website vanaf €650 (normaal €849,99) tot 31 mei. Snel, mooi, SEO-geoptimaliseerd. Goedkoop én goed — kan dat? Bij ons wel.`,
    sections: [
      { h2: 'Hoe kunnen wij dit zo goedkoop?', text: 'Door slimme processen, hergebruik van eigen componenten en moderne tech (Next.js) bouwen wij sneller dan traditionele bureaus. Die efficiëntie geven wij door in de prijs. Geen dure tussenstapjes, geen onnodige overhead — wel topkwaliteit.' },
      { h2: 'Wat krijg je voor €650?', text: 'Een complete professionele website met custom design, snelle laadtijden, mobiele weergave, SEO-basis, domein, hosting, SSL en eerste maand support. Geen verborgen kosten — alles inbegrepen.' },
      { h2: 'Pas op met te goedkoop', text: 'Websites onder de €500 zijn vaak templates met slechte prestaties. Onder de €200 is het vaak helemaal scam. Onze prijs van €650 is bewust kostenefficiënt zonder kwaliteitsverlies. Een goede website verdient zichzelf 10x terug.' },
    ],
    cta: { text: 'Goedkoop én professioneel? Ja!', button: 'Vraag offerte aan' },
  },
  'snelle-website-laten-maken': {
    title: 'Snelle Website Laten Maken | Live in 7 Dagen | Varexo',
    description: 'Snelle website laten maken? Varexo levert binnen 7 werkdagen jouw professionele website live. Vanaf €650 met razendsnelle laadtijden.',
    keywords: 'snelle website laten maken, website snel online, snelle webdesign',
    h1: 'Snelle Website Laten Maken – In 7 Dagen Live',
    intro: `Geen tijd te verliezen? Varexo levert binnen 7 werkdagen een complete professionele website. Niet alleen snel opgeleverd, maar ook razendsnel in laadtijd (onder 1 seconde). Vanaf €650 — actie tot 31 mei.`,
    sections: [
      { h2: 'Snelle oplevering', text: 'Hoe? Door geoptimaliseerde processen, vooraf opgemaakte component-libraries en parallel werken in ons team. Dag 1: brief & design. Dag 2-5: ontwikkeling. Dag 6: testen & feedback. Dag 7: live. Geen weken of maanden wachten.' },
      { h2: 'Razendsnelle laadtijden', text: 'Onze websites laden gemiddeld in 0,8 seconden — sneller dan 95% van de websites wereldwijd. Dankzij Next.js, image optimization, edge hosting en lazy loading. Sneller laden = hogere conversie + betere Google ranking.' },
      { h2: 'Snel én goed', text: 'Snel betekent bij ons niet "haastwerk". Wij hebben jaren ervaring en een efficient proces — daarom kunnen wij snel leveren zonder kwaliteitsverlies. Garantie op nieuwe klanten inbegrepen.' },
    ],
    cta: { text: 'Klaar voor jouw nieuwe website binnen 7 dagen?', button: 'Start mijn project' },
  },
  'professionele-website-laten-maken': {
    title: 'Professionele Website Laten Maken | Vanaf €650 | Varexo',
    description: 'Professionele website laten maken? Varexo bouwt converterende, snelle en mooie websites. Live binnen 7 dagen, vanaf €650 met garantie.',
    keywords: 'professionele website laten maken, professionele webdesign, zakelijke website',
    h1: 'Professionele Website Laten Maken',
    intro: `Een professionele website is geen luxe meer, maar essentieel. Varexo bouwt websites die uitstralen wat jouw bedrijf vertegenwoordigt: kwaliteit, betrouwbaarheid en groei. Vanaf €650 (actie tot 31 mei), binnen 7 dagen live, met garantie op nieuwe klanten.`,
    sections: [
      { h2: 'Wat maakt een website "professioneel"?', text: 'Een professionele website heeft strakke design, snelle laadtijden, foutloze werking op alle apparaten, sterke teksten en heldere CTA\'s. Het wekt direct vertrouwen bij bezoekers — wat essentieel is voor conversie. Wij leveren al deze elementen standaard.' },
      { h2: 'Brand consistency', text: 'Jouw website moet aansluiten op jouw huisstijl: logo, kleuren, lettertype, tone of voice. Wij zorgen dat deze elementen overal consistent zijn. Geen losse onderdelen die niet bij elkaar passen — wel een geïntegreerd merk-ervaring.' },
      { h2: 'Resultaatgericht ontwerp', text: 'Mooi is leuk, maar de website moet ook resultaat opleveren. Daarom ontwerpen wij conversiegericht: heldere navigatie, sterke CTA\'s, sociale bewijzen (reviews, klantcases), formulieren die werken en SEO die ervoor zorgt dat je gevonden wordt.' },
    ],
    cta: { text: 'Klaar voor jouw professionele website?', button: 'Vraag gratis offerte' },
  },
  'website-laten-maken-prijzen': {
    title: 'Website Laten Maken Prijzen | Vanaf €650 | Varexo',
    description: 'Wat kost een website laten maken? Bekijk onze transparante prijzen. Vanaf €650 voor complete professionele website. Geen verborgen kosten.',
    keywords: 'website laten maken prijzen, kosten website, website prijs, website tarieven',
    h1: 'Website Laten Maken Prijzen – Transparant & Eerlijk',
    intro: `Wat kost een website laten maken in 2026? Varexo werkt met heldere, transparante prijzen vanaf €650. Geen verborgen kosten, geen verrassingen achteraf — wel een complete professionele website binnen 7 dagen live.`,
    sections: [
      { h2: 'Onze prijspakketten', text: 'Basic (€650): 1-pager voor ZZP/freelancer. Pro (€849): tot 10 pagina\'s, ideaal voor MKB. Premium (€1499): uitgebreide site met blog, klantenportaal of webshop. Ieder pakket inclusief design, ontwikkeling, hosting (eerste jaar) en SSL.' },
      { h2: 'Wat zit er in de prijs?', text: 'Custom design op maat van jouw merk, professionele ontwikkeling met React/Next.js, mobiel-vriendelijk, SEO-basis, eigen domein, hosting & SSL eerste jaar gratis, eerste maand support. Geen losse facturen voor essentiele onderdelen.' },
      { h2: 'Optionele extra\'s', text: 'Email hosting €9,99/m, onderhoud & backups €39,99/m, SEO €89,99/m, logo & huisstijl €199 eenmalig. Alles transparant gepriced — jij kiest wat je nodig hebt. Geen "advies" om dingen te kopen die je niet nodig hebt.' },
    ],
    cta: { text: 'Bekijk alle prijzen of vraag offerte', button: 'Bekijk prijzen' },
  },
  'wat-kost-een-website': {
    title: 'Wat Kost Een Website Laten Maken? | Varexo',
    description: 'Wat kost een website laten maken? Eerlijk antwoord: vanaf €650 voor een professionele website. Lees alles over website prijzen in 2026.',
    keywords: 'wat kost een website, website prijs, kosten website, website laten maken kosten',
    h1: 'Wat Kost Een Website Laten Maken In 2026?',
    intro: `"Wat kost een website?" is een veelgestelde vraag — en het eerlijke antwoord is: het hangt af van wat je nodig hebt. Bij Varexo starten complete professionele websites vanaf €650. In dit artikel leggen wij uit waar de prijs van afhangt.`,
    sections: [
      { h2: 'Prijsranges in Nederland', text: 'Goedkope template-sites: €100-€400 (vaak slechte kwaliteit). Standaard professionele sites: €650-€2000. Uitgebreide custom sites: €2000-€10.000. Enterprise platforms: €10.000+. Bij Varexo zit je in de tweede categorie — top kwaliteit voor scherpe prijs.' },
      { h2: 'Waar zit je geld in?', text: '70% gaat naar ontwikkeltijd (design, code, testen). 15% naar tools (hosting, plugins). 15% naar service (support, projectmanagement). Hoe complexer de site, hoe meer ontwikkelingstijd, hoe hoger de prijs. Logisch.' },
      { h2: 'Maandelijkse kosten', text: 'Naast eenmalige bouwkosten zijn er optionele maandelijkse kosten: hosting (€10-30/m), onderhoud (€39,99/m bij ons), SEO (€89,99/m). Email hosting €9,99/m. Allemaal optioneel — jij beslist wat je afneemt.' },
    ],
    cta: { text: 'Wil je een precieze offerte? Vraag aan!', button: 'Vraag offerte aan' },
  },

  // === NICHE PAGES ===
  'website-laten-maken-zzp': niche(
    'ZZP\'ers',
    'ZZP\'er',
    'snelle, professionele websites die direct vertrouwen wekken bij potentiële klanten.',
    'Klanten zoeken bij een ZZP\'er vooral naar duidelijkheid, contactgegevens en social proof.',
    'Voor ZZP\'ers maken wij heldere 1-pagers met portfolio, prijslijst, getuigenissen en contactformulier — alles wat je nodig hebt om als zelfstandige professioneel over te komen.'
  ),
  'website-laten-maken-mkb': niche(
    'MKB',
    'MKB-bedrijf',
    'schaalbare websites die meegroeien met jouw bedrijf en multiple diensten/producten goed presenteren.',
    'MKB-websites moeten meerdere diensten, vestigingen of teamleden goed presenteren én vertrouwen wekken.',
    'Voor MKB-bedrijven bouwen wij websites met dienstpagina\'s, team-secties, klantcases, blog (voor SEO) en uitgebreide contactopties.'
  ),
  'website-laten-maken-restaurant': niche(
    'Restaurants',
    'restaurant',
    'sfeervolle websites met menu, reserveringen en sfeerfoto\'s die hongerig maken.',
    'Een restaurantwebsite moet de sfeer ademen, het menu makkelijk laten bekijken én reserveringen mogelijk maken.',
    'Wij bouwen restaurantwebsites met online reserveringssysteem, foto-galerie, menu (PDF of interactief), Google Maps integratie en social media koppeling.'
  ),
  'website-laten-maken-kapper': niche(
    'Kappers',
    'kapper',
    'stijlvolle websites met online afspraken, prijslijst en portfolio.',
    'Klanten willen online een afspraak kunnen maken, prijzen zien en kapsels bekijken.',
    'Wij bouwen kapper-websites met online afsprakensysteem, prijslijst, kapsel-portfolio en review-integratie. Plus Google Maps voor de routebeschrijving.'
  ),
  'website-laten-maken-garage': niche(
    'Garages & Autobedrijven',
    'autogarage',
    'duidelijke websites met diensten, occasions en online afspraken.',
    'Klanten zoeken bij een garage naar diensten, prijzen voor APK/onderhoud en eventueel occasions.',
    'Voor garages bouwen wij websites met dienstoverzicht (APK, onderhoud, banden), occasion-overzicht met filters, online afspraakformulier en contactgegevens.'
  ),
  'website-laten-maken-fysiotherapeut': niche(
    'Fysiotherapeuten',
    'fysiotherapeut',
    'professionele websites die vertrouwen wekken en eenvoudig afspraken inplannen.',
    'Patiënten willen weten welke behandelingen je biedt, ervaringen lezen en eenvoudig een afspraak maken.',
    'Wij bouwen fysio-websites met behandelingoverzicht, team-sectie, online afsprakensysteem, vergoedingsinfo zorgverzekeraars en patiëntervaringen.'
  ),
  'website-laten-maken-tandarts': niche(
    'Tandartsen',
    'tandarts',
    'rustige, professionele websites die angstige patiënten geruststellen.',
    'Tandarts-patiënten zoeken vertrouwen, duidelijkheid over behandelingen en eenvoudig contact.',
    'Voor tandartsen bouwen wij rustig vormgegeven sites met behandeloverzicht, team, openingstijden, online afspraken en informatie voor angstige patiënten.'
  ),
  'website-laten-maken-advocaat': niche(
    'Advocaten',
    'advocaat',
    'serieuze, professionele websites die expertise uitstralen.',
    'Cliënten zoeken bij een advocatenkantoor naar expertise, ervaring en betrouwbaarheid.',
    'Voor advocaten bouwen wij sites met rechtsgebieden, advocatenprofielen, klantcases, blog (voor expertise + SEO) en contactformulier voor vertrouwelijke aanvragen.'
  ),
  'website-laten-maken-accountant': niche(
    'Accountants',
    'accountant',
    'betrouwbare websites die expertise en zekerheid uitstralen.',
    'Klanten zoeken bij een accountant betrouwbaarheid, expertise en duidelijke prijzen.',
    'Wij bouwen accountantssites met dienstoverzicht (boekhouding, BTW, jaarrekening), team-sectie, klantcases en eenvoudig contactformulier voor offerte-aanvragen.'
  ),
  'website-laten-maken-makelaar': niche(
    'Makelaars',
    'makelaar',
    'mooie websites met woningoverzicht, zoekfilters en aanvraagformulier.',
    'Een makelaarswebsite moet woningen mooi presenteren én eenvoudig contact mogelijk maken.',
    'Wij bouwen makelaarssites met aanbod (gekoppeld aan Funda/Realworks), zoekfilters, taxatie-aanvraag en team-sectie. Modern design dat woningen prachtig laat zien.'
  ),
  'website-laten-maken-coach': niche(
    'Coaches',
    'coach',
    'persoonlijke websites die jouw verhaal vertellen en sessies online verkopen.',
    'Coaches verkopen vooral hun persoonlijkheid en methodiek — de website moet dat sterk overbrengen.',
    'Wij bouwen coach-websites met sterk persoonlijk verhaal, programma-overzicht, getuigenissen, blog (voor expertise) en online boeken/betalen voor sessies.'
  ),
  'website-laten-maken-bouwbedrijf': niche(
    'Bouwbedrijven',
    'bouwbedrijf',
    'sterke websites met portfolio van projecten, diensten en offerte-aanvraag.',
    'Klanten zoeken bij een bouwbedrijf naar referentieprojecten, diensten en betrouwbaarheid.',
    'Voor bouwbedrijven bouwen wij sites met project-portfolio (foto/video), dienstenoverzicht, team, en offerte-aanvraagformulier. Met Google reviews voor sociale bewijzen.'
  ),
  'website-laten-maken-schoonmaakbedrijf': niche(
    'Schoonmaakbedrijven',
    'schoonmaakbedrijf',
    'duidelijke websites met diensten, regio\'s en eenvoudig offerte aanvragen.',
    'Klanten kiezen vaak op prijs en betrouwbaarheid — de site moet beide direct laten zien.',
    'Voor schoonmaakbedrijven bouwen wij sites met dienstoverzicht (kantoor, particulier, glaszemen), regio-overzicht, getuigenissen en snel offerte-formulier.'
  ),
  'website-laten-maken-transportbedrijf': niche(
    'Transportbedrijven',
    'transportbedrijf',
    'professionele websites met diensten, wagenpark en aanvraagsysteem.',
    'Klanten zoeken bij transport naar capaciteit, regio\'s, diensten en prijzen.',
    'Voor transportbedrijven bouwen wij sites met dienstoverzicht (nationaal/internationaal), wagenpark-overzicht, certificeringen en offerte-aanvraagformulier met track & trace optie.'
  ),
  'webshop-laten-maken-kleding': {
    title: 'Webshop Laten Maken Kleding | Vanaf €650 | Varexo',
    description: 'Kledingwebshop laten maken? Varexo bouwt mooie, snelle en converterende fashion webshops. Met betalingen, voorraad en verzending.',
    keywords: 'webshop laten maken kleding, kledingwebshop, fashion webshop, kledingwinkel online',
    h1: 'Kledingwebshop Laten Maken – Modern, Snel En Converterend',
    intro: `Eigen kledingmerk of fashion store online? Varexo bouwt razendsnelle, mooie kledingwebshops met focus op visuele beleving en hoge conversie. Vanaf €650, binnen 14 dagen live, inclusief alle e-commerce functionaliteiten.`,
    sections: [
      { h2: 'Beeldend en visueel sterk', text: 'In fashion draait alles om visuele aantrekkingskracht. Wij optimaliseren productfoto\'s (zoom, 360°, video\'s), gebruiken stijlvolle layouts en zorgen dat jouw collectie shines. Mobiel-first, want 70% van fashion-shoppers koopt via telefoon.' },
      { h2: 'Functies voor fashion', text: 'Maattabellen, kleur/maat-varianten, stylistsuggesties, look-builders, wishlist, snelle checkout, retour-portaal, klantbeoordelingen. Plus integratie met Instagram shopping voor sociale verkoop.' },
      { h2: 'Voorraad, betaling & verzending', text: 'Volledige voorraadbeheer (per kleur/maat), iDEAL/PayPal/Klarna betalingen, automatische verzendlabels (PostNL, DHL), retourbeheer en BTW-correct factureren. Alles geïntegreerd zodat jij focust op verkopen.' },
    ],
    cta: { text: 'Klaar om jouw fashion merk online te lanceren?', button: 'Vraag offerte aan' },
  },
};

