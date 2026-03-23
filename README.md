# Varexo Website

Een complete website voor Varexo - ICT- en webdevelopment bedrijf met klantportaal.

## Project Overzicht

Varexo is een professionele website gebouwd met React, TypeScript en TailwindCSS. De website omvat:

- **Public Pages**: Home, Over ons, Diensten, Portfolio, Prijzen, Werkwijze, Contact
- **Legal Pages**: Privacy Policy, Algemene Voorwaarden, Cookie Policy
- **Customer Portal**: Beveiligd login systeem met Firebase
- **Admin Dashboard**: Project status, facturen, en berichten
- **Contact Forms**: Functionele contactformulieren met Firestore integratie

## Features

### 🏠 Public Website
- Modern en responsive design
- Professionele uitstraling met TailwindCSS
- SEO-vriendelijke structuur
- Mobiel-vriendelijk

### 🔐 Customer Portal
- Firebase authenticatie
- Beveiligde toegang voor klanten
- Project status tracking
- Factuur beheer
- Berichten systeem

### 📝 Contact System
- Contactformulier met Firestore integratie
- Offerte aanvragen
- Automatische bevestigingen
- Error handling

### ⚖️ Legal Compliance
- AVG/GDPR compliant privacy policy
- Algemene voorwaarden
- Cookie policy
- Cookie toestemming systeem

## Tech Stack

- **Frontend**: React 18, TypeScript
- **Styling**: TailwindCSS
- **Backend**: Firebase (Authentication, Firestore)
- **Routing**: React Router
- **Icons**: Heroicons
- **UI Components**: Headless UI

## Setup Instructions

### 1. Prerequisites
Zorg ervoor dat je Node.js (v16+) en npm geïnstalleerd hebt.

### 2. Firebase Setup
1. Maak een nieuw Firebase project op [Firebase Console](https://console.firebase.google.com/)
2. Activeer Authentication (Email/Password)
3. Maak een Firestore database
4. Kopieer je Firebase configuratie

### 3. Environment Setup
Maak een `.env` bestand in de root van het project:

```env
REACT_APP_FIREBASE_API_KEY=jouw-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=jouw-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=jouw-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=jouw-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=jouw-sender-id
REACT_APP_FIREBASE_APP_ID=jouw-app-id
```

Update `src/firebase.ts` met je Firebase configuratie:

```typescript
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};
```

### 4. Install Dependencies
```bash
npm install
```

### 5. Start Development Server
```bash
npm start
```

De website zal beschikbaar zijn op [http://localhost:3000](http://localhost:3000)

## Project Structuur

```
src/
├── components/          # Reusable components
│   ├── Header.tsx
│   └── Footer.tsx
├── pages/              # Page components
│   ├── Home.tsx
│   ├── OverOns.tsx
│   ├── Diensten.tsx
│   ├── Portfolio.tsx
│   ├── Prijzen.tsx
│   ├── Werkwijze.tsx
│   ├── Contact.tsx
│   ├── Login.tsx
│   ├── Dashboard.tsx
│   ├── PrivacyPolicy.tsx
│   ├── AlgemeneVoorwaarden.tsx
│   └── CookiePolicy.tsx
├── services/           # Business logic
│   └── contactService.ts
├── firebase.ts         # Firebase configuration
├── App.tsx             # Main app component
└── index.css           # Global styles
```

## Firestore Database Structuur

### Collections
- `contacts` - Contactformulier submissions
- `quotes` - Offerte aanvragen
- `users` - Gebruiker data (indien nodig)
- `projects` - Project informatie
- `invoices` - Factuur data

### Security Rules
Voeg de volgende Firestore security rules toe:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Contact forms - anyone can write, only authenticated can read
    match /contacts/{documentId} {
      allow create: if true;
      allow read, update, delete: if request.auth != null;
    }
    
    // Quotes - anyone can write, only authenticated can read
    match /quotes/{documentId} {
      allow create: if true;
      allow read, update, delete: if request.auth != null;
    }
    
    // User specific data - only authenticated users can access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Deployment

### Build voor Productie
```bash
npm run build
```

### Deployment Opties
- **Firebase Hosting**: `firebase deploy`
- **Vercel**: Importeer project naar Vercel
- **Netlify**: Upload build folder
- **Eigen hosting**: Upload build folder naar je server

## Demo Gebruikers

Voor het klantportaal kun je de volgende demo credentials gebruiken:
- Email: `demo@varexo.nl`
- Wachtwoord: `demo123`

## Aanpassingen

### Bedrijfsinformatie
Update de volgende bestanden met jouw bedrijfsinformatie:
- `src/components/Footer.tsx` - Contactgegevens
- `src/pages/OverOns.tsx` - Bedrijfsprofiel
- Legal pages - KvK en BTW nummers

### Styling
Pas de kleuren en styling aan in:
- `tailwind.config.js` - Tailwind configuratie
- Component bestanden - Specifieke styling

### Firebase Rules
Update Firestore en Firebase Authentication rules naar jouw behoeften.

## Support

Voor vragen of ondersteuning:
- Email: info@varexo.nl
- Website: www.varexo.nl

## License

Dit project is eigendom van Varexo. Alle rechten voorbehouden.
