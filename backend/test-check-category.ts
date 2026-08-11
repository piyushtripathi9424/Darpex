import { supabase } from './src/config/supabase';
async function run() {
  const { data, error } = await supabase.from('services').select('category').limit(5);
  console.log('Categories:', data, 'Error:', error);
}
run();
