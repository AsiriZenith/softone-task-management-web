import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { finalize } from 'rxjs';

import { TaskFormValue } from '../../../core/models/task.model';
import { NotificationService } from '../../../core/services/notification.service';
import { TaskService } from '../../../core/services/task.service';
import { mapTaskToFormStatus } from '../../../core/utils/task.mapper';
import {
  TASK_PRIORITY_OPTIONS,
  TaskPriority,
} from '../../../shared/enums/task-priority.enum';
import {
  TASK_STATUS_OPTIONS,
  TaskStatus,
  formatTaskStatusLabel,
  isLockedTaskStatus,
} from '../../../shared/enums/task-status.enum';
import {
  TaskDialogData,
  TaskDialogResult,
} from '../models/task-dialog.model';

type LockedFieldName = 'title' | 'description' | 'priority' | 'dueDate';

const LOCKED_FIELDS: LockedFieldName[] = [
  'title',
  'description',
  'priority',
  'dueDate',
];

@Component({
  selector: 'app-task-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './task-dialog.component.html',
  styleUrl: './task-dialog.component.scss',
})
export class TaskDialogComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly formBuilder = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<TaskDialogComponent, TaskDialogResult>);
  private readonly taskService = inject(TaskService);
  private readonly notificationService = inject(NotificationService);
  readonly data = inject<TaskDialogData>(MAT_DIALOG_DATA);

  readonly priorityOptions = TASK_PRIORITY_OPTIONS;
  readonly statusOptions = TASK_STATUS_OPTIONS;
  readonly formatTaskStatusLabel = formatTaskStatusLabel;
  readonly TaskStatus = TaskStatus;

  readonly taskForm = this.formBuilder.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(2)]],
    description: ['', [Validators.required]],
    priority: [TaskPriority.Medium, Validators.required],
    dueDate: [null as Date | null, Validators.required],
    status: [TaskStatus.Todo, Validators.required],
  });

  isSubmitting = false;

  get isCreateMode(): boolean {
    return this.data.mode === 'create';
  }

  get dialogTitle(): string {
    return this.isCreateMode ? 'Create Task' : 'Edit Task';
  }

  ngOnInit(): void {
    if (this.data.mode === 'edit' && this.data.task) {
      this.populateForm(this.data.task);
    }

    this.applyFieldLock(this.taskForm.controls.status.value);
    this.taskForm.controls.status.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((status) => this.applyFieldLock(status));
  }

  submit(): void {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.setFormDisabled(true);
    const formValue = this.taskForm.getRawValue() as TaskFormValue;
    const previousStatus =
      this.data.task?.status ?? TaskStatus.Todo;

    this.taskService
      .saveTaskFromDialog(
        this.data.mode,
        this.data.task?.id ?? null,
        formValue,
        previousStatus
      )
      .pipe(finalize(() => {
        this.isSubmitting = false;
        this.setFormDisabled(false);
      }))
      .subscribe({
        next: (task) => {
          this.dialogRef.close({
            mode: this.data.mode,
            task,
          });
        },
        error: (error: Error) => {
          this.notificationService.showError(
            error.message || 'Failed to save task. Please try again.'
          );
        },
      });
  }

  cancel(): void {
    this.dialogRef.close();
  }

  private setFormDisabled(disabled: boolean): void {
    if (disabled) {
      this.taskForm.disable({ emitEvent: false });
    } else {
      this.taskForm.enable({ emitEvent: false });
      this.applyFieldLock(this.taskForm.controls.status.value);
    }
  }

  private populateForm(task: NonNullable<TaskDialogData['task']>): void {
    this.taskForm.patchValue({
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: this.parseDueDate(task.dueDate),
      status: mapTaskToFormStatus(task),
    });
  }

  private parseDueDate(value: string | null): Date | null {
    if (!value) {
      return null;
    }

    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  private applyFieldLock(status: TaskStatus): void {
    const locked = isLockedTaskStatus(status);

    for (const fieldName of LOCKED_FIELDS) {
      const control = this.taskForm.controls[fieldName];
      if (locked) {
        control.disable({ emitEvent: false });
      } else {
        control.enable({ emitEvent: false });
      }
    }
  }
}
