import { apiClient } from './client';

export const registerUser = async (data: any) => {
  const response = await apiClient.post('/auth/register', data);
  return response.data;
};

export const loginUser = async (data: any) => {
  const response = await apiClient.post('/auth/login', data);
  return response.data;
};

export const getMe = async () => {
  const response = await apiClient.get('/auth/me');
  return response.data;
};
