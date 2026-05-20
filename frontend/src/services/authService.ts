import api from './api';
import { AuthResponse, LoginData, RegisterData, User, ApiResponse } from '../types';

export const authService = {
  async register(data: RegisterData): Promise<AuthResponse> {
    const res = await api.post<ApiResponse<AuthResponse>>('/auth/register', data);
    return res.data.data!;
  },

  async login(data: LoginData): Promise<AuthResponse> {
    const res = await api.post<ApiResponse<AuthResponse>>('/auth/login', data);
    return res.data.data!;
  },

  async getMe(): Promise<User> {
    const res = await api.get<ApiResponse<{ user: User }>>('/auth/me');
    return res.data.data!.user;
  },

  async getUsers(): Promise<User[]> {
    const res = await api.get<ApiResponse<{ users: User[] }>>('/auth/users');
    return res.data.data!.users;
  },

  async updateRole(userId: string, role: 'admin' | 'sales'): Promise<User> {
    const res = await api.patch<ApiResponse<{ user: User }>>(`/auth/users/${userId}/role`, { role });
    return res.data.data!.user;
  },
};
