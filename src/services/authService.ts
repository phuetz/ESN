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
  token: string;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);

    if (response.success && response.data) {
      apiClient.setToken(response.data.token);
      return response.data;
    }

    throw new Error('Login failed');
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);

    if (response.success && response.data) {
      apiClient.setToken(response.data.token);
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

  logout() {
    apiClient.setToken(null);
  },

  isAuthenticated(): boolean {
    return !!apiClient.getToken();
  },

  getToken(): string | null {
    return apiClient.getToken();
  },
};
