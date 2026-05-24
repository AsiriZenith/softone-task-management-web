import { TaskPlaceholder } from './task-placeholder.model';

export type TaskDialogMode = 'create' | 'edit';

export interface TaskDialogData {
  task: TaskPlaceholder | null;
  mode: TaskDialogMode;
}

export interface TaskDialogResult {
  mode: TaskDialogMode;
  task: {
    title: string;
    description: string;
    priority: string;
    dueDate: Date | null;
    status: string;
  };
}
