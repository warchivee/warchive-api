import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createCipheriv, createDecipheriv } from 'crypto';
import { WrongEncryptedText } from 'src/common/exception/service.exception';

@Injectable()
export class Encrypt {
  constructor(private readonly configService: ConfigService) {}

  private readonly crypto = require('crypto');
  private readonly password = this.configService.get('JWT_SECRET');
  private readonly iv = this.configService
    .get('JWT_REFRESH_SECRET')
    .substring(0, 16);
  private readonly salt = this.configService.get('CRYPTO_SALT');
  // The key length is dependent on the algorithm.
  // In this case for aes256, it is 32 bytes.
  //password, salt, byte 순
  private readonly key = this.crypto.scryptSync(this.password, this.salt, 32);
  private readonly algorithm = 'AES-256-CBC';

  encrypt(plan) {
    const chipter = createCipheriv(this.algorithm, this.key, this.iv);

    const planText = plan.toString();

    const encryptedText = Buffer.concat([
      chipter.update(planText),
      chipter.final(),
    ]);

    return encryptedText.toString('base64');
  }

  decrypt(encryptedText: string) {
    try {
      const decipher = createDecipheriv(this.algorithm, this.key, this.iv);
      const decryptedText = Buffer.concat([
        decipher.update(Buffer.from(encryptedText, 'base64')),
        decipher.final(),
      ]);

      return decryptedText;
    } catch (error) {
      if (error.code == 'ERR_OSSL_BAD_DECRYPT') {
        throw WrongEncryptedText();
      } else {
        throw error;
      }
    }
  }
}
