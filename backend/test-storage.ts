import { supabase } from './src/config/supabase';
async function run() {
  const { data, error } = await supabase.storage.getBucket('service-images');
  console.log('Bucket check:', data, 'Error:', error);
  if (error) {
    console.log("Creating bucket...");
    const res = await supabase.storage.createBucket('service-images', { public: true });
    console.log("Create result:", res);
  }
}
run();
