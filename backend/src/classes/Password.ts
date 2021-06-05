import crypto from 'crypto';

export default class Password {
  private static algo = "sha512";

  public static generateSalt(options?: GenerateSaltOptions): string {
    const rounds = options?.rounds ?? 12;
    const randomBytes = crypto.randomBytes(Math.ceil(rounds / 2));

    return randomBytes.toString('hex').slice(0, rounds);
  }

  public static hash(password, options?: HashPasswordOptions): HashedPassword {
    const salt = options?.overrideSalt ?? Password.generateSalt();
    let hash = crypto.createHmac(Password.algo, salt);
    hash.update(password);

    return  {
      hash: hash.digest('hex'),
      salt: salt
    }
  }

  public static validate(newPass: string, object: HashedPassword): boolean {
    const newHash = Password.hash(newPass, { overrideSalt: object.salt }).hash;
    const originalHash = object.hash;
    
    return (newHash == originalHash);
  }
}

export interface HashedPassword {
  hash: string;
  salt: string;
}

export interface HashPasswordOptions {
  pepper?: string;
  overrideSalt?: string;
}

export interface GenerateSaltOptions {
  rounds?: number; // default 12
}