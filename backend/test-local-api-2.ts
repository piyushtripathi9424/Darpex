import fetch from 'node-fetch';

async function run() {
  try {
    const loginRes = await fetch('http://localhost:5001/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@darpex.com', password: 'password123' })
    });
    const loginData = await loginRes.json();
    const token = loginData.token;
    
    if (!token) {
      console.log('Login failed:', loginData);
      return;
    }

    console.log('Logged in!');
    
    const custRes = await fetch('http://localhost:5001/api/admin/customers', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const custData = await custRes.json();
    console.log('Customers res status:', custRes.status);
    console.log('Customers count:', custData?.length, custData.error ? custData : '');

    const bookRes = await fetch('http://localhost:5001/api/admin/bookings', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const bookData = await bookRes.json();
    console.log('Bookings res status:', bookRes.status);
    console.log('Bookings count:', bookData?.length, bookData.error ? bookData : '');
  } catch(e) {
    console.error(e);
  }
}
run();
