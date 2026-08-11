require('dotenv').config({ path: '.env' });
global.WebSocket = require('ws');
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
async function run() {
  const { data: profiles } = await supabase.from('profiles').select('*');
  console.log("Profiles:", profiles);
  const { data: users } = await supabase.auth.admin.listUsers();
  console.log("Users:", users.users.map(u => ({ email: u.email, id: u.id })));
}
run();
