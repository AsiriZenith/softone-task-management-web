import { TaskPriority } from '../../shared/enums/task-priority.enum';
import { TaskStatus } from '../../shared/enums/task-status.enum';
import { PagedResponseDto, PagedTasksResult } from '../models/paged-response.model';
import { TaskStatusFilter } from '../models/task-query.model';
import {
  CreateTaskRequestDto,
  Task,
  TaskFormValue,
  TaskResponseDto,
  UpdateTaskRequestDto,
} from '../models/task.model';
import { applyClientStatusFilter } from './task-query.mapper';

const PRIORITY_FROM_API: Record<number, TaskPriority> = {
  0: TaskPriority.Low,
  1: TaskPriority.Medium,
  2: TaskPriority.High,
};

const STATUS_FROM_API: Record<number, TaskStatus> = {
  1: TaskStatus.Todo,
  2: TaskStatus.InProgress,
  3: TaskStatus.Waiting,
  4: TaskStatus.Completed,
  5: TaskStatus.Rejected,
};

export function mapPagedTasksFromDto(
  dto: PagedResponseDto<TaskResponseDto>,
  statusFilter: TaskStatusFilter
): PagedTasksResult {
  const items = dto.items.map(mapTaskFromDto);

  return {
    items: applyClientStatusFilter(items, statusFilter),
    page: dto.page,
    pageSize: dto.pageSize,
    totalCount: dto.totalCount,
    totalPages: dto.totalPages,
  };
}

export function mapTaskFromDto(dto: TaskResponseDto): Task {
  return {
    id: dto.id,
    title: dto.title,
    description: dto.description ?? '',
    status: mapStatusFromApi(dto.status),
    priority: mapPriorityFromApi(dto.priority),
    dueDate: dto.dueDate,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
  };
}

export function mapStatusFromApi(value: number | string): TaskStatus {
  if (typeof value === 'number') {
    return STATUS_FROM_API[value] ?? TaskStatus.Todo;
  }

  const normalized = value.trim();
  if (normalized === 'In Progress') {
    return TaskStatus.InProgress;
  }

  const match = Object.values(TaskStatus).find(
    (status) => status.toLowerCase() === normalized.toLowerCase()
  );

  return match ?? TaskStatus.Todo;
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

export function mapPriorityToApi(priority: TaskPriority): TaskPriority {
  return priority;
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
  return task.status;
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

export function shouldUpdateStatusAfterSave(
  formStatus: TaskStatus,
  previousStatus: TaskStatus
): boolean {
  return formStatus !== previousStatus;
}
