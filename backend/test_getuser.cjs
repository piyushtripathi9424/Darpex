require('dotenv').config({ path: '.env' });
global.WebSocket = require('ws');
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false }
});

async function run() {
  const { data } = await supabase.auth.signInWithPassword({
      email: "flow@test.com", password: "password123"
  });
  const token = data.session.access_token;
  
  // Create a fresh client
  const supabase2 = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
  
  // Call getUser
  await supabase2.auth.getUser(token);
  
  // Query vehicles
  const { data: v, error: err } = await supabase2.from('vehicles').select('*');
  console.log("Vehicles 2:", v, err);
}
run();
