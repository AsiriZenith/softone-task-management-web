import { Component, computed, input } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { TaskStatus } from '../../enums/task-status.enum';
import {
  getDueDateAriaLabel,
  getDueDateChipClass,
  getDueDateIcon,
  getDueDateLabel,
  getDueDateState,
  getDueDateTooltip,
} from '../../utils/task-due-date.ui';

@Component({
  selector: 'app-task-due-date-chip',
  standalone: true,
  imports: [MatChipsModule, MatIconModule, MatTooltipModule],
  templateUrl: './task-due-date-chip.component.html',
  styleUrl: './task-due-date-chip.component.scss',
})
export class TaskDueDateChipComponent {
  readonly dueDate = input<string | null>(null);
  readonly taskStatus = input.required<TaskStatus>();

  readonly state = computed(() =>
    getDueDateState(this.dueDate(), this.taskStatus())
  );

  readonly label = computed(() => getDueDateLabel(this.dueDate()));
  readonly icon = computed(() => getDueDateIcon(this.state()));
  readonly chipClass = computed(() => getDueDateChipClass(this.state()));
  readonly tooltip = computed(() =>
    getDueDateTooltip(this.dueDate(), this.state())
  );

  readonly ariaLabel = computed(() =>
    getDueDateAriaLabel(this.dueDate(), this.state())
  );
}
