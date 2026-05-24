import { Component, computed, input } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { TaskStatus } from '../../enums/task-status.enum';
import {
  getStatusChipClass,
  getStatusIcon,
  getStatusLabel,
} from '../../utils/task-status.ui';

@Component({
  selector: 'app-task-status-chip',
  standalone: true,
  imports: [MatChipsModule, MatIconModule, MatTooltipModule],
  templateUrl: './task-status-chip.component.html',
  styleUrl: './task-status-chip.component.scss',
})
export class TaskStatusChipComponent {
  readonly status = input.required<TaskStatus>();

  readonly label = computed(() => getStatusLabel(this.status()));
  readonly icon = computed(() => getStatusIcon(this.status()));
  readonly chipClass = computed(() => getStatusChipClass(this.status()));
}
