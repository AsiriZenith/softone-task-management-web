import { Component } from '@angular/core';

import { TaskFormComponent } from '../task-form/task-form.component';
import { TaskListComponent } from '../task-list/task-list.component';

@Component({
  selector: 'app-tasks-page',
  standalone: true,
  imports: [TaskListComponent, TaskFormComponent],
  templateUrl: './tasks-page.component.html',
  styleUrl: './tasks-page.component.scss',
})
export class TasksPageComponent {}
