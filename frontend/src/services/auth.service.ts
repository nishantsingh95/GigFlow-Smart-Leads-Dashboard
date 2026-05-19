import { api } from './api';
import { ApiResponse, AuthResponse, User } from '@/types';

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role?: 'admin' | 'sales';
}

export interface LoginPayload {
  email: string;
  password: string;
}

export const authService = {
  register: async (payload: RegisterPayload) => {
    const { data } = await api.post<ApiResponse<AuthResponse>>('/auth/register', payload);
    return data;
  },

  login: async (payload: LoginPayload) => {
    const { data } = await api.post<ApiResponse<AuthResponse>>('/auth/login', payload);
    return data;
  },

  getMe: async () => {
    const { data } = await api.get<ApiResponse<{ user: User }>>('/auth/me');
    return data;
  },
};
