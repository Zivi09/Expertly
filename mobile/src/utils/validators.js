export function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim());
}

export function isTenDigitPhone(value) {
  const digits = String(value || '').replace(/\D/g, '');
  return digits.length === 10;
}

export function normalizePhone(value) {
  return String(value || '').replace(/\D/g, '').slice(0, 10);
}
