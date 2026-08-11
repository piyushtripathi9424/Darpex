import { apiClient } from './client';

export interface Service {
  id: string;
  name: string;
  category: 'Cleaning' | 'Protection' | 'Modification';
  description: string;
  price: number;
  image_url?: string;
  active: boolean;
}

export const getServices = async (): Promise<Service[]> => {
  const response = await apiClient.get('/services');
  return response.data;
};
