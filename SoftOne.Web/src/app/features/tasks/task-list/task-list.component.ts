import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

import { TaskToolbarComponent } from '../task-toolbar/task-toolbar.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    MatCardModule,
    MatDividerModule,
    MatIconModule,
    TaskToolbarComponent,
  ],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss',
})
export class TaskListComponent {
  readonly placeholderTasks = [
    { title: 'Review project requirements', meta: 'High · Due May 25' },
    { title: 'Prepare sprint backlog', meta: 'Medium · Due May 28' },
    { title: 'Update stakeholder notes', meta: 'Low · Due Jun 2' },
  ];
}
