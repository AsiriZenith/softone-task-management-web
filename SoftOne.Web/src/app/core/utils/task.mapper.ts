import { TaskPriority } from '../../shared/enums/task-priority.enum';
import { TaskStatus } from '../../shared/enums/task-status.enum';
import {
  CreateTaskRequestDto,
  Task,
  TaskFormValue,
  TaskResponseDto,
  UpdateTaskRequestDto,
} from '../models/task.model';

const PRIORITY_FROM_API: Record<number, TaskPriority> = {
  0: TaskPriority.Low,
  1: TaskPriority.Medium,
  2: TaskPriority.High,
};

const PRIORITY_TO_API: Record<TaskPriority, number> = {
  [TaskPriority.Low]: 0,
  [TaskPriority.Medium]: 1,
  [TaskPriority.High]: 2,
};

export function mapTaskFromDto(dto: TaskResponseDto): Task {
  return {
    id: dto.id,
    title: dto.title,
    description: dto.description ?? '',
    isCompleted: dto.isCompleted,
    priority: mapPriorityFromApi(dto.priority),
    dueDate: dto.dueDate,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
  };
}

export function mapPriorityFromApi(value: number | string): TaskPriority {
  if (typeof value === 'number') {
    return PRIORITY_FROM_API[value] ?? TaskPriority.Medium;
  }

  const normalized = value.trim().toLowerCase();
  if (normalized === 'low') return TaskPriority.Low;
  if (normalized === 'high') return TaskPriority.High;
  return TaskPriority.Medium;
}

export function mapPriorityToApi(priority: TaskPriority): number {
  return PRIORITY_TO_API[priority];
}

export function mapTaskToCreateRequest(form: TaskFormValue): CreateTaskRequestDto {
  return {
    title: form.title.trim(),
    description: form.description.trim(),
    priority: mapPriorityToApi(form.priority),
    dueDate: form.dueDate ? form.dueDate.toISOString() : null,
  };
}

export function mapTaskToUpdateRequest(form: TaskFormValue): UpdateTaskRequestDto {
  return mapTaskToCreateRequest(form);
}

export function mapTaskToFormStatus(task: Task): TaskStatus {
  if (task.isCompleted) {
    return TaskStatus.Completed;
  }

  return TaskStatus.Pending;
}

export function formatTaskDueDate(value: string | null): string {
  if (!value) {
    return 'No due date';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function shouldCompleteAfterSave(
  formStatus: string,
  wasCompleted: boolean
): boolean {
  return formStatus === TaskStatus.Completed && !wasCompleted;
}
