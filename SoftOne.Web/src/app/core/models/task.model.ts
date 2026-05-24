import { TaskPriority } from '../../shared/enums/task-priority.enum';
import { TaskStatus } from '../../shared/enums/task-status.enum';

export interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string | null;
}

export interface TaskResponseDto {
  id: number;
  title: string;
  description: string | null;
  status: TaskStatus | number | string;
  priority: number | string;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string | null;
}

export interface CreateTaskRequestDto {
  title: string;
  description?: string | null;
  priority?: TaskPriority;
  dueDate?: string | null;
}

export interface UpdateTaskRequestDto {
  title: string;
  description?: string | null;
  priority?: TaskPriority;
  dueDate?: string | null;
}

export interface TaskFormValue {
  title: string;
  description: string;
  priority: TaskPriority;
  dueDate: Date | null;
  status: TaskStatus;
}
