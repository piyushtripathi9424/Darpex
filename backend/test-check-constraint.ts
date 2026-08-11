import { supabase } from './src/config/supabase';
async function run() {
  const { data, error } = await supabase.from('services').insert({
    name: 'Test', 
    category: 'interior', 
    description: 'Test desc', 
    price: 999 
  });
  console.log('Error:', error);
}
run();
