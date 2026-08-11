import { supabase } from './src/config/supabase';
async function run() {
  const { data, error } = await supabase.from('services').update({ 
    name: 'Test', 
    category: 'Protection', // mapped category
    description: 'Test desc', 
    price: 999 
  }).eq('id', '5507f933-c377-477f-bb30-0b0021d314ae').select().single();
  console.log('Data:', data, 'Error:', error);
}
run();
