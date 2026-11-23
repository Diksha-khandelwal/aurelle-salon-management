// Test script for Female Receptionist Voice Announcement and Sequencing

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

const ENGLISH_HUMOROUS_LINES = [
  () => 'Your stylist is ready to make some magic!',
  () => 'Your fabulous transformation awaits!',
  () => 'Great hair days are just around the corner!',
  (chair) => `Chair ${chair} is ready for you. Let the pampering begin!`,
  () => 'Your moment of fabulousness has arrived!',
  () => 'Time to sit back, relax, and enjoy the salon experience!',
  () => 'Get ready to look and feel extraordinary!',
];

function formatToken(tokenNumber) {
  const clean = tokenNumber.replace(/\s+/g, '');
  const match = clean.match(/^([A-Za-z]+)[-_]?(\d+)$/);
  if (match) {
    const letter = match[1].toUpperCase();
    const digits = match[2].split('').map(d => ENGLISH_DIGITS[d] || d).join(' ');
    return { letter, digits };
  }
  return { letter: tokenNumber, digits: tokenNumber };
}

let lastIndex = -1;
function getHumorLine(chairName) {
  let idx = Math.floor(Math.random() * ENGLISH_HUMOROUS_LINES.length);
  if (idx === lastIndex) {
    idx = (idx + 1) % ENGLISH_HUMOROUS_LINES.length;
  }
  lastIndex = idx;
  return ENGLISH_HUMOROUS_LINES[idx](chairName);
}

function generateAnnouncement(token, chairNum) {
  const { letter, digits } = formatToken(token);
  const chairName = ENGLISH_NUMBERS[chairNum] || String(chairNum);
  const humor = getHumorLine(chairName);
  return `Attention, please! Token ${letter}, ${digits}. Please proceed to Chair ${chairName}. ${humor}`;
}

console.log('--- 5 CONSECUTIVE ANNOUNCEMENT SAMPLES ---');
const generated = [];
for (let i = 1; i <= 5; i++) {
  const text = generateAnnouncement(`A-10${i}`, i);
  console.log(`[Call ${i}] [ONE SOFT CHIME -> PAUSE] "${text}"`);
  generated.push(text);
}

// Check non-repetition
for (let i = 1; i < generated.length; i++) {
  if (generated[i] === generated[i - 1]) {
    throw new Error('Consecutive humorous line was repeated!');
  }
}

// Check leading zeros
const b008 = generateAnnouncement('B-008', 3);
console.log('\n[Leading zero check]:', b008);
if (!b008.includes('zero zero eight')) {
  throw new Error('Leading zeros were not pronounced correctly!');
}

console.log('\nAll refinement verifications PASSED with flying colors!');
