import { Component, computed, input, output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';

import { Task } from '../../../core/models/task.model';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { TaskItemComponent } from '../task-item/task-item.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    MatCardModule,
    MatDividerModule,
    LoadingSpinnerComponent,
    EmptyStateComponent,
    TaskItemComponent,
  ],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss',
})
export class TaskListComponent {
  readonly tasks = input<Task[]>([]);
  readonly totalCount = input(0);
  readonly loading = input(false);
  readonly actionsDisabled = input(false);
  readonly hasActiveFilters = input(false);
  readonly actingTaskId = input<number | null>(null);

  readonly edit = output<Task>();
  readonly complete = output<Task>();
  readonly delete = output<Task>();
  readonly createTask = output<void>();

  readonly emptyTitle = computed(() =>
    this.hasActiveFilters() ? 'No tasks match your filters' : 'No tasks available'
  );

  readonly emptyHint = computed(() =>
    this.hasActiveFilters()
      ? 'Try adjusting your status or priority filters.'
      : 'Create your first task to get started.'
  );

  readonly emptyIcon = computed(() =>
    this.hasActiveFilters() ? 'filter_alt_off' : 'inbox'
  );

  readonly displayTaskCount = computed(() =>
    this.hasActiveFilters() ? this.tasks().length : this.totalCount()
  );

  readonly showCreateAction = computed(
    () => !this.hasActiveFilters() && !this.loading()
  );
}
