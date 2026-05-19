# Mollie + NeonSQL Setup Guide

## STAP 1: NeonSQL Database

1. Ga naar [neon.tech](https://neon.tech)
2. Maak account aan
3. Create new project → naam: "varexo"
4. Kopieer de **Connection String** (bij "Connection Details")
5. Die ziet er zo uit: `postgresql://varexo_owner:xxx@ep-xxx.eu-central-1.aws.neon.tech/varexo?sslmode=require`

## STAP 2: Database schema importeren

1. Ga naar NeonSQL dashboard → SQL Editor
2. Plak de inhoud van `database-neon-schema.sql`
3. Click "Run"

## STAP 3: .env bestand aanmaken

Maak bestand: `varexo/.env`

```env
# NeonSQL (jouw connection string)
DATABASE_URL=postgresql://varexo_owner:xxx@ep-xxx.eu-central-1.aws.neon.tech/varexo?sslmode=require

# Mollie (jouw LIVE key)
MOLLIE_API_KEY=live_xxxxxxxxxxxx

# JWT Secret (maak zelf, minimaal 32 karakters)
JWT_SECRET=varexo_super_geheime_sleutel_2024!

# Webhook URL (pas aan na deploy)
WEBHOOK_URL=https://varexo.nl/api/webhooks/mollie
FRONTEND_URL=https://varexo.nl

# Server port
PORT=3001
```

## STAP 4: Mollie Webhook instellen

1. Ga naar [my.mollie.com](https://my.mollie.com)
2. Developers → Webhooks
3. Add webhook:
   - **URL**: `https://varexo.nl/api/webhooks/mollie`
   - **Description**: `Varexo betalingen`

## STAP 5: Dependencies installeren

```bash
npm install pg @mollie/api-client bcrypt jsonwebtoken
```

## STAP 6: Backend starten (lokaal testen)

```bash
# In je varexo map
node src/api/payments-neon.js
```

## Wat werkt dan?

- ✅ Klanten kunnen SEPA mandaat geven via iDEAL
- ✅ Admin kan handmatig incasseren
- ✅ Automatische webhook updates
- ✅ Dashboard met stats

## Belangrijk!

- **Test eerst** met kleine bedragen (€0,01)
- **Mollie kosten**: €0,25 per iDEAL, €0,15 per SEPA incasso
- **Webhook moet** werken voor live site (gebruik ngrok voor local testing)

## Troubleshooting

**Database connectie werkt niet?**
- Check of je `sslmode=require` hebt in DATABASE_URL
- Check of NeonSQL project "Active" is

**Webhook werkt niet?**
- Test met: `curl -X POST https://varexo.nl/api/webhooks/mollie`
- Check Mollie dashboard → Logs

**Incasso werkt niet?**
- Check of klant `sepa_mandate_status = 'valid'` heeft
- Check Mollie → Customers → Mandates
