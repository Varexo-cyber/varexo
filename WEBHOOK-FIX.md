# WEBHOOK FIX - stap voor stap

## STAP 1: API Key check
1. In je foto zie je 2 API keys
2. Klik op de **BOVENSTE** (Livemodus - oranje label)
3. Check of daar staat:
   - ✅ `payments.read`
   - ✅ `payments.write`

## STAP 2: Webhook aanmaken via cURL

**Open PowerShell/Terminal en run:**

```bash
curl -X POST https://api.mollie.com/v2/webhooks \
  -H "Authorization: Bearer live_your_key_here" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://varexo.nl/api/webhooks/mollie",
    "description": "Varexo payments"
  }'
```

**Vervang `live_your_key_here` met je echte key!**

## STAP 3: Check of het werkte

```bash
curl -X GET https://api.mollie.com/v2/webhooks \
  -H "Authorization: Bearer live_your_key_here"
```

## STAP 4: Als het niet werkt

**Plan B - Webhook overslaan in code:**

In `src/api/payments-neon.js` vervang de webhook handler door polling:

```javascript
// HANDMATIGE CHECK (als webhook niet werkt)
router.get('/check-payment/:paymentId', async (req, res) => {
  try {
    const payment = await mollieService.getPayment(req.params.paymentId);
    
    // Update database handmatig
    await pool.query(
      'UPDATE payments SET status = $1 WHERE mollie_payment_id = $2',
      [payment.status, req.params.paymentId]
    );
    
    res.json({ status: payment.status });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

Dan roept de klant elke 5 sec deze URL aan om status te checken.

## STAP 5: Mollie contact

Als het echt niet werkt:
- Email: info@mollie.com
- Zeg: "Payments API ontbreekt in webhook event types"
- Vermeld je org ID: org_19510779

## Snelle vraag:

Wil je dat ik:
- **A**: De polling versie bouw (werkt zonder webhook)
- **B**: Wacht op de cURL oplossing
- **C**: Je Mollie API key gebruik om het te testen (geef me de key)

Wat kies je? 🚀
