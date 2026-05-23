import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const notificationService = inject(NotificationService);

  const authToken = authService.getAuthToken();
  const request = authToken
    ? req.clone({
        setHeaders: {
          Authorization: authToken,
        },
      })
    : req;

  return next(request).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        authService.handleUnauthorized();
        notificationService.showUnauthorized();
        void router.navigate(['/login']);
      }

      return throwError(() => error);
    })
  );
};
