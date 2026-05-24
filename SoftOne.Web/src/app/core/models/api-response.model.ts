export interface ApiSuccessResponse<T> {
  success: boolean;
  data: T;
}

export interface ErrorResponse {
  success: boolean;
  message: string;
  errors: string[];
}
