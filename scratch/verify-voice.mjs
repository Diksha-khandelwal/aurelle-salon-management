// Verification script for Token Pronunciation and Business Rules
const GUJARATI_DIGITS = {
  '0': 'શૂન્ય',
  '1': 'એક',
  '2': 'બે',
  '3': 'ત્રણ',
  '4': 'ચાર',
  '5': 'પાંચ',
  '6': 'છ',
  '7': 'સાત',
  '8': 'આઠ',
  '9': 'નવ',
};

const ENGLISH_DIGITS = {
  '0': 'zero',
  '1': 'one',
  '2': 'two',
  '3': 'three',
  '4': 'four',
  '5': 'five',
  '6': 'six',
  '7': 'seven',
  '8': 'eight',
  '9': 'nine',
};

const GUJARATI_NUMBERS = {
  1: 'એક',
  2: 'બે',
  3: 'ત્રણ',
  4: 'ચાર',
  5: 'પાંચ',
  6: 'છ',
  7: 'સાત',
  8: 'આઠ',
};

const ENGLISH_NUMBERS = {
  1: 'One',
  2: 'Two',
  3: 'Three',
  4: 'Four',
  5: 'Five',
  6: 'Six',
  7: 'Seven',
  8: 'Eight',
};

function formatTokenPronunciation(tokenNumber) {
  const clean = tokenNumber.replace(/\s+/g, '');
  const match = clean.match(/^([A-Za-z]+)[-_]?(\d+)$/);

  if (match) {
    const letter = match[1].toUpperCase();
    const numString = match[2];

    const digitsEn = numString
      .split('')
      .map((d) => ENGLISH_DIGITS[d] || d)
      .join(' ');

    const digitsGu = numString
      .split('')
      .map((d) => GUJARATI_DIGITS[d] || d)
      .join(' ');

    return { letter, digitsEn, digitsGu };
  }
  return { letter: tokenNumber, digitsEn: tokenNumber, digitsGu: tokenNumber };
}

function generateSpeechText(tokenNumber, chairNumber, lang) {
  const { letter, digitsEn, digitsGu } = formatTokenPronunciation(tokenNumber);

  if (lang === 'gu') {
    const chairNameGu = GUJARATI_NUMBERS[chairNumber] || String(chairNumber);
    return `ટોકન ${letter} ${digitsGu}, કૃપા કરીને ચેર ${chairNameGu} પર આવો.`;
  }
  const chairNameEn = ENGLISH_NUMBERS[chairNumber] || String(chairNumber);
  return `Token ${letter}, ${digitsEn}. Please proceed to Chair ${chairNameEn}.`;
}

console.log('--- TEST 1: Token A-115 English ---');
console.log(generateSpeechText('A-115', 1, 'en'));

console.log('--- TEST 2: Token B-008 English (Preserving Leading Zeros) ---');
console.log(generateSpeechText('B-008', 3, 'en'));

console.log('--- TEST 3: Token A-115 Gujarati ---');
console.log(generateSpeechText('A-115', 1, 'gu'));

console.log('--- TEST 4: Token B-008 Gujarati ---');
console.log(generateSpeechText('B-008', 3, 'gu'));

// Assertions
const t1 = generateSpeechText('A-115', 1, 'en');
const t2 = generateSpeechText('B-008', 3, 'en');
const t3 = generateSpeechText('A-115', 1, 'gu');

if (!t1.includes('one one five') || !t1.includes('Chair One')) {
  throw new Error('A-115 English pronunciation failed');
}
if (!t2.includes('zero zero eight') || !t2.includes('Chair Three')) {
  throw new Error('B-008 leading zeros English pronunciation failed');
}
if (!t3.includes('એક એક પાંચ') || !t3.includes('ચેર એક')) {
  throw new Error('A-115 Gujarati pronunciation failed');
}

console.log('\nAll Voice Pronunciation Tests PASSED perfectly!');
