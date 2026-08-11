import { supabase } from './src/config/supabase';
async function run() {
  const { data, error } = await supabase
    .from('profiles')
    .select(`
      id,
      name,
      phone,
      role,
      created_at,
      vehicles (*),
      bookings (
        id,
        date,
        status,
        total_amount,
        booking_services (
          services (name)
        )
      )
    `)
    .eq('role', 'customer');
  console.log('Customers Data:', JSON.stringify(data, null, 2));
}
run();
