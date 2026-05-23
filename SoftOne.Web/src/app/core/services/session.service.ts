import { Injectable } from '@angular/core';

import { AuthSession } from '../models/auth-session.model';
import { EncryptionService } from '../security/encryption.service';
import { SESSION_STORAGE_KEY } from '../security/session.constants';

@Injectable({ providedIn: 'root' })
export class SessionService {
  constructor(private readonly encryptionService: EncryptionService) {}

  saveSession(session: AuthSession): void {
    const payload = JSON.stringify(session);
    const encrypted = this.encryptionService.encrypt(payload);
    sessionStorage.setItem(SESSION_STORAGE_KEY, encrypted);
  }

  getSession(): AuthSession | null {
    const encrypted = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!encrypted) {
      return null;
    }

    const decrypted = this.encryptionService.decrypt(encrypted);
    if (!decrypted) {
      this.clearSession();
      return null;
    }

    try {
      const session = JSON.parse(decrypted) as AuthSession;
      if (!this.isValidSession(session)) {
        this.clearSession();
        return null;
      }
      return session;
    } catch {
      this.clearSession();
      return null;
    }
  }

  clearSession(): void {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
  }

  hasSession(): boolean {
    return this.getSession() !== null;
  }

  private isValidSession(session: AuthSession | null): session is AuthSession {
    return (
      session !== null &&
      typeof session.username === 'string' &&
      session.username.length > 0 &&
      typeof session.authToken === 'string' &&
      session.authToken.startsWith('Basic ')
    );
  }
}
