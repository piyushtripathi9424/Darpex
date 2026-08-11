require('dotenv').config({ path: '.env' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
  const { data: user } = await supabase.from('profiles').select('id, name').eq('email', 'yejeg66485@ayable.com').single();
  if (user) {
    const { data: bookings } = await supabase.from('bookings').select('*, vehicles(*)').eq('user_id', user.id);
    console.log("Bookings:", JSON.stringify(bookings, null, 2));
  } else {
    console.log("User not found");
  }
}
check();
