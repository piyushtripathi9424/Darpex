import { apiClient } from './client';
import { CustomerCar } from '../types';
import { ServiceItem } from '../types';

export interface BookingResponse {
  id: string;
  bookingNumber: string;
  vehicle: CustomerCar;
  services: ServiceItem[];
  date: string;
  timeSlot: string;
  totalPrice: number;
  status: string;
  paymentStatus: string;
  transactionId?: string;
  createdAt: string;
}

export const createBooking = async (data: {
  vehicle_id: string;
  service_ids: string[];
  date: string;
  time_slot: string;
  total_amount: number;
  transaction_id?: string;
}): Promise<BookingResponse> => {
  const response = await apiClient.post('/bookings', data);
  return response.data.booking;
};

export const getBookings = async (): Promise<BookingResponse[]> => {
  const response = await apiClient.get('/bookings');
  return response.data;
};

export const cancelBooking = async (id: string): Promise<void> => {
  await apiClient.patch(`/bookings/${id}/status`, { status: 'Cancelled' });
};
