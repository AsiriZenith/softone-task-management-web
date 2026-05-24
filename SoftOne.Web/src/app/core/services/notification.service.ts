import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

type SnackbarVariant = 'success' | 'error' | 'warning';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly defaultDurationMs = 5000;

  private readonly baseConfig: MatSnackBarConfig = {
    duration: this.defaultDurationMs,
    horizontalPosition: 'end',
    verticalPosition: 'bottom',
    politeness: 'polite',
  };

  constructor(private readonly snackBar: MatSnackBar) {}

  showError(message: string): void {
    this.open(message, 'error');
  }

  showUnauthorized(): void {
    this.showError('Your session has expired. Please sign in again.');
  }

  showSuccess(message: string): void {
    this.open(message, 'success');
  }

  showWarning(message: string): void {
    this.open(message, 'warning');
  }

  private open(message: string, variant: SnackbarVariant): void {
    this.snackBar.open(message, 'Close', {
      ...this.baseConfig,
      panelClass: [`snackbar-${variant}`],
    });
  }
}
