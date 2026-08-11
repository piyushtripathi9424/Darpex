require('dotenv').config({ path: '.env' });
global.WebSocket = require('ws');
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false }
});

async function run() {
  // Try sign in
  const { data, error } = await supabase.auth.signInWithPassword({
      email: "flow@test.com", password: "password123"
  });
  console.log("Login user:", data?.user?.email);
  // Now try vehicles query. If it leaked, it will fail with infinite recursion.
  // If it didn't leak, it will use service_role and succeed with []
  const { data: v, error: err } = await supabase.from('vehicles').select('*');
  console.log("Vehicles:", v, err);
}
run();
