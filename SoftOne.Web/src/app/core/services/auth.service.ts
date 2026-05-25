import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  catchError,
  map,
  tap,
  throwError,
} from 'rxjs';

import { environment } from '../../../environments/environment';
import { AuthSession } from '../models/auth-session.model';
import { LoginCredentials } from '../models/login-credentials.model';
import { LoginResponse } from '../models/login-response.model';
import { SessionService } from './session.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
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

    return this.http
      .post<LoginResponse>(`${environment.apiBaseUrl}/api/auth/login`, {
        username,
        password,
      })
      .pipe(
        map(() => this.buildSession(username, password)),
        tap((session) => {
          this.sessionService.saveSession(session);
          this.authStateSubject.next(session);
        }),
        catchError((error: unknown) => this.mapLoginError(error))
      );
  }

  logout(): void {
    this.sessionService.clearSession();
    this.authStateSubject.next(null);
  }

  handleUnauthorized(): void {
    this.logout();
  }

  restoreSession(): void {
    const session = this.sessionService.getSession();
    this.authStateSubject.next(session);
  }

  validateSession(): boolean {
    const session = this.sessionService.getSession();

    if (!session) {
      if (this.authStateSubject.value !== null) {
        this.authStateSubject.next(null);
      }
      return false;
    }

    this.authStateSubject.next(session);
    return true;
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

  private mapLoginError(error: unknown): Observable<never> {
    if (error instanceof HttpErrorResponse) {
      const apiMessage =
        typeof error.error === 'object' &&
        error.error !== null &&
        'message' in error.error &&
        typeof error.error.message === 'string'
          ? error.error.message
          : null;

      if (error.status === 401) {
        return throwError(
          () => new Error(apiMessage ?? 'Invalid username or password.')
        );
      }

      return throwError(
        () =>
          new Error(
            apiMessage ??
              error.message ??
              'Login failed. Please try again.'
          )
      );
    }

    return throwError(() => error);
  }
}
