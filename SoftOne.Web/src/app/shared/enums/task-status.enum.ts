export enum TaskStatus {
  Pending = 'Pending',
  InProgress = 'In Progress',
  Waiting = 'Waiting',
  Completed = 'Completed',
  Rejected = 'Rejected',
}

export const TASK_STATUS_OPTIONS: TaskStatus[] = [
  TaskStatus.Pending,
  TaskStatus.InProgress,
  TaskStatus.Waiting,
  TaskStatus.Completed,
  TaskStatus.Rejected,
];

export function isLockedTaskStatus(status: string): boolean {
  return status === TaskStatus.Completed || status === TaskStatus.Rejected;
}
