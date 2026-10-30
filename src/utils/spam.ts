// Mirror of netlify/functions/utils/spam.js, used to hide spam in the admin panel

// Random strings like "NehhDvmiOZKQNESp" or "oANgyIgXdHPwTMBmVpcKPYSK"
export function looksRandom(value: any): boolean {
  const s = String(value || '').trim();
  if (s.length < 8 || /\s/.test(s)) return false;
  if (!/^[A-Za-z]+$/.test(s)) return false;
  let switches = 0;
  for (let i = 1; i < s.length; i++) {
    const a = s[i - 1], b = s[i];
    if ((a === a.toUpperCase()) !== (b === b.toUpperCase())) switches++;
  }
  const upperInside = (s.slice(1).match(/[A-Z]/g) || []).length;
  const vowels = (s.match(/[aeiouAEIOU]/g) || []).length / s.length;
  return switches / s.length > 0.3 || upperInside >= 4 || vowels < 0.2;
}

const PITCH_PATTERNS = [
  /i (had|took) a (look|quick look) at your (website|site)/i,
  /noticed (a few|some|several) (issues|errors|problems)/i,
  /(isn'?t|not) (fully )?(responsive|mobile[- ]friendly)/i,
  /payment gateway/i,
  /(free|complimentary) (demo|audit|mockup|redesign|seo)/i,
  /mobile app concept/i,
  /first page of google|top (of|on) google|rank(ing)? (higher|#?1)/i,
  /\b(backlinks?|guest post|link building|domain authority)\b/i,
  /seo (services|expert|optimization).*(implement|help|improve)/i,
  /losing (potential )?(customers|patients|clients|sales)/i,
  /would you like (to see|me to send)/i,
  /\b(crypto|bitcoin|forex|casino|viagra|loan offer)\b/i,
  /white ?label|outsourc(e|ing) (partner|team)/i,
  /(hire|offshore) (developers?|team)/i,
];

export function detectSpam({ naam, email, bericht, bedrijf, telefoon }: { naam?: string; email?: string; bericht?: string; bedrijf?: string; telefoon?: string } = {}) {
  const reasons: string[] = [];
  let score = 0;

  if (looksRandom(naam)) { score += 3; reasons.push('random naam'); }
  if (looksRandom(bericht)) { score += 3; reasons.push('random bericht'); }
  if (looksRandom(bedrijf)) { score += 2; reasons.push('random bedrijf'); }

  const local = String(email || '').split('@')[0];
  if ((local.match(/\./g) || []).length >= 3) { score += 2; reasons.push('verdacht e-mailadres'); }

  const text = String(bericht || '');
  const hits = PITCH_PATTERNS.filter((re) => re.test(text)).length;
  if (hits) { score += hits * 2; reasons.push(`${hits} verkoop/spam-zin(nen)`); }

  const links = (text.match(/https?:\/\//g) || []).length;
  if (links >= 3) { score += 2; reasons.push('veel links'); }

  const phone = String(telefoon || '').replace(/\D/g, '');
  if (phone && looksRandom(naam) && !/^(0|31|32|44)/.test(phone)) score += 1;

  return { spam: score >= 4, score, reasons };
}

