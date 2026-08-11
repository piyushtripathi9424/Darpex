import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
// Using cross-fetch to bypass the native websocket issue in this node version
import fetch from 'node-fetch';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
  global: { fetch: fetch as any }
});

async function run() {
  const { error } = await supabase.from('profiles').insert({
    id: '00000000-0000-0000-0000-000000000000',
    name: 'Test',
    email: 'test@test.com',
    phone: '123',
    role: 'admin'
  });
  console.log('Insert error:', error);
}
run();
