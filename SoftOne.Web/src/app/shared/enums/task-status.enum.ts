export enum TaskStatus {
  Todo = 'Todo',
  InProgress = 'InProgress',
  Waiting = 'Waiting',
  Completed = 'Completed',
  Rejected = 'Rejected',
}

export const TASK_STATUS_OPTIONS: TaskStatus[] = [
  TaskStatus.Todo,
  TaskStatus.InProgress,
  TaskStatus.Waiting,
  TaskStatus.Completed,
  TaskStatus.Rejected,
];

const STATUS_LABELS: Record<TaskStatus, string> = {
  [TaskStatus.Todo]: 'Todo',
  [TaskStatus.InProgress]: 'In Progress',
  [TaskStatus.Waiting]: 'Waiting',
  [TaskStatus.Completed]: 'Completed',
  [TaskStatus.Rejected]: 'Rejected',
};

export function formatTaskStatusLabel(status: TaskStatus): string {
  return STATUS_LABELS[status];
}

export function isTerminalTaskStatus(status: TaskStatus): boolean {
  return status === TaskStatus.Completed || status === TaskStatus.Rejected;
}

export function isLockedTaskStatus(status: TaskStatus): boolean {
  return isTerminalTaskStatus(status);
}
