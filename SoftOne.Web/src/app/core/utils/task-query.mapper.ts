import { HttpParams } from '@angular/common/http';

import {
  TaskListQuery,
  TaskStatusFilter,
} from '../models/task-query.model';
import { Task } from '../models/task.model';
import { TaskStatus } from '../../shared/enums/task-status.enum';

export function buildTaskHttpParams(query: TaskListQuery): HttpParams {
  let params = new HttpParams()
    .set('sortBy', query.sortBy)
    .set('page', String(query.page))
    .set('pageSize', String(query.pageSize));

  if (query.sortDirection === 'desc') {
    params = params.set('sortDirection', 'desc');
  }

  if (query.priority !== 'all') {
    params = params.set('priority', query.priority);
  }

  if (query.status === TaskStatus.Completed) {
    params = params.set('isCompleted', 'true');
  } else if (query.status !== 'all') {
    params = params.set('isCompleted', 'false');
  }

  return params;
}

export function applyClientStatusFilter(
  tasks: Task[],
  status: TaskStatusFilter
): Task[] {
  if (status === 'all') {
    return tasks;
  }

  return tasks.filter((task) => task.status === status);
}
