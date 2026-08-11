import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { z } from 'zod';

const createBookingSchema = z.object({
  vehicle_id: z.string().uuid(),
  service_ids: z.array(z.string().uuid()).min(1),
  date: z.string().min(1),
  time_slot: z.string().min(1),
  total_amount: z.number().int().min(0),
  transaction_id: z.string().optional()
});

export const createBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const validatedData = createBookingSchema.parse(req.body);

    const bookingNumber = `PC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // 1. Insert into bookings
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        booking_number: bookingNumber,
        user_id: userId,
        vehicle_id: validatedData.vehicle_id,
        date: validatedData.date,
        time_slot: validatedData.time_slot,
        total_amount: validatedData.total_amount,
        status: 'Confirmed',
        payment_status: validatedData.transaction_id ? 'Verified' : 'Pending',
        transaction_id: validatedData.transaction_id || null
      })
      .select()
      .single();

    if (bookingError || !booking) {
      res.status(500).json({ error: 'Failed to create booking', details: bookingError });
      return;
    }

    // 2. Insert into booking_services
    const bookingServicesData = validatedData.service_ids.map(serviceId => ({
      booking_id: booking.id,
      service_id: serviceId
    }));

    const { error: servicesError } = await supabase
      .from('booking_services')
      .insert(bookingServicesData);

    if (servicesError) {
      // Best effort deletion of the booking if services fail
      await supabase.from('bookings').delete().eq('id', booking.id);
      res.status(500).json({ error: 'Failed to link services to booking', details: servicesError });
      return;
    }

    res.status(201).json({ message: 'Booking created successfully', booking });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation failed', details: error.errors });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

export const getUserBookings = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;

    const { data: bookings, error } = await supabase
      .from('bookings')
      .select(`
        *,
        vehicles (*),
        booking_services (
          services (*)
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      res.status(500).json({ error: 'Failed to fetch bookings', details: error });
      return;
    }

    // Transform for frontend
    const formattedBookings = bookings.map((b: any) => ({
      id: b.id,
      bookingNumber: b.booking_number,
      vehicle: b.vehicles,
      services: b.booking_services.map((bs: any) => bs.services),
      date: b.date,
      timeSlot: b.time_slot,
      totalPrice: b.total_amount,
      status: b.status,
      paymentStatus: b.payment_status,
      transactionId: b.transaction_id,
      createdAt: b.created_at
    }));

    res.status(200).json(formattedBookings);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateBookingStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const { id } = req.params;
    const { status } = req.body;

    const { data, error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      res.status(400).json({ error: 'Failed to update booking status', details: error });
      return;
    }

    res.status(200).json({ message: 'Booking updated', booking: data });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
