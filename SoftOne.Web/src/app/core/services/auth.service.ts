import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, delay, map, of, tap, throwError } from 'rxjs';

import { AuthSession } from '../models/auth-session.model';
import { LoginCredentials } from '../models/login-credentials.model';
import { SessionService } from './session.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly authStateSubject = new BehaviorSubject<AuthSession | null>(null);

  readonly authState$: Observable<AuthSession | null> =
    this.authStateSubject.asObservable();

  readonly isAuthenticated$: Observable<boolean> = this.authState$.pipe(
    map((session) => session !== null)
  );

  readonly currentUsername$: Observable<string | null> = this.authState$.pipe(
    map((session) => session?.username ?? null)
  );

  constructor(private readonly sessionService: SessionService) {
    this.restoreSession();
  }

  login(credentials: LoginCredentials): Observable<AuthSession> {
    const username = credentials.username.trim();
    const password = credentials.password;

    if (!username || !password) {
      return throwError(() => new Error('Username and password are required.'));
    }

    return of(this.buildSession(username, password)).pipe(
      delay(400),
      tap((session) => {
        this.sessionService.saveSession(session);
        this.authStateSubject.next(session);
      })
    );
  }

  logout(): void {
    this.sessionService.clearSession();
    this.authStateSubject.next(null);
  }

  restoreSession(): void {
    const session = this.sessionService.getSession();
    this.authStateSubject.next(session);
  }

  isAuthenticated(): boolean {
    return this.authStateSubject.value !== null;
  }

  getAuthToken(): string | null {
    return this.authStateSubject.value?.authToken ?? null;
  }

  getCurrentUsername(): string | null {
    return this.authStateSubject.value?.username ?? null;
  }

  private buildSession(username: string, password: string): AuthSession {
    return {
      username,
      authToken: this.createBasicAuthToken(username, password),
    };
  }

  private createBasicAuthToken(username: string, password: string): string {
    const encoded = btoa(`${username}:${password}`);
    return `Basic ${encoded}`;
  }
}
