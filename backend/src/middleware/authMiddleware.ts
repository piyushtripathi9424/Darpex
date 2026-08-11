import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabase';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const requireAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Missing or invalid authorization header' });
      return;
    }

    const token = authHeader.split(' ')[1];

    // Verify token using Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      res.status(401).json({ error: 'Unauthorized: Invalid token' });
      return;
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ error: 'Internal server error during authentication' });
  }
};

export const requireAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  // First ensure they are authenticated
  await requireAuth(req, res, async () => {
    try {
      // Check if user has admin role in profiles table
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', req.user.id)
        .single();

      if (error || !profile || profile.role !== 'admin') {
        res.status(403).json({ error: 'Forbidden: Admin access required' });
        return;
      }
      next();
    } catch (error) {
      res.status(500).json({ error: 'Internal server error checking permissions' });
    }
  });
};
