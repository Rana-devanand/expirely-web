import { api } from './api';

export const userService = {
  getAllUsers: async () => {
    const response = await api.get<any>('/users');
    return response.data;
  },
  
  updateUserStatus: async (userId: string, status: 'active' | 'blocked') => {
    const response = await api.put<any>(`/users/${userId}/status`, { status });
    return response.data;
  }
};
