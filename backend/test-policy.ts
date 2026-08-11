import { supabase } from './src/config/supabase';
async function run() {
  const { data, error } = await supabase.rpc('get_policies', { table_name: 'profiles' }).select('*');
  console.log('Policies:', data, 'Error:', error);
}
run();
