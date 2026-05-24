import { Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { finalize } from 'rxjs';

import { Task } from '../../../core/models/task.model';
import { NotificationService } from '../../../core/services/notification.service';
import { TaskService } from '../../../core/services/task.service';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { ConfirmationDialogData } from '../../../shared/components/confirmation-dialog/confirmation-dialog.model';
import { TaskDialogData, TaskDialogResult } from '../models/task-dialog.model';
import { TaskDialogComponent } from '../task-dialog/task-dialog.component';
import { TaskListComponent } from '../task-list/task-list.component';
import { TaskToolbarComponent } from '../task-toolbar/task-toolbar.component';

@Component({
  selector: 'app-tasks-page',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatIconModule,
    TaskToolbarComponent,
    TaskListComponent,
  ],
  templateUrl: './tasks-page.component.html',
  styleUrl: './tasks-page.component.scss',
})
export class TasksPageComponent implements OnInit {
  private readonly dialog = inject(MatDialog);
  private readonly taskService = inject(TaskService);
  private readonly notificationService = inject(NotificationService);

  tasks: Task[] = [];
  isLoading = false;
  isActionInProgress = false;

  private readonly dialogConfig = {
    width: '560px',
    maxWidth: '95vw',
    autoFocus: 'first-titled-element' as const,
    restoreFocus: true,
  };

  ngOnInit(): void {
    this.loadTasks();
  }

  onCreateTask(): void {
    this.openTaskDialog({ task: null, mode: 'create' });
  }

  onEditTask(task: Task): void {
    this.openTaskDialog({ task, mode: 'edit' });
  }

  onCompleteTask(task: Task): void {
    if (task.isCompleted || this.isActionInProgress) {
      return;
    }

    this.isActionInProgress = true;
    this.taskService
      .completeTask(task.id)
      .pipe(finalize(() => (this.isActionInProgress = false)))
      .subscribe({
        next: () => {
          this.notificationService.showSuccess('Task completed successfully');
          this.loadTasks();
        },
        error: (error: Error) => {
          this.notificationService.showError(
            error.message || 'Failed to complete task.'
          );
        },
      });
  }

  onDeleteTask(task: Task): void {
    if (this.isActionInProgress) {
      return;
    }

    const dialogRef = this.dialog.open<
      ConfirmationDialogComponent,
      ConfirmationDialogData,
      boolean
    >(ConfirmationDialogComponent, {
      width: '400px',
      maxWidth: '95vw',
      data: {
        title: 'Delete Task',
        message: `Are you sure you want to delete "${task.title}"? This action cannot be undone.`,
        confirmLabel: 'Delete',
        cancelLabel: 'Cancel',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (!confirmed) {
        return;
      }

      this.isActionInProgress = true;
      this.taskService
        .deleteTask(task.id)
        .pipe(finalize(() => (this.isActionInProgress = false)))
        .subscribe({
          next: () => {
            this.notificationService.showSuccess('Task deleted successfully');
            this.loadTasks();
          },
          error: (error: Error) => {
            this.notificationService.showError(
              error.message || 'Failed to delete task.'
            );
          },
        });
    });
  }

  loadTasks(): void {
    this.isLoading = true;
    this.taskService
      .getTasks()
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (tasks) => {
          this.tasks = tasks;
        },
        error: (error: Error) => {
          this.tasks = [];
          this.notificationService.showError(
            error.message || 'Failed to load tasks.'
          );
        },
      });
  }

  private openTaskDialog(data: TaskDialogData): void {
    const dialogRef = this.dialog.open<
      TaskDialogComponent,
      TaskDialogData,
      TaskDialogResult
    >(TaskDialogComponent, {
      ...this.dialogConfig,
      data,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        return;
      }

      const message =
        result.mode === 'create'
          ? 'Task created successfully'
          : 'Task updated successfully';

      this.notificationService.showSuccess(message);
      this.loadTasks();
    });
  }
}
