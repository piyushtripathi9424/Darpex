import { supabase } from './src/config/supabase';
async function run() {
  const { data, error } = await supabase.from('bookings').select('id, status, vehicle_id');
  console.log('Data:', data, 'Error:', error);
}
run();
