import { supabase } from './src/config/supabase';
async function run() {
  const { data, error } = await supabase.rpc('get_service_categories_or_something');
  console.log('Error:', error);
}
run();
