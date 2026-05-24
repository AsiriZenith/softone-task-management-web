import { Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './empty-state.component.html',
  styleUrl: './empty-state.component.scss',
})
export class EmptyStateComponent {
  readonly title = input('No items available');
  readonly hint = input<string | null>(null);
  readonly icon = input('inbox');
  readonly actionLabel = input<string | null>(null);

  readonly action = output<void>();

  onAction(): void {
    this.action.emit();
  }
}
