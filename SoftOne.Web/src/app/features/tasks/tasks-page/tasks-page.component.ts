import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

import { NotificationService } from '../../../core/services/notification.service';
import { TaskDialogData, TaskDialogResult } from '../models/task-dialog.model';
import { TaskPlaceholder } from '../models/task-placeholder.model';
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
export class TasksPageComponent {
  private readonly dialog = inject(MatDialog);
  private readonly notificationService = inject(NotificationService);

  private readonly dialogConfig = {
    width: '560px',
    maxWidth: '95vw',
    autoFocus: 'first-titled-element' as const,
    restoreFocus: true,
  };

  onCreateTask(): void {
    this.openTaskDialog({ task: null, mode: 'create' });
  }

  onEditTask(task: TaskPlaceholder): void {
    this.openTaskDialog({ task, mode: 'edit' });
  }

  onCompleteTask(_task: TaskPlaceholder): void {
    // API integration in Phase 7
  }

  onDeleteTask(_task: TaskPlaceholder): void {
    // API integration in Phase 7
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
    });
  }
}
