import apiClient, { ApiResponse } from './apiClient';

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  user: User;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);

    if (response.success && response.data) {
      // Authentication is now handled via httpOnly cookies
      // No client-side token storage required
      return response.data;
    }

    throw new Error('Login failed');
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);

    if (response.success && response.data) {
      // Authentication is now handled via httpOnly cookies
      // No client-side token storage required
      return response.data;
    }

    throw new Error('Registration failed');
  },

  async getProfile(): Promise<User> {
    const response = await apiClient.get<User>('/auth/profile');

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error('Failed to fetch profile');
  },

  async logout(): Promise<void> {
    // Call backend to clear httpOnly cookies and invalidate refresh token
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      // Even if logout fails on server, we should still clear local state
      console.warn('Logout request failed:', error);
    }
  },

  async refreshToken(): Promise<void> {
    // Refresh token is in httpOnly cookie, just call the endpoint
    const response = await apiClient.post('/auth/refresh');

    if (!response.success) {
      throw new Error('Token refresh failed');
    }
  },
};
