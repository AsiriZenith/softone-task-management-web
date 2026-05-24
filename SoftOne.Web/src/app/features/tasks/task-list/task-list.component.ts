import { Component, input, output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { Task } from '../../../core/models/task.model';
import { TaskItemComponent } from '../task-item/task-item.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    MatCardModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    TaskItemComponent,
  ],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss',
})
export class TaskListComponent {
  readonly tasks = input<Task[]>([]);
  readonly loading = input(false);
  readonly actionsDisabled = input(false);

  readonly edit = output<Task>();
  readonly complete = output<Task>();
  readonly delete = output<Task>();
}
