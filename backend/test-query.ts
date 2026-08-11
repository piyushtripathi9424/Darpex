import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();
const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

async function run() {
  const { data, error } = await supabase.from('profiles').select('*').eq('email', 'piyush.tripathi4346@gmail.com');
  console.log('Profile:', data, error);
}
run();
