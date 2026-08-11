import { supabase } from './src/config/supabase';
async function run() {
  const { data, error } = await supabase
    .from('profiles')
    .upsert({
      id: '20d3cf93-a262-4f1d-abf3-95a9b960088b',
      name: 'Yog Sanghvi',
      phone: '12345',
      role: 'admin'
    });
  console.log('Error:', error);
}
run();
