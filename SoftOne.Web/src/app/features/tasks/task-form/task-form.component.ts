import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatDividerModule, MatIconModule],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss',
})
export class TaskFormComponent {
  readonly formFields = [
    { label: 'Title', icon: 'title' },
    { label: 'Description', icon: 'notes' },
    { label: 'Priority', icon: 'flag' },
    { label: 'Due Date', icon: 'event' },
    { label: 'Status', icon: 'check_circle' },
  ];
}
