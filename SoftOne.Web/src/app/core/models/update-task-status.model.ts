import { TaskStatus } from '../../shared/enums/task-status.enum';

/** Aligns with backend `UpdateTaskStatusRequest`. */
export interface UpdateTaskStatusRequestDto {
  status: TaskStatus;
}
