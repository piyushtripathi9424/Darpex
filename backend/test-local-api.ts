import fetch from 'node-fetch';

async function run() {
  try {
    const loginRes = await fetch('http://localhost:5001/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@darpex.com', password: 'password123' })
    });
    const { token } = await loginRes.json();
    
    if (!token) {
      console.log('Login failed');
      return;
    }

    const custRes = await fetch('http://localhost:5001/api/admin/customers', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const custData = await custRes.json();
    console.log('Customers count:', custData?.length, custData.error ? custData : '');

    const bookRes = await fetch('http://localhost:5001/api/admin/bookings', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const bookData = await bookRes.json();
    console.log('Bookings count:', bookData?.length, bookData.error ? bookData : '');
  } catch(e) {
    console.error(e);
  }
}
run();
