export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public endpoint?: string,
    public method?: string,
    public details?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';

    // Improve error message with context
    if (endpoint) {
      this.message = `${message} [${method || 'REQUEST'} ${endpoint}]`;
    }
  }

  static fromResponse(
    status: number,
    data: { code?: string; message?: string },
    endpoint?: string,
    method?: string,
  ) {
    return new ApiError(
      status,
      data.code || 'UNKNOWN_ERROR',
      data.message || 'An error occurred',
      endpoint,
      method,
      data,
    );
  }

  isNetworkError() {
    return this.status === 0;
  }

  isUnauthorized() {
    return this.status === 401;
  }

  isForbidden() {
    return this.status === 403;
  }

  isNotFound() {
    return this.status === 404;
  }

  isServerError() {
    return this.status >= 500;
  }
}
