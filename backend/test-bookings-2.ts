import { supabase } from './src/config/supabase';
async function run() {
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      profiles!inner(name, phone),
      vehicles (*),
      booking_services (
        services (*)
      )
    `);
  console.log('Bookings Data count:', data?.length, 'Error:', JSON.stringify(error, null, 2));
}
run();
