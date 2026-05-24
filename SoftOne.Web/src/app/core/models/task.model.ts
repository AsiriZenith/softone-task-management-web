import { TaskPriority } from '../../shared/enums/task-priority.enum';

export interface Task {
  id: number;
  title: string;
  description: string;
  isCompleted: boolean;
  priority: TaskPriority;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string | null;
}

export interface TaskResponseDto {
  id: number;
  title: string;
  description: string | null;
  isCompleted: boolean;
  priority: number | string;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string | null;
}

export interface CreateTaskRequestDto {
  title: string;
  description?: string | null;
  priority?: number;
  dueDate?: string | null;
}

export interface UpdateTaskRequestDto {
  title: string;
  description?: string | null;
  priority?: number;
  dueDate?: string | null;
}

export interface TaskFormValue {
  title: string;
  description: string;
  priority: TaskPriority;
  dueDate: Date | null;
  status: string;
}
