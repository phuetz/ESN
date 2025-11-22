import config from '../config';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    details?: any;
  };
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ApiRequestConfig {
  headers?: Record<string, string>;
  params?: Record<string, any>;
}

class ApiClient {
  private baseURL: string;
  private csrfToken: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    // Authentication is now handled via httpOnly cookies (secure against XSS)
    // No client-side token storage required
  }

  /**
   * Fetch CSRF token from server
   * This should be called before making any POST/PUT/DELETE requests
   */
  async fetchCsrfToken(): Promise<void> {
    try {
      const response = await fetch(`${this.baseURL}/csrf-token`, {
        method: 'GET',
        credentials: 'include', // Send cookies
      });

      if (response.ok) {
        // CSRF token is set in cookie by server
        // Also read from response header for client-side storage
        const csrfToken = response.headers.get('X-CSRF-Token');
        if (csrfToken) {
          this.csrfToken = csrfToken;
        }
      }
    } catch (error) {
      console.warn('Failed to fetch CSRF token:', error);
      // Continue anyway - server will return 403 if CSRF is required
    }
  }

  /**
   * Get CSRF token - fetch if not available
   */
  private async getCsrfToken(): Promise<string | null> {
    if (!this.csrfToken) {
      await this.fetchCsrfToken();
    }
    return this.csrfToken;
  }

  private async getHeaders(customHeaders?: Record<string, string>, includeCsrf: boolean = false): Promise<Headers> {
    const headers = new Headers({
      'Content-Type': 'application/json',
      ...customHeaders,
    });

    // Authentication is handled via httpOnly cookies (credentials: 'include')
    // No Authorization header needed

    // Add CSRF token for unsafe methods (POST, PUT, DELETE, PATCH)
    if (includeCsrf) {
      const csrfToken = await this.getCsrfToken();
      if (csrfToken) {
        headers.set('X-CSRF-Token', csrfToken);
      }
    }

    return headers;
  }

  private buildURL(endpoint: string, params?: Record<string, any>): string {
    const url = new URL(`${this.baseURL}${endpoint}`);

    if (params) {
      Object.keys(params).forEach((key) => {
        if (params[key] !== undefined && params[key] !== null) {
          url.searchParams.append(key, String(params[key]));
        }
      });
    }

    return url.toString();
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const contentType = response.headers.get('content-type');
    const isJson = contentType?.includes('application/json');

    if (!response.ok) {
      const error = isJson ? await response.json() : { message: response.statusText };
      throw new Error(error.error?.message || error.message || 'An error occurred');
    }

    if (response.status === 204) {
      return { success: true };
    }

    if (isJson) {
      return await response.json();
    }

    return { success: true } as ApiResponse<T>;
  }

  async get<T>(
    endpoint: string,
    config?: ApiRequestConfig
  ): Promise<ApiResponse<T>> {
    const url = this.buildURL(endpoint, config?.params);
    const headers = await this.getHeaders(config?.headers, false);
    const response = await fetch(url, {
      method: 'GET',
      headers,
      credentials: 'include', // IMPORTANT: Send httpOnly cookies with requests
    });

    // Update CSRF token from response if available
    const csrfToken = response.headers.get('X-CSRF-Token');
    if (csrfToken) {
      this.csrfToken = csrfToken;
    }

    return this.handleResponse<T>(response);
  }

  async post<T>(
    endpoint: string,
    data?: any,
    config?: ApiRequestConfig
  ): Promise<ApiResponse<T>> {
    const url = this.buildURL(endpoint, config?.params);
    const headers = await this.getHeaders(config?.headers, true); // Include CSRF for POST
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
      credentials: 'include', // IMPORTANT: Send httpOnly cookies with requests
    });

    return this.handleResponse<T>(response);
  }

  async put<T>(
    endpoint: string,
    data?: any,
    config?: ApiRequestConfig
  ): Promise<ApiResponse<T>> {
    const url = this.buildURL(endpoint, config?.params);
    const headers = await this.getHeaders(config?.headers, true); // Include CSRF for PUT
    const response = await fetch(url, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
      credentials: 'include', // IMPORTANT: Send httpOnly cookies with requests
    });

    return this.handleResponse<T>(response);
  }

  async delete<T>(
    endpoint: string,
    config?: ApiRequestConfig
  ): Promise<ApiResponse<T>> {
    const url = this.buildURL(endpoint, config?.params);
    const headers = await this.getHeaders(config?.headers, true); // Include CSRF for DELETE
    const response = await fetch(url, {
      method: 'DELETE',
      headers,
      credentials: 'include', // IMPORTANT: Send httpOnly cookies with requests
    });

    return this.handleResponse<T>(response);
  }
}

// Create and export a singleton instance
const apiClient = new ApiClient(
  import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1'
);

export default apiClient;
