import { generateKeyPair } from "crypto";
import fs from "fs";

export default function main() {
  /**
   * Generate the JWT Private Key
   *
   * This private key is responsible for encrypting the JSON Web Tokens so that they can be
   * secured once they have been distrobuted.
   */
  generateKeyPair(
    "rsa",
    {
      modulusLength: 4096,
      publicKeyEncoding: {
        type: "spki",
        format: "pem",
      },
      privateKeyEncoding: {
        type: "pkcs8",
        format: "pem",
        cipher: "aes-256-cbc",
        passphrase: "top secret",
      },
    },
    (err, publicKey, privateKey) => {
      fs.writeFileSync(`${__dirname}/../jwt.key`, privateKey);
    }
  );

  /**
   * Generate The Master Private Key
   *
   * This method creates a private key that will be used for encrypting and distrobuting data.
   */
  generateKeyPair(
    "rsa",
    {
      modulusLength: 4096,
      publicKeyEncoding: {
        type: "spki",
        format: "pem",
      },
      privateKeyEncoding: {
        type: "pkcs8",
        format: "pem",
        cipher: "aes-256-cbc",
        passphrase: "top secret",
      },
    },
    (err, publicKey, privateKey) => {
      fs.writeFileSync(`${__dirname}/../private.key`, privateKey);
    }
  );
}

main();
