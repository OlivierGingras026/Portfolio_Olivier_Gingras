import axios, { AxiosError } from 'axios';

export class APIError extends Error {
  statusCode?: number;
  backendMessage?: string;
  retryAfterSeconds?: number;

  constructor(message: string, statusCode?: number, backendMessage?: string, retryAfterSeconds?: number) {
    super(message);
    this.name = 'APIError';
    this.statusCode = statusCode;
    this.backendMessage = backendMessage;
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

export function handleAPIError(error: unknown): APIError {
  console.log('Full error object:', error);

  interface AxiosErrorResponse {
    response?: {
      status?: number;
      statusText?: string;
      data?: unknown;
    };
    message?: string;
  }

  const axiosError = error as AxiosErrorResponse;
  const statusCode = axiosError?.response?.status;
  const statusText = axiosError?.response?.statusText;
  const responseData = axiosError?.response?.data;

  console.log('Status Code:', statusCode);
  console.log('Status Text:', statusText);
  console.log('Response Data:', responseData);

  // Handle 401 Unauthorized
  if (statusCode === 401) {
    return new APIError(
      'Your session has expired. Please log in again.',
      401,
      'Authentication required'
    );
  }

  // Handle 403 Forbidden
  if (statusCode === 403) {
    return new APIError(
      'You do not have permission to perform this action.',
      403,
      'Permission denied'
    );
  }

  // Handle 429 Too Many Requests
  if (statusCode === 429) {
    let retryAfterSeconds = 0;
    // Try to get retry-after from response body
    if (typeof responseData === 'object' && responseData !== null) {
      const data = responseData as Record<string, unknown>;
      retryAfterSeconds = (data.retryAfterSeconds as number) || 0;
    }
    return new APIError(
      'rate_limit_error',
      429,
      'Too many requests',
      retryAfterSeconds
    );
  }

  // Try to extract message from various backend response formats
  let backendMessage: string | undefined;

  if (typeof responseData === 'object' && responseData !== null) {
    const data = responseData as Record<string, unknown>;
    backendMessage =
      (data.message as string) || (data.error as string) || (data.errorMessage as string);
  } else if (typeof responseData === 'string') {
    backendMessage = responseData;
  }

  // Build display message
  let displayMessage: string;
  if (backendMessage) {
    displayMessage = backendMessage;
  } else if (statusCode && statusText) {
    displayMessage = `Request failed with status code ${statusCode}: ${statusText}`;
  } else if (statusCode) {
    displayMessage = `Request failed with status code ${statusCode}`;
  } else {
    displayMessage = axiosError?.message || 'An error occurred. Please try again.';
  }

  console.log('Display Message:', displayMessage);

  return new APIError(displayMessage, statusCode, backendMessage);
}

export function getErrorMessage(error: unknown): string {
  // Check if it's our custom APIError first
  if (error instanceof APIError) {
    return error.message;
  }

  // Handles both Axios errors and generic errors
  if (typeof error === 'string') {
    // Direct string error (rare, but possible)
    return error;
  }
  if (axios.isAxiosError(error)) {
    const response = (error as AxiosError).response;
    if (response) {
      if (response.data) {
        if (typeof response.data === 'string') {
          // Plain string error from backend
          return response.data;
        } else if (typeof response.data === 'object' && (response.data as Record<string, unknown>).message) {
          // JSON error with message property
          return (response.data as Record<string, unknown>).message as string;
        }
      }
      // Fallback to status text if no message
      return response.statusText || 'An error occurred';
    }
    // Fallback to error.message if no response
    return (error as AxiosError).message || 'An error occurred';
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }
  return 'An error occurred';
}
