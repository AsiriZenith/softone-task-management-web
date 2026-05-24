import { Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { finalize } from 'rxjs';

import { Task } from '../../../core/models/task.model';
import { PagedTasksResult } from '../../../core/models/paged-response.model';
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  DEFAULT_TASK_QUERY,
  TaskQueryParams,
  hasActiveTaskFilters,
} from '../../../core/models/task-query.model';
import { NotificationService } from '../../../core/services/notification.service';
import { TaskService } from '../../../core/services/task.service';
import { TaskStatus } from '../../../shared/enums/task-status.enum';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { ConfirmationDialogData } from '../../../shared/components/confirmation-dialog/confirmation-dialog.model';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { TaskDialogData, TaskDialogResult } from '../models/task-dialog.model';
import { TaskDialogComponent } from '../task-dialog/task-dialog.component';
import { TaskListComponent } from '../task-list/task-list.component';
import { TaskToolbarComponent } from '../task-toolbar/task-toolbar.component';

@Component({
  selector: 'app-tasks-page',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    TaskToolbarComponent,
    TaskListComponent,
    PaginationComponent,
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
  actingTaskId: number | null = null;
  query: TaskQueryParams = { ...DEFAULT_TASK_QUERY };

  currentPage = DEFAULT_PAGE;
  pageSize = DEFAULT_PAGE_SIZE;
  totalCount = 0;
  totalPages = 0;

  get hasActiveFilters(): boolean {
    return hasActiveTaskFilters(this.query);
  }

  private readonly dialogConfig = {
    width: '560px',
    maxWidth: '95vw',
    panelClass: 'task-dialog-panel',
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
    if (task.status === TaskStatus.Completed || this.isActionInProgress) {
      return;
    }

    this.isActionInProgress = true;
    this.actingTaskId = task.id;
    this.taskService
      .updateTaskStatus(task.id, { status: TaskStatus.Completed })
      .pipe(
        finalize(() => {
          this.isActionInProgress = false;
          this.actingTaskId = null;
        })
      )
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
      width: '420px',
      maxWidth: '95vw',
      panelClass: 'confirmation-dialog-panel',
      autoFocus: 'dialog',
      restoreFocus: true,
      data: {
        title: 'Delete Task',
        message: `Are you sure you want to delete "${task.title}"? This action cannot be undone.`,
        confirmLabel: 'Delete',
        cancelLabel: 'Cancel',
        icon: 'delete_outline',
        destructive: true,
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (!confirmed) {
        return;
      }

      this.isActionInProgress = true;
      this.actingTaskId = task.id;
      this.taskService
        .deleteTask(task.id)
        .pipe(
          finalize(() => {
            this.isActionInProgress = false;
            this.actingTaskId = null;
          })
        )
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

  onQueryChange(partial: Partial<TaskQueryParams>): void {
    this.query = { ...this.query, ...partial };
    this.currentPage = DEFAULT_PAGE;
    this.loadTasks();
  }

  onPageChange(page: number): void {
    if (page === this.currentPage) {
      return;
    }

    this.currentPage = page;
    this.loadTasks();
  }

  onPageSizeChange(pageSize: number): void {
    if (pageSize === this.pageSize) {
      return;
    }

    this.pageSize = pageSize;
    this.currentPage = DEFAULT_PAGE;
    this.loadTasks();
  }

  loadTasks(): void {
    this.isLoading = true;
    this.taskService
      .getTasks({
        ...this.query,
        page: this.currentPage,
        pageSize: this.pageSize,
      })
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (result) => {
          if (this.shouldReloadForPageBounds(result)) {
            this.loadTasks();
            return;
          }

          this.applyPagedResult(result);
        },
        error: (error: Error) => {
          this.tasks = [];
          this.totalCount = 0;
          this.totalPages = 0;
          this.notificationService.showError(
            error.message || 'Failed to load tasks.'
          );
        },
      });
  }

  private shouldReloadForPageBounds(result: PagedTasksResult): boolean {
    if (result.totalCount === 0) {
      return false;
    }

    if (this.currentPage > result.totalPages) {
      this.currentPage = Math.max(DEFAULT_PAGE, result.totalPages);
      return true;
    }

    return false;
  }

  private applyPagedResult(result: PagedTasksResult): void {
    this.tasks = result.items;
    this.currentPage = result.page;
    this.pageSize = result.pageSize;
    this.totalCount = result.totalCount;
    this.totalPages = result.totalPages;
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
