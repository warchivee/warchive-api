import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createCipheriv, createDecipheriv } from 'crypto';

@Injectable()
export class Encrypt {
  constructor(private readonly configService: ConfigService) {}

  private readonly crypto = require('crypto');
  private readonly iv = this.crypto.randomBytes(16);
  private readonly password = this.configService.get('JWT_SECRET');
  private readonly salt = this.configService.get('CRYPTO_SALT');
  // The key length is dependent on the algorithm.
  // In this case for aes256, it is 32 bytes.
  //password, salt, byte 순
  private readonly key = this.crypto.scryptSync(this.password, this.salt, 32);
  private readonly algorithm = 'AES-256-CBC';

  encrypt(collection_id: string) {
    const chipter = createCipheriv(this.algorithm, this.key, this.iv);

    const encryptedText = Buffer.concat([
      chipter.update(collection_id),
      chipter.final(),
    ]);

    return encryptedText.toString('base64');
  }

  decrypt(encryptedText: string) {
    const decipher = createDecipheriv(this.algorithm, this.key, this.iv);
    const decryptedText = Buffer.concat([
      decipher.update(Buffer.from(encryptedText, 'base64')),
      decipher.final(),
    ]);

    return decryptedText;
  }
}
