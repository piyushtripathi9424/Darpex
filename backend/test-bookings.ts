import { supabase } from './src/config/supabase';
async function run() {
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      profiles!inner(name, email, phone),
      vehicles (*),
      booking_services (
        services (*)
      )
    `);
  console.log('Error:', error);
}
run();
