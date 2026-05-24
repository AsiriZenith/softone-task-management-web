import { Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { TaskPlaceholder } from '../models/task-placeholder.model';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './task-item.component.html',
  styleUrl: './task-item.component.scss',
})
export class TaskItemComponent {
  readonly task = input.required<TaskPlaceholder>();

  readonly edit = output<TaskPlaceholder>();
  readonly complete = output<TaskPlaceholder>();
  readonly delete = output<TaskPlaceholder>();

  onEdit(): void {
    this.edit.emit(this.task());
  }

  onComplete(): void {
    this.complete.emit(this.task());
  }

  onDelete(): void {
    this.delete.emit(this.task());
  }
}
