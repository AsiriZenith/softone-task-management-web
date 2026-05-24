import { Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { Task } from '../../../core/models/task.model';
import { formatTaskDueDate } from '../../../core/utils/task.mapper';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './task-item.component.html',
  styleUrl: './task-item.component.scss',
})
export class TaskItemComponent {
  readonly task = input.required<Task>();
  readonly actionsDisabled = input(false);

  readonly edit = output<Task>();
  readonly complete = output<Task>();
  readonly delete = output<Task>();

  formatDueDate(value: string | null): string {
    return formatTaskDueDate(value);
  }

  displayStatus(): string {
    return this.task().isCompleted ? 'Completed' : 'Active';
  }

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
