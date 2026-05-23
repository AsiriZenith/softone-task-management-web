import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

import { ENCRYPTION_SECRET } from './session.constants';

@Injectable({ providedIn: 'root' })
export class EncryptionService {
  encrypt(value: string): string {
    return CryptoJS.AES.encrypt(value, ENCRYPTION_SECRET).toString();
  }

  decrypt(encryptedValue: string): string | null {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedValue, ENCRYPTION_SECRET);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      return decrypted || null;
    } catch {
      return null;
    }
  }
}
