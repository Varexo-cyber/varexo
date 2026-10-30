const crypto = require('crypto');

// Format: scrypt$<salt hex>$<hash hex>
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(String(password), salt, 64).toString('hex');
  return `scrypt$${salt}$${hash}`;
}

// Supports legacy plaintext values so existing accounts keep working
function verifyPassword(password, stored) {
  if (!stored) return false;
  if (!stored.startsWith('scrypt$')) {
    const a = Buffer.from(String(password));
    const b = Buffer.from(String(stored));
    return a.length === b.length && crypto.timingSafeEqual(a, b);
  }
  const [, salt, hash] = stored.split('$');
  const expected = Buffer.from(hash, 'hex');
  const actual = crypto.scryptSync(String(password), salt, expected.length);
  return crypto.timingSafeEqual(actual, expected);
}

const isLegacy = (stored) => !!stored && !stored.startsWith('scrypt$');

module.exports = { hashPassword, verifyPassword, isLegacy };
