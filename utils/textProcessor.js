const ARABIC_CHARACTERS = /[اأإآءؤئبتثجحخدذرزسشصضطظعغفقكلمنهوية٠-٩]/;

const removeFormatting = (text = '') =>
  text.replace(/\r\n/g, '\n').replace(/\s+/g, ' ').trim();

const splitIntoChunks = (text = '', maxLength = 2000) => {
  if (!text) return [];
  const sanitized = removeFormatting(text);
  const chunks = [];
  for (let i = 0; i < sanitized.length; i += maxLength) {
    chunks.push(sanitized.slice(i, i + maxLength));
  }
  return chunks;
};

const normalizeArabic = (text = '') =>
  text
    .replace(/أ|إ|آ/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/ؤ/g, 'و')
    .replace(/ئ/g, 'ي');

const detectLanguage = (text = '') => (ARABIC_CHARACTERS.test(text) ? 'ar' : 'other');

module.exports = {
  removeFormatting,
  splitIntoChunks,
  normalizeArabic,
  detectLanguage,
};

