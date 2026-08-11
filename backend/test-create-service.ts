import fetch from 'node-fetch';

async function run() {
  try {
    const loginRes = await fetch('http://localhost:5001/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@darpex.com', password: 'admin' }) // I don't know the password
    });
  } catch (e) {
    console.error(e);
  }
}
run();
