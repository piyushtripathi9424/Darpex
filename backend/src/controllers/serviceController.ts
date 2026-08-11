import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

export const getServices = async (req: Request, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('active', true)
      .order('category')
      .order('price');

    if (error) {
      res.status(500).json({ error: 'Failed to fetch services', details: error });
      return;
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
