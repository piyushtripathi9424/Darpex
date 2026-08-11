import { apiClient } from './client';
import { ServiceBooking, CustomerCar } from '../types';

export interface AdminCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  registeredCars: CustomerCar[];
  totalSpent: number;
  status: string;
  createdAt: string;
  serviceHistory?: {
    id: string;
    date: string;
    status: string;
    serviceNames: string[];
  }[];
}

export const adminLogin = async (email: string, password: string) => {
  const response = await apiClient.post('/admin/login', { email, password });
  return response.data;
};

export const registerAdmin = async (data: any) => {
  const response = await apiClient.post('/admin/register', data);
  return response.data;
};

export const getAdminBookings = async (): Promise<ServiceBooking[]> => {
  const response = await apiClient.get('/admin/bookings');
  return response.data;
};

export const getAdminCustomers = async (): Promise<AdminCustomer[]> => {
  const response = await apiClient.get('/admin/customers');
  return response.data;
};

export const updateAdminBookingStatus = async (bookingId: string, status: string): Promise<any> => {
  const response = await apiClient.put(`/admin/bookings/${bookingId}/status`, { status });
  return response.data;
};

export const updateAdminBookingSlot = async (bookingId: string, date: string, timeSlot: string): Promise<any> => {
  const response = await apiClient.put(`/admin/bookings/${bookingId}/slot`, { date, timeSlot });
  return response.data;
};

export const verifyAdminBookingPayment = async (bookingId: string): Promise<any> => {
  const response = await apiClient.put(`/admin/bookings/${bookingId}/payment`);
  return response.data;
};

export const deleteAdminBooking = async (bookingId: string): Promise<void> => {
  await apiClient.delete(`/admin/bookings/${bookingId}`);
};

export const createAdminService = async (serviceData: any): Promise<any> => {
  const response = await apiClient.post(`/admin/services`, serviceData);
  return response.data;
};

export const updateAdminService = async (serviceId: string, serviceData: any): Promise<any> => {
  const response = await apiClient.put(`/admin/services/${serviceId}`, serviceData);
  return response.data;
};

export const deleteAdminService = async (serviceId: string): Promise<void> => {
  await apiClient.delete(`/admin/services/${serviceId}`);
};

export const uploadAdminImage = async (file: File): Promise<{ url: string }> => {
  const formData = new FormData();
  formData.append('image', file);
  
  const response = await apiClient.post('/admin/upload/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
