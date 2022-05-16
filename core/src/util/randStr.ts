const chars = Buffer.from(
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
);

const numChars = chars.length;

/**
 * randStr - generate a random string of a given length
 * @param {number} length
 * @returns {string}
 */
export default function randStr(length: number): string {
  const result = Buffer.alloc(length);

  for (let i = 0; i < length; ++i) {
    result[i] = chars[Math.floor(numChars * Math.random())];
  }

  return String(result);
}
