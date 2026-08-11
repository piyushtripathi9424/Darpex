import { supabase } from './src/config/supabase';
async function run() {
  const { data, error } = await supabase.from('bookings').update({ vehicle_id: null }).eq('id', 'c566af32-cfe1-4b1d-9901-1397b1ba9050').select();
  console.log('Data:', data, 'Error:', error);
}
run();
