import { apiClient } from './client';

export interface Vehicle {
  id: string;
  user_id: string;
  make: string;
  model: string;
  registration_number: string;
  year?: number;
  color?: string;
  image_url?: string;
}

export const getVehicles = async (): Promise<Vehicle[]> => {
  const response = await apiClient.get('/vehicles');
  return response.data;
};

export const addVehicle = async (data: Partial<Vehicle>): Promise<Vehicle> => {
  const response = await apiClient.post('/vehicles', data);
  return response.data.vehicle;
};

export const updateVehicle = async (id: string, data: Partial<Vehicle>): Promise<Vehicle> => {
  const response = await apiClient.put(`/vehicles/${id}`, data);
  return response.data.vehicle;
};

export const deleteVehicle = async (id: string): Promise<void> => {
  await apiClient.delete(`/vehicles/${id}`);
};

export const uploadVehicleImage = async (file: File): Promise<{ url: string }> => {
  const formData = new FormData();
  formData.append('image', file);
  
  const response = await apiClient.post('/vehicles/upload/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
