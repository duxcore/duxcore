import { randomBytes } from "crypto";

// the number of bytes that get pre-allocated
const SECURE_BUFFER_PREALLOC_SIZE = 0x100000; // 1 MB

// if only this many bytes are left, preallocation is triggered
const SECURE_BUFFER_PREALLOC_TRIGGER = 0x1000; // 4 kB

const chars_str =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

// chars buffer of length >= 256
const chars = Buffer.from(chars_str.repeat(Math.ceil(256 / chars_str.length)));
// using a longer buffer is faster than (N % length)

let secureBuffer = Buffer.alloc(0);

let preallocationPending = true;

const preallocationHandler = (err: Error | null, buf: Buffer) => {
  preallocationPending = false;
  if (buf && !err) {
    secureBuffer = Buffer.concat([secureBuffer, buf]);
  }
};

const preallocateSecureBuffer = () => {
  preallocationPending = true;
  randomBytes(SECURE_BUFFER_PREALLOC_SIZE, preallocationHandler);
};

const allocateSecureBuffer = (length: number) => {
  secureBuffer = Buffer.concat([
    secureBuffer,
    randomBytes(length + SECURE_BUFFER_PREALLOC_SIZE),
  ]);
};

/**
 * randStr - generate a random string of a given length
 * @param {number} length
 * @returns {string}
 */
export default function randStr(length: number): string {
  const result = Buffer.allocUnsafe(length);
  // we can skip zeroing because the contents are overwritten

  if (secureBuffer.length < length) {
    allocateSecureBuffer(length);
  }

  for (let i = 0; i < length; ++i) {
    result[i] = chars[secureBuffer[i]];
  }

  secureBuffer = secureBuffer.slice(length);

  if (
    !preallocationPending &&
    secureBuffer.length <= SECURE_BUFFER_PREALLOC_TRIGGER
  ) {
    preallocateSecureBuffer();
  }

  return String(result);
}
