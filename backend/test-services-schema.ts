import { supabase } from './src/config/supabase';
async function run() {
  const { data, error } = await supabase.from('services').select('*').limit(1);
  console.log('Data:', data, 'Error:', error);
}
run();
