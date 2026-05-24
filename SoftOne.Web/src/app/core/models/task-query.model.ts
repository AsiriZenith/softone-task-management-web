import { TaskPriority } from '../../shared/enums/task-priority.enum';
import { TaskStatus } from '../../shared/enums/task-status.enum';

export type TaskStatusFilter = TaskStatus | 'all';
export type TaskPriorityFilter = TaskPriority | 'all';
export type TaskSortField = 'createdAt' | 'dueDate';
export type SortDirection = 'asc' | 'desc';

export interface TaskQueryParams {
  status: TaskStatusFilter;
  priority: TaskPriorityFilter;
  sortBy: TaskSortField;
  sortDirection: SortDirection;
}

export interface TaskFilterOption<T extends string> {
  value: T;
  label: string;
}

export const DEFAULT_TASK_QUERY: TaskQueryParams = {
  status: 'all',
  priority: 'all',
  sortBy: 'createdAt',
  sortDirection: 'desc',
};

export const TASK_STATUS_FILTER_OPTIONS: TaskFilterOption<TaskStatusFilter>[] = [
  { value: 'all', label: 'All Statuses' },
  { value: TaskStatus.Todo, label: 'Todo' },
  { value: TaskStatus.InProgress, label: 'In Progress' },
  { value: TaskStatus.Waiting, label: TaskStatus.Waiting },
  { value: TaskStatus.Completed, label: TaskStatus.Completed },
  { value: TaskStatus.Rejected, label: TaskStatus.Rejected },
];

export const TASK_PRIORITY_FILTER_OPTIONS: TaskFilterOption<TaskPriorityFilter>[] = [
  { value: 'all', label: 'All Priorities' },
  { value: TaskPriority.Low, label: TaskPriority.Low },
  { value: TaskPriority.Medium, label: TaskPriority.Medium },
  { value: TaskPriority.High, label: TaskPriority.High },
];

export const TASK_SORT_FIELD_OPTIONS: TaskFilterOption<TaskSortField>[] = [
  { value: 'createdAt', label: 'Created Date' },
  { value: 'dueDate', label: 'Due Date' },
];

export const SORT_DIRECTION_OPTIONS: TaskFilterOption<SortDirection>[] = [
  { value: 'asc', label: 'Ascending' },
  { value: 'desc', label: 'Descending' },
];

export function hasActiveTaskFilters(query: TaskQueryParams): boolean {
  return query.status !== 'all' || query.priority !== 'all';
}
