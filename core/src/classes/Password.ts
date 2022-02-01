import { blake2sHex } from "blakets";
import crypto from "crypto";

export default class Password {
  public static generateSalt(options?: GenerateSaltOptions): string {
    const length = options?.length ?? 12;
    const randomBytes = crypto.randomBytes(Math.ceil(length / 2));
    return randomBytes.toString("hex").slice(0, length);
  }

  public static hash(password: string, options?: HashPasswordOptions): string {
    const salt =
      options?.overrideSalt ?? Password.generateSalt(options?.saltOpts);
    const hash = blake2sHex(`$BLAKE2s$${password}$${salt}`);
    return `BLAKE2s$${hash}$${salt}`;
  }

  public static validate(newPass: string, hashed: string): boolean {
    const [algo, oldHash, salt] = hashed.split(/\$/g);
    return crypto.timingSafeEqual(
      Buffer.from(hashed),
      Buffer.from(Password.hash(newPass, { overrideSalt: salt }))
    );
  }
}

export interface HashPasswordOptions {
  overrideSalt?: string;
  saltOpts?: GenerateSaltOptions;
}

export interface GenerateSaltOptions {
  length?: number; // default 12
}
