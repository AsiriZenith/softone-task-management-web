import { Component, output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';

import { TaskPlaceholder } from '../models/task-placeholder.model';
import { TaskItemComponent } from '../task-item/task-item.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [MatCardModule, MatDividerModule, TaskItemComponent],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss',
})
export class TaskListComponent {
  readonly edit = output<TaskPlaceholder>();
  readonly complete = output<TaskPlaceholder>();
  readonly delete = output<TaskPlaceholder>();

  readonly tasks: TaskPlaceholder[] = [
    {
      id: 1,
      title: 'Review project requirements',
      description: 'Review and validate all project requirements with the stakeholders.',
      priority: 'High',
      status: 'In Progress',
      dueDate: 'May 25, 2026',
    },
    {
      id: 2,
      title: 'Prepare sprint backlog',
      description: 'Organize user stories and prioritize items for the upcoming sprint.',
      priority: 'Medium',
      status: 'Pending',
      dueDate: 'May 28, 2026',
    },
    {
      id: 3,
      title: 'Update stakeholder notes',
      description: 'Document meeting outcomes and share updates with the team.',
      priority: 'Low',
      status: 'Waiting',
      dueDate: 'Jun 2, 2026',
    },
  ];
}
