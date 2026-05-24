import { Component, input } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { TaskPriority } from '../../enums/task-priority.enum';

@Component({
  selector: 'app-task-priority-chip',
  standalone: true,
  imports: [MatChipsModule, MatIconModule, MatTooltipModule],
  templateUrl: './task-priority-chip.component.html',
  styleUrl: './task-priority-chip.component.scss',
})
export class TaskPriorityChipComponent {
  readonly priority = input.required<TaskPriority>();
}
