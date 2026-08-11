import { supabase } from './src/config/supabase';
async function run() {
  const { error } = await supabase.from('profiles').upsert({
    id: '00000000-0000-0000-0000-000000000000',
    name: 'Test',
    phone: '123',
    role: 'admin'
  });
  console.log('Error:', error);
}
run();
