import { Component, computed, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

import { Task } from '../../../core/models/task.model';
import { TaskPriorityChipComponent } from '../../../shared/components/task-priority-chip/task-priority-chip.component';
import { TaskDueDateChipComponent } from '../../../shared/components/task-due-date-chip/task-due-date-chip.component';
import { TaskStatusChipComponent } from '../../../shared/components/task-status-chip/task-status-chip.component';
import { TaskStatus } from '../../../shared/enums/task-status.enum';
import {
  getCompleteActionTooltip,
  getEditActionTooltip,
  isTerminalTaskStatus,
} from '../../../shared/utils/task-status.ui';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    TaskStatusChipComponent,
    TaskPriorityChipComponent,
    TaskDueDateChipComponent,
  ],
  templateUrl: './task-item.component.html',
  styleUrl: './task-item.component.scss',
})
export class TaskItemComponent {
  readonly task = input.required<Task>();
  readonly actionsDisabled = input(false);
  readonly isActing = input(false);

  readonly edit = output<Task>();
  readonly complete = output<Task>();
  readonly delete = output<Task>();

  readonly isCompleted = computed(
    () => this.task().status === TaskStatus.Completed
  );

  readonly isRejected = computed(
    () => this.task().status === TaskStatus.Rejected
  );

  readonly isTerminal = computed(() =>
    isTerminalTaskStatus(this.task().status)
  );

  readonly editTooltip = computed(() =>
    getEditActionTooltip(this.task().status)
  );

  readonly completeTooltip = computed(() =>
    getCompleteActionTooltip(this.task().status)
  );

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
