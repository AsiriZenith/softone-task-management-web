import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly defaultDurationMs = 5000;

  constructor(private readonly snackBar: MatSnackBar) {}

  showError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: this.defaultDurationMs,
      panelClass: ['snackbar-error'],
    });
  }

  showUnauthorized(): void {
    this.showError('Your session has expired. Please sign in again.');
  }
}
