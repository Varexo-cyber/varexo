# IMPLEMENTATIE CHECKLIST - Mollie Incasso

## ✅ WAT IS KLAAR:
- [x] Database schema (database-neon-schema.sql)
- [x] API endpoints (src/api/payments-neon.js)
- [x] Mollie service (src/services/mollieService.ts)
- [x] Environment variables (.env)
- [x] SEPA Mandate knop (src/components/SepaMandateButton.tsx)
- [x] Admin Incasso knop (src/components/AdminIncassoButton.tsx)
- [x] Gitignore beveiligd

## 🔧 WAT JIJ NOG MOET DOEN:

### 1. NeonSQL Database aanmaken (5 min)
- [ ] Ga naar https://neon.tech
- [ ] Maak account aan
- [ ] Create project "varexo"
- [ ] Kopieer connection string
- [ ] Open SQL Editor
- [ ] Plak inhoud van `database-neon-schema.sql`
- [ ] Klik "Run"

### 2. Dependencies installeren (2 min)
```bash
cd c:\Users\moham\CascadeProjects\windsurf-project\varexo
npm install pg @mollie/api-client bcrypt jsonwebtoken
```

### 3. Environment check (1 min)
- [ ] Controleer of `.env` bestaat
- [ ] Check of MOLLIE_API_KEY gevuld is
- [ ] Check of DATABASE_URL gevuld is

### 4. Components gebruiken in bestaande pages

#### In Dashboard.tsx (klant portaal):
```tsx
import SepaMandateButton from '../components/SepaMandateButton';

// Voeg toe waar je wilt:
<SepaMandateButton 
  customerEmail={user.email}
  hasMandate={user.sepaMandateStatus === 'valid'}
/>
```

#### In Admin.tsx (admin portaal):
```tsx
import AdminIncassoButton from '../components/AdminIncassoButton';

// Voeg toe bij klant rij:
<AdminIncassoButton
  customerEmail={customer.email}
  customerName={customer.displayName}
  hasMandate={customer.sepaMandateStatus === 'valid'}
  amount={invoice.amount}
  onSuccess={() => refreshData()}
/>
```

### 5. Backend starten (voor local test)
```bash
# Nieuw terminal venster
node src/api/payments-neon.js
```

### 6. Testen
- [ ] Klant logt in
- [ ] Klant klikt "SEPA Mandaat instellen"
- [ ] iDEAL betaling (€0,01)
- [ ] Admin ziet "mandaat actief"
- [ ] Admin klikt "Incasseren"
- [ ] Geld wordt afgeschreven

## 🚀 DEPLOY NAAR LIVE

### Netlify (voor de frontend):
```bash
npm run build
netlify deploy --prod
```

### Backend (Netlify Functions):
- [ ] Zet API files in `netlify/functions/`
- [ ] Environment variables toevoegen in Netlify dashboard

## ⚠️ BELANGRIJK

- **LIVE API KEY = echte betalingen!**
- Test eerst met €0,01
- Mollie kosten: €0,25 iDEAL, €0,15 SEPA
- Webhook is optioneel (kan later)

## 🆘 PROBLEMEN?

| Probleem | Oplossing |
|----------|-----------|
| Database werkt niet | Check of SSL in DATABASE_URL staat |
| Mollie error | Check of API key correct is |
| CORS error | Backend moet opzelfde domein draaien |

## 📞 CONTACT
Mollie support: info@mollie.com
NeonSQL docs: https://neon.tech/docs
