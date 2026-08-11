import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import ws from 'ws';

dotenv.config();

(global as any).WebSocket = ws;

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.warn('Missing Supabase credentials. Backend will fail to connect to DB.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
