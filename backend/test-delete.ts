import { supabase } from './src/config/supabase';
async function run() {
  const { data, error } = await supabase.from('vehicles').delete().eq('id', '58b9b4b2-ba44-4984-9270-a07ebf40116a');
  console.log('Data:', data, 'Error:', error);
}
run();
