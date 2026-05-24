import { formatTaskDueDate } from '../../core/utils/task.mapper';
import { TaskStatus, isTerminalTaskStatus } from '../enums/task-status.enum';

export type TaskDueDateState =
  | 'none'
  | 'upcoming'
  | 'dueToday'
  | 'overdue'
  | 'muted';

const DUE_DATE_CHIP_CLASSES: Record<TaskDueDateState, string> = {
  none: 'task-due-date-chip--none',
  upcoming: 'task-due-date-chip--upcoming',
  dueToday: 'task-due-date-chip--due-today',
  overdue: 'task-due-date-chip--overdue',
  muted: 'task-due-date-chip--muted',
};

const DUE_DATE_ICONS: Record<TaskDueDateState, string> = {
  none: 'event_busy',
  upcoming: 'event',
  dueToday: 'today',
  overdue: 'warning_amber',
  muted: 'event_available',
};

function startOfDay(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

export function getDueDateState(
  dueDate: string | null,
  taskStatus: TaskStatus
): TaskDueDateState {
  if (isTerminalTaskStatus(taskStatus)) {
    return 'muted';
  }

  if (!dueDate) {
    return 'none';
  }

  const parsed = new Date(dueDate);
  if (Number.isNaN(parsed.getTime())) {
    return 'upcoming';
  }

  const dueDay = startOfDay(parsed);
  const today = startOfDay(new Date());

  if (dueDay < today) {
    return 'overdue';
  }

  if (dueDay === today) {
    return 'dueToday';
  }

  return 'upcoming';
}

export function getDueDateLabel(dueDate: string | null): string {
  if (!dueDate) {
    return 'No due date';
  }

  return `Due: ${formatTaskDueDate(dueDate)}`;
}

export function getDueDateChipClass(state: TaskDueDateState): string {
  return DUE_DATE_CHIP_CLASSES[state];
}

export function getDueDateIcon(state: TaskDueDateState): string {
  return DUE_DATE_ICONS[state];
}

export function getDueDateTooltip(
  dueDate: string | null,
  state: TaskDueDateState
): string {
  if (!dueDate) {
    return 'No due date set';
  }

  switch (state) {
    case 'overdue':
      return `Overdue — ${formatTaskDueDate(dueDate)}`;
    case 'dueToday':
      return `Due today — ${formatTaskDueDate(dueDate)}`;
    case 'muted':
      return `Due date — ${formatTaskDueDate(dueDate)}`;
    default:
      return `Due — ${formatTaskDueDate(dueDate)}`;
  }
}

export function getDueDateAriaLabel(
  dueDate: string | null,
  state: TaskDueDateState
): string {
  const label = getDueDateLabel(dueDate);

  switch (state) {
    case 'overdue':
      return `${label}, overdue`;
    case 'dueToday':
      return `${label}, due today`;
    case 'muted':
      return `${label}, task finalized`;
    case 'none':
      return label;
    default:
      return `${label}, upcoming`;
  }
}
