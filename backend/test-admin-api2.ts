import fetch from 'node-fetch';

async function run() {
  try {
    const loginRes = await fetch('http://localhost:5001/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@darpex.com', password: 'adminpassword' })
    });
    const loginData = await loginRes.json();
    console.log(loginData);
    if (!loginData.session) return;
    const token = loginData.session.access_token;
    
    const bookingsRes = await fetch('http://localhost:5001/api/admin/bookings', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const bookingsData = await bookingsRes.json();
    console.log('Admin Bookings API Response length:', bookingsData.length);
    console.log(JSON.stringify(bookingsData, null, 2));
  } catch (e) {
    console.error(e);
  }
}
run();
