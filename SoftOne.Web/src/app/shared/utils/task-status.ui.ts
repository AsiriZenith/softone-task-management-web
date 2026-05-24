import {
  TaskStatus,
  formatTaskStatusLabel,
  isTerminalTaskStatus,
} from '../enums/task-status.enum';

export type TaskStatusColor = 'gray' | 'blue' | 'orange' | 'green' | 'red';

const STATUS_COLORS: Record<TaskStatus, TaskStatusColor> = {
  [TaskStatus.Todo]: 'gray',
  [TaskStatus.InProgress]: 'blue',
  [TaskStatus.Waiting]: 'orange',
  [TaskStatus.Completed]: 'green',
  [TaskStatus.Rejected]: 'red',
};

const STATUS_ICONS: Record<TaskStatus, string> = {
  [TaskStatus.Todo]: 'radio_button_unchecked',
  [TaskStatus.InProgress]: 'autorenew',
  [TaskStatus.Waiting]: 'hourglass_empty',
  [TaskStatus.Completed]: 'check_circle',
  [TaskStatus.Rejected]: 'cancel',
};

const STATUS_CHIP_CLASSES: Record<TaskStatus, string> = {
  [TaskStatus.Todo]: 'task-status-chip--todo',
  [TaskStatus.InProgress]: 'task-status-chip--in-progress',
  [TaskStatus.Waiting]: 'task-status-chip--waiting',
  [TaskStatus.Completed]: 'task-status-chip--completed',
  [TaskStatus.Rejected]: 'task-status-chip--rejected',
};

/** User-friendly display label (e.g. InProgress → "In Progress"). */
export function getStatusLabel(status: TaskStatus): string {
  return formatTaskStatusLabel(status);
}

/** Workflow color token for styling. */
export function getStatusColor(status: TaskStatus): TaskStatusColor {
  return STATUS_COLORS[status];
}

export function getStatusChipClass(status: TaskStatus): string {
  return STATUS_CHIP_CLASSES[status];
}

export function getStatusIcon(status: TaskStatus): string {
  return STATUS_ICONS[status];
}

export function getCompleteActionTooltip(status: TaskStatus): string {
  if (status === TaskStatus.Completed) {
    return 'Task is already completed';
  }

  if (status === TaskStatus.Rejected) {
    return 'Rejected tasks cannot be marked complete';
  }

  return 'Mark as complete';
}

export function getEditActionTooltip(status: TaskStatus): string {
  if (isTerminalTaskStatus(status)) {
    return 'Open dialog to change status or view details';
  }

  return 'Edit task';
}

export { isTerminalTaskStatus };
