import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of, switchMap, throwError } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ApiSuccessResponse } from '../models/api-response.model';
import {
  CreateTaskRequestDto,
  Task,
  TaskFormValue,
  TaskResponseDto,
  UpdateTaskRequestDto,
} from '../models/task.model';
import {
  mapTaskFromDto,
  mapTaskToCreateRequest,
  mapTaskToUpdateRequest,
  shouldCompleteAfterSave,
} from '../utils/task.mapper';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/api/tasks`;

  getTasks(): Observable<Task[]> {
    return this.http
      .get<ApiSuccessResponse<TaskResponseDto[]>>(this.baseUrl)
      .pipe(
        map((response) => response.data.map(mapTaskFromDto)),
        catchError(this.handleError)
      );
  }

  getTaskById(id: number): Observable<Task> {
    return this.http
      .get<ApiSuccessResponse<TaskResponseDto>>(`${this.baseUrl}/${id}`)
      .pipe(
        map((response) => mapTaskFromDto(response.data)),
        catchError(this.handleError)
      );
  }

  createTask(request: CreateTaskRequestDto): Observable<Task> {
    return this.http
      .post<ApiSuccessResponse<TaskResponseDto>>(this.baseUrl, request)
      .pipe(
        map((response) => mapTaskFromDto(response.data)),
        catchError(this.handleError)
      );
  }

  updateTask(id: number, request: UpdateTaskRequestDto): Observable<Task> {
    return this.http
      .put<ApiSuccessResponse<TaskResponseDto>>(`${this.baseUrl}/${id}`, request)
      .pipe(
        map((response) => mapTaskFromDto(response.data)),
        catchError(this.handleError)
      );
  }

  completeTask(id: number): Observable<Task> {
    return this.http
      .patch<ApiSuccessResponse<TaskResponseDto>>(`${this.baseUrl}/${id}/complete`, null)
      .pipe(
        map((response) => mapTaskFromDto(response.data)),
        catchError(this.handleError)
      );
  }

  deleteTask(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.baseUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  saveTaskFromDialog(
    mode: 'create' | 'edit',
    taskId: number | null,
    form: TaskFormValue,
    wasCompleted = false
  ): Observable<Task> {
    if (mode === 'create') {
      return this.createTask(mapTaskToCreateRequest(form)).pipe(
        switchMap((task) =>
          shouldCompleteAfterSave(form.status, false)
            ? this.completeTask(task.id)
            : of(task)
        ),
        catchError(this.handleError)
      );
    }

    if (taskId === null) {
      return throwError(() => new Error('Task id is required for update.'));
    }

    return this.updateTask(taskId, mapTaskToUpdateRequest(form)).pipe(
      switchMap((task) =>
        shouldCompleteAfterSave(form.status, wasCompleted)
          ? this.completeTask(task.id)
          : of(task)
      ),
      catchError(this.handleError)
    );
  }

  private handleError(error: unknown): Observable<never> {
    if (error instanceof HttpErrorResponse) {
      const apiMessage =
        typeof error.error === 'object' &&
        error.error !== null &&
        'message' in error.error &&
        typeof error.error.message === 'string'
          ? error.error.message
          : null;

      const message =
        apiMessage ??
        error.message ??
        'An unexpected error occurred while communicating with the API.';

      return throwError(() => new Error(message));
    }

    return throwError(() => error);
  }
}
