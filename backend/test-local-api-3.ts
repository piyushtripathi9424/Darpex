import jwt from 'jsonwebtoken';
import fetch from 'node-fetch';

async function run() {
  try {
    const token = jwt.sign({ id: '0375dfff-635a-48d9-b40b-7e69fc06a526', role: 'admin' }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '1h' });
    console.log('Token generated');

    const custRes = await fetch('http://localhost:5001/api/admin/customers', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const custData = await custRes.text();
    console.log('Customers HTTP:', custRes.status);
    try { console.log(JSON.parse(custData).length, 'items') } catch(e) { console.log('Cust body:', custData) }

    const bookRes = await fetch('http://localhost:5001/api/admin/bookings', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const bookData = await bookRes.text();
    console.log('Bookings HTTP:', bookRes.status);
    try { console.log(JSON.parse(bookData).length, 'items') } catch(e) { console.log('Book body:', bookData) }
  } catch(e) {
    console.error(e);
  }
}
run();
