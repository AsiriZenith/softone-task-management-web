import { Task } from '../../../core/models/task.model';

export type TaskDialogMode = 'create' | 'edit';

export interface TaskDialogData {
  task: Task | null;
  mode: TaskDialogMode;
}

export interface TaskDialogResult {
  mode: TaskDialogMode;
  task: Task;
}
