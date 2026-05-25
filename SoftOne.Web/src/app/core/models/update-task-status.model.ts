import { TaskStatus } from '../../shared/enums/task-status.enum';

export interface UpdateTaskStatusRequestDto {
  status: TaskStatus;
}
