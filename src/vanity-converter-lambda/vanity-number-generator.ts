function generateVanityNumbers(phoneNumber: string): string[] {
  return [1, 2, 3, 4, 5].map((v) => `vanity-number-${v}`);
}

export { generateVanityNumbers };
