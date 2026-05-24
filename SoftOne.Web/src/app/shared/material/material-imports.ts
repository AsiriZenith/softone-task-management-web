import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';

/**
 * Centralized Angular Material module exports for standalone components.
 * Import individual modules or spread MATERIAL_IMPORTS in component imports.
 */
export const MATERIAL_IMPORTS = [
  MatToolbarModule,
  MatButtonModule,
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatTableModule,
  MatIconModule,
  MatSnackBarModule,
  MatProgressSpinnerModule,
  MatDividerModule,
  MatChipsModule,
  MatTooltipModule,
] as const;

export {
  MatToolbarModule,
  MatButtonModule,
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatTableModule,
  MatIconModule,
  MatSnackBarModule,
  MatProgressSpinnerModule,
  MatDividerModule,
  MatChipsModule,
  MatTooltipModule,
};
