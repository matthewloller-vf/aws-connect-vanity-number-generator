import { generateVanityNumbers } from './vanity-number-generator-utils';

test('Test Vanity Number Generator', () => {
  const vanityNubmers = generateVanityNumbers('+12345673455');
  expect(vanityNubmers).toHaveLength(5);
});
