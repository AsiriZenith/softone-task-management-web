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

const DATE_ONLY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
const MONTH_LABELS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const;

interface DateOnlyParts {
  year: number;
  month: number;
  day: number;
}

export function normalizeDateOnly(value: string | null | undefined): string | null {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();
  return parseDateOnly(trimmed) ? trimmed : null;
}

export function parseDateOnly(value: string | null): DateOnlyParts | null {
  if (!value) {
    return null;
  }

  const match = DATE_ONLY_PATTERN.exec(value.trim());
  if (!match) {
    return null;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  if (month < 1 || month > 12 || day < 1 || day > getDaysInMonth(year, month)) {
    return null;
  }

  return { year, month, day };
}

export function parseDateOnlyToLocalDate(value: string | null): Date | null {
  const dateOnly = parseDateOnly(value);
  if (!dateOnly) {
    return null;
  }

  return new Date(dateOnly.year, dateOnly.month - 1, dateOnly.day);
}

export function formatDateOnlyForApi(value: Date | null): string | null {
  if (!value || Number.isNaN(value.getTime())) {
    return null;
  }

  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, '0');
  const day = String(value.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function getDaysInMonth(year: number, month: number): number {
  if (month === 2) {
    return isLeapYear(year) ? 29 : 28;
  }

  return [4, 6, 9, 11].includes(month) ? 30 : 31;
}

function isLeapYear(year: number): boolean {
  return year % 400 === 0 || (year % 4 === 0 && year % 100 !== 0);
}

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
    dueDate: normalizeDateOnly(dto.dueDate),
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
    dueDate: formatDateOnlyForApi(form.dueDate),
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

  const dateOnly = parseDateOnly(value);
  if (!dateOnly) {
    return value;
  }

  return `${MONTH_LABELS[dateOnly.month - 1]} ${dateOnly.day}, ${dateOnly.year}`;
}

export function shouldUpdateStatusAfterSave(
  formStatus: TaskStatus,
  previousStatus: TaskStatus
): boolean {
  return formStatus !== previousStatus;
}
