import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { createClient } from '@supabase/supabase-js';

const createAuthClient = () => createClient(
  process.env.SUPABASE_URL || '', 
  process.env.SUPABASE_SERVICE_ROLE_KEY || '', 
  { auth: { persistSession: false, autoRefreshToken: false } }
);

// Get all bookings across all users
export const getAllBookings = async (req: Request, res: Response): Promise<void> => {
  try {
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select(`
        *,
        profiles (name, phone),
        vehicles (*),
        booking_services (
          services (*)
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      res.status(500).json({ error: 'Failed to fetch all bookings', details: error });
      return;
    }

    // Transform for frontend Admin Dashboard
    const formattedBookings = bookings.map((b: any) => ({
      id: b.id,
      bookingNumber: b.booking_number,
      customerName: b.profiles?.name || 'Unknown',
      customerEmail: 'Unknown',
      customerPhone: b.profiles?.phone || 'Unknown',
      vehicle: b.vehicles || null,
      services: Array.isArray(b.booking_services) ? b.booking_services.map((bs: any) => bs.services) : [],
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

// Get all customers
export const getAllCustomers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { data: customers, error } = await supabase
      .from('profiles')
      .select(`
        id,
        name,
        phone,
        role,
        created_at,
        vehicles (*),
        bookings (
          id,
          date,
          status,
          total_amount,
          booking_services (
            services (name)
          )
        )
      `)
      .eq('role', 'customer')
      .order('created_at', { ascending: false });

    if (error) {
      res.status(500).json({ error: 'Failed to fetch customers', details: error });
      return;
    }

    const formattedCustomers = customers.map((c: any) => {
      const totalSpent = c.bookings ? c.bookings.reduce((sum: number, b: any) => sum + (b.total_amount || 0), 0) : 0;
      return {
        id: c.id,
        name: c.name || 'Unknown',
        email: 'Unknown',
        phone: c.phone || 'N/A',
        registeredCars: c.vehicles || [],
        totalSpent,
        status: totalSpent > 10000 ? 'VIP Executive Member' : 'Standard Member',
        createdAt: c.created_at,
        serviceHistory: Array.isArray(c.bookings) ? c.bookings.map((b: any) => ({
          id: b.id,
          date: b.date,
          status: b.status,
          serviceNames: Array.isArray(b.booking_services) ? b.booking_services.map((bs: any) => bs.services?.name).filter(Boolean) : []
        })) : []
      };
    });

    res.status(200).json(formattedCustomers);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update Booking Status
export const updateBookingStatusAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const { data, error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      res.status(400).json({ error: 'Failed to update booking status', details: error });
      return;
    }

    res.status(200).json({ message: 'Booking status updated', booking: data });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update Booking Slot
export const updateBookingSlotAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { date, timeSlot } = req.body;

    const { data, error } = await supabase
      .from('bookings')
      .update({ date, time_slot: timeSlot })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      res.status(400).json({ error: 'Failed to update booking slot', details: error });
      return;
    }

    res.status(200).json({ message: 'Booking slot updated', booking: data });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Verify Booking Payment
export const verifyBookingPaymentAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('bookings')
      .update({ payment_status: 'Verified' })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      res.status(400).json({ error: 'Failed to verify payment', details: error });
      return;
    }

    res.status(200).json({ message: 'Payment verified', booking: data });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete Booking
export const deleteBookingAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', id);

    if (error) {
      res.status(400).json({ error: 'Failed to delete booking', details: error });
      return;
    }

    res.status(200).json({ message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Admin Login (Validates an admin credentials and returns token)
export const adminLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    
    // Authenticate with Supabase
    const authClient = createAuthClient();
    const { data, error } = await authClient.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    // Verify role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      res.status(403).json({ error: 'Unauthorized: Admin access required' });
      return;
    }

    res.status(200).json({ 
      message: 'Admin login successful', 
      session: data.session,
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.name || 'Admin',
        role: 'admin'
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// --- SERVICE MANAGEMENT ---

const mapCategoryForDB = (cat: string): string => {
  const lower = (cat || '').toLowerCase();
  if (lower.includes('interior') || lower.includes('detail') || lower.includes('clean')) return 'Cleaning';
  if (lower.includes('coat') || lower.includes('ppf') || lower.includes('protect')) return 'Protection';
  if (lower.includes('mod')) return 'Modification';
  return 'Cleaning'; // Default fallback
};

export const createService = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, category, description, price, image_url } = req.body;
    
    const { data, error } = await supabase
      .from('services')
      .insert({
        name,
        category: mapCategoryForDB(category),
        description,
        price,
        image_url,
        active: true
      })
      .select()
      .single();

    if (error) {
      res.status(400).json({ error: 'Failed to create service', details: error });
      return;
    }

    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateService = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { price, name, active, image_url, description, category } = req.body;

    const { data, error } = await supabase
      .from('services')
      .update({ price, name, active, image_url, description, category: mapCategoryForDB(category) })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      res.status(400).json({ error: 'Failed to update service', details: error });
      return;
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteService = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Hard delete or soft delete? We'll soft delete to keep past bookings intact
    const { error } = await supabase
      .from('services')
      .update({ active: false })
      .eq('id', id);

    if (error) {
      res.status(400).json({ error: 'Failed to delete service', details: error });
      return;
    }

    res.status(200).json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// --- ADMIN REGISTRATION FLOW ---

export const registerAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, phone, password, inviteCode } = req.body;

    // Check the secret invite code
    const EXPECTED_INVITE_CODE = process.env.ADMIN_INVITE_CODE || 'DARPEX-ADMIN-2026';
    if (inviteCode !== EXPECTED_INVITE_CODE) {
      res.status(403).json({ error: 'Invalid secret invite code.' });
      return;
    }

    // Check if user already exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single();

    if (existingProfile) {
      res.status(400).json({ error: 'An account with this email already exists.' });
      return;
    }

    // Immediately create the user in Supabase Auth
    let userId;
    const authClient = createAuthClient();
    const { data: authData, error: signUpError } = await authClient.auth.signUp({
      email,
      password,
      options: {
        data: { name, role: 'admin' }
      }
    });

    if (signUpError) {
      // If user already exists in auth but not in profiles (e.g. from a previous failed attempt),
      // we can try to log them in and update their role, or just return the error.
      if (signUpError.message.includes('already registered')) {
         // Attempt to sign in instead to get the session and user ID
         const { data: signInData, error: signInError } = await authClient.auth.signInWithPassword({
           email, password
         });
         
         if (signInError || !signInData.user) {
           res.status(400).json({ error: 'User already registered. Try logging in instead.', details: signInError });
           return;
         }
         
         userId = signInData.user.id;
         authData.session = signInData.session;
      } else {
        res.status(400).json({ error: 'Failed to create admin user', details: signUpError });
        return;
      }
    } else {
      userId = authData.user!.id;
    }

    // Insert or update profiles with 'admin' role
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        name,
        phone,
        role: 'admin'
      });

    if (profileError) {
      res.status(500).json({ error: 'Failed to create admin profile. The profiles table might not support some fields.', details: profileError });
      return;
    }

    res.status(201).json({ 
      message: 'Admin account created successfully.',
      session: authData.session,
      user: {
        id: userId,
        email,
        name,
        role: 'admin'
      }
    });
  } catch (error) {
    console.error('Error registering admin:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const uploadServiceImage = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No image file provided' });
      return;
    }

    const file = req.file;
    const originalName = file.originalname || 'image.jpg';
    const fileExt = originalName.split('.').pop() || 'jpg';
    const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}.${fileExt}`;
    const filePath = `services/${fileName}`;

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
    console.error('Image upload error:', error);
    res.status(500).json({ error: 'Internal server error during upload' });
  }
};
