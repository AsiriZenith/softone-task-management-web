import { Component, input, output } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

import {
  SORT_DIRECTION_OPTIONS,
  TASK_PRIORITY_FILTER_OPTIONS,
  TASK_SORT_FIELD_OPTIONS,
  TASK_STATUS_FILTER_OPTIONS,
  TaskPriorityFilter,
  TaskQueryParams,
  TaskSortField,
  TaskStatusFilter,
  SortDirection,
} from '../../../core/models/task-query.model';

@Component({
  selector: 'app-task-toolbar',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    MatButtonToggleModule,
    MatIconModule,
    MatDividerModule,
  ],
  templateUrl: './task-toolbar.component.html',
  styleUrl: './task-toolbar.component.scss',
})
export class TaskToolbarComponent {
  readonly status = input<TaskStatusFilter>('all');
  readonly priority = input<TaskPriorityFilter>('all');
  readonly sortBy = input<TaskSortField>('createdAt');
  readonly sortDirection = input<SortDirection>('desc');
  readonly disabled = input(false);

  readonly queryChange = output<Partial<TaskQueryParams>>();

  readonly statusOptions = TASK_STATUS_FILTER_OPTIONS;
  readonly priorityOptions = TASK_PRIORITY_FILTER_OPTIONS;
  readonly sortFieldOptions = TASK_SORT_FIELD_OPTIONS;
  readonly sortDirectionOptions = SORT_DIRECTION_OPTIONS;

  onStatusChange(value: TaskStatusFilter): void {
    this.queryChange.emit({ status: value });
  }

  onPriorityChange(value: TaskPriorityFilter): void {
    this.queryChange.emit({ priority: value });
  }

  onSortFieldChange(value: TaskSortField): void {
    this.queryChange.emit({ sortBy: value });
  }

  onSortDirectionChange(value: SortDirection | null): void {
    if (value) {
      this.queryChange.emit({ sortDirection: value });
    }
  }
}
