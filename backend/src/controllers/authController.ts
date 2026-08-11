import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';

const createAuthClient = () => createClient(process.env.SUPABASE_URL || '', process.env.SUPABASE_SERVICE_ROLE_KEY || '', {
  auth: { persistSession: false, autoRefreshToken: false }
});

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
  phone: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = registerSchema.parse(req.body);
    
    // 1. Create user in Supabase Auth
    const localClient = createAuthClient();
    const { data: authData, error: authError } = await localClient.auth.signUp({
      email: validatedData.email,
      password: validatedData.password,
    });

    if (authError || !authData.user) {
      res.status(400).json({ error: authError?.message || 'Failed to register user.' });
      return;
    }

    // 2. Create Profile row
    const { error: profileError } = await supabase.from('profiles').insert([
      {
        id: authData.user.id,
        name: validatedData.name,
        phone: validatedData.phone,
        role: 'customer' // default role
      }
    ]);

    if (profileError) {
      res.status(500).json({ error: 'Failed to create user profile.', details: profileError });
      return;
    }

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: authData.user.id,
        email: authData.user.email,
        name: validatedData.name
      },
      session: authData.session
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation failed', details: error.errors });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = loginSchema.parse(req.body);

    const localClient = createAuthClient();
    const { data: authData, error: authError } = await localClient.auth.signInWithPassword({
      email: validatedData.email,
      password: validatedData.password,
    });

    if (authError || !authData.user || !authData.session) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    // Fetch profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    res.status(200).json({
      message: 'Login successful',
      token: authData.session.access_token,
      user: {
        id: authData.user.id,
        email: authData.user.email,
        name: profile?.name,
        role: profile?.role
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation failed', details: error.errors });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !profile) {
      res.status(404).json({ error: 'User profile not found' });
      return;
    }

    res.status(200).json({ profile });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
