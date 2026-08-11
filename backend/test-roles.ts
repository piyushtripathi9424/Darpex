import { supabase } from './src/config/supabase';
async function run() {
  const { data, error } = await supabase.from('profiles').select('*');
  console.log('Profiles:', data, 'Error:', error);
}
run();
