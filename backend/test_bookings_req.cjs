const axios = require('axios');
async function run() {
  try {
    const r1 = await axios.post('http://localhost:5001/api/auth/register', {
      name: "Test Flow", email: "flow3@test.com", password: "password123"
    });
    const token = r1.data.session.access_token;
    const r2 = await axios.get('http://localhost:5001/api/bookings', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log("Bookings:", JSON.stringify(r2.data, null, 2));
  } catch (e) {
    console.error("Error:", e.response ? e.response.data : e.message);
  }
}
run();
