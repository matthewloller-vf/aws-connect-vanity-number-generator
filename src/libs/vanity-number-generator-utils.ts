import words from 'an-array-of-english-words';
import { parsePhoneNumber } from 'libphonenumber-js';

const NUM_MAP = [
  ['0'],
  ['1'],
  ['A', 'B', 'C'],
  ['D', 'E', 'F'],
  ['G', 'H', 'I'],
  ['J', 'K', 'L'],
  ['M', 'N', 'O'],
  ['P', 'Q', 'R', 'S'],
  ['T', 'U', 'V'],
  ['W', 'X', 'Y', 'Z'],
];

/**
 * Generates a list of potential vanity phone numbers based on an input phone number
 * @param {string} phoneNumber phone number to generator vanity numbers for
 * @param {number} count number of vanity numbers to generate
 * @return {*}  {string[]} list of vanity numbers
 */
function generateVanityNumbers(phoneNumber: string, count?: 5): string[] {
  let vanityNumbers = [];

  // ex. 1-123-456-X789
  const num1 = parseInt(phoneNumber.slice(-4, -3));
  const digit1Map = NUM_MAP[num1];

  // ex. 1-123-456-7X89
  const num2 = parseInt(phoneNumber.slice(-3, -2));
  const digit2Map = NUM_MAP[num2];

  // ex. 1-123-456-78X9
  const num3 = parseInt(phoneNumber.slice(-2, -1));
  const digit3Map = NUM_MAP[num3];

  // ex. 1-123-456-789X
  const num4 = parseInt(phoneNumber.slice(-1));
  const digit4Map = NUM_MAP[num4];

  // hold temporary list of vanity numbers
  let placeholderNumbers = [];

  for (const char1 of digit1Map) {
    for (const char2 of digit2Map) {
      for (const char3 of digit3Map) {
        for (const char4 of digit4Map) {
          const word = `${char1}${char2}${char3}${char4}`;

          if (placeholderNumbers.length < 5) {
            placeholderNumbers.push(buildVanityNumber(phoneNumber, word));
          }

          if (word.toLowerCase() in words) {
            vanityNumbers.push(buildVanityNumber(phoneNumber, word));
          }
        }
      }
    }
  }

  const returnNumbers = [...vanityNumbers, ...placeholderNumbers].slice(0, 5);
  console.log(returnNumbers);
  return returnNumbers;
}
/**
 * Creates a vanity phone number string from a phonenumber and vanity word
 * @param {string} phoneNumber phone number to add vanity word to
 * @param {string} word 4-letter word to replace the last 4 digits of phone number with
 * @return {*}  {string} vanity number
 */
function buildVanityNumber(phoneNumber: string, word: string): string {
  let vanityNumber = parsePhoneNumber(phoneNumber).format('INTERNATIONAL');
  return vanityNumber.substr(0, vanityNumber.length - 4) + word;
}

export { generateVanityNumbers };
