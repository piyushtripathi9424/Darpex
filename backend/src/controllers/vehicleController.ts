import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { z } from 'zod';

const vehicleSchema = z.object({
  make: z.string().min(1),
  model: z.string().min(1),
  registration_number: z.string().min(1),
  year: z.number().int().min(1900).max(new Date().getFullYear() + 1).optional(),
  color: z.string().optional(),
  image_url: z.string().url().optional(),
});

export const getVehicles = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;

    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      res.status(500).json({ error: 'Failed to fetch vehicles', details: error });
      return;
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const addVehicle = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const validatedData = vehicleSchema.parse(req.body);

    const { data, error } = await supabase
      .from('vehicles')
      .insert([
        {
          user_id: userId,
          ...validatedData
        }
      ])
      .select()
      .single();

    if (error) {
      res.status(400).json({ error: 'Failed to add vehicle', details: error });
      return;
    }

    res.status(201).json({ message: 'Vehicle added successfully', vehicle: data });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation failed', details: error.errors });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

export const updateVehicle = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const { id } = req.params;
    const validatedData = vehicleSchema.partial().parse(req.body); // Allow partial updates

    const { data, error } = await supabase
      .from('vehicles')
      .update(validatedData)
      .eq('id', id)
      .eq('user_id', userId) // Ensure it belongs to the user
      .select()
      .single();

    if (error || !data) {
      res.status(404).json({ error: 'Vehicle not found or unauthorized' });
      return;
    }

    res.status(200).json({ message: 'Vehicle updated successfully', vehicle: data });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation failed', details: error.errors });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

export const deleteVehicle = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const { id } = req.params;

    // Check bookings for this vehicle
    const { data: bookings, error: checkError } = await supabase
      .from('bookings')
      .select('id, status')
      .eq('vehicle_id', id);

    if (checkError) {
      res.status(500).json({ error: 'Failed to verify vehicle status' });
      return;
    }

    const hasNonCancelled = bookings && bookings.some(b => b.status !== 'Cancelled');

    if (hasNonCancelled) {
      res.status(400).json({ error: 'Cannot delete a vehicle that has active bookings or service history.' });
      return;
    }

    // Delete any cancelled bookings first to satisfy foreign key constraints
    if (bookings && bookings.length > 0) {
      const { error: deleteBookingsError } = await supabase
        .from('bookings')
        .delete()
        .eq('vehicle_id', id);

      if (deleteBookingsError) {
        res.status(400).json({ error: 'Failed to clear cancelled bookings', details: deleteBookingsError });
        return;
      }
    }

    const { error } = await supabase
      .from('vehicles')
      .delete()
      .eq('id', id)
      .eq('user_id', userId); // Ensure it belongs to the user

    if (error) {
      res.status(400).json({ error: 'Failed to delete vehicle', details: error });
      return;
    }

    res.status(200).json({ message: 'Vehicle deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const uploadVehicleImage = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No image file provided' });
      return;
    }

    const file = req.file;
    const originalName = file.originalname || 'image.jpg';
    const fileExt = originalName.split('.').pop() || 'jpg';
    const fileName = `vehicle-${Date.now()}-${Math.round(Math.random() * 1e9)}.${fileExt}`;
    const filePath = `vehicles/${fileName}`;

    const { data, error } = await supabase.storage
      .from('service-images')
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false
      });

    if (error) {
      res.status(500).json({ error: 'Failed to upload image to storage', details: error });
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('service-images')
      .getPublicUrl(filePath);

    res.status(200).json({ url: publicUrl });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
