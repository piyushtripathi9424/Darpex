import { supabase } from './src/config/supabase';
async function run() {
  const { data, error } = await supabase.from('profiles').select('*').ilike('name', '%Piyush%');
  console.log('Data:', data, 'Error:', error);
}
run();
