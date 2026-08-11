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
    `)
    .order('created_at', { ascending: false });
  console.log('Bookings Data:', JSON.stringify(data, null, 2));
}
run();
