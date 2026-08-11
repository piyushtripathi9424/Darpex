import { supabase } from './src/config/supabase';
async function run() {
  const { data, error } = await supabase.from('services').select('category');
  const uniqueCategories = [...new Set(data?.map(d => d.category))];
  console.log('Categories:', uniqueCategories, 'Error:', error);
}
run();
