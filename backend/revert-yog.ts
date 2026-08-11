import { supabase } from './src/config/supabase';
async function run() {
  const { data, error } = await supabase
    .from('profiles')
    .update({ role: 'customer', phone: null })
    .eq('id', '20d3cf93-a262-4f1d-abf3-95a9b960088b');
  console.log('Reverted Yog role:', data, error);
}
run();
