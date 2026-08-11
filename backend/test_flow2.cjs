const axios = require('axios');
async function run() {
  try {
    const r1 = await axios.post('http://localhost:5001/api/auth/register', {
      name: "Test Flow", email: "flow2@test.com", password: "password123"
    });
    console.log("Register:", r1.data.user.name);
    const token = r1.data.session.access_token;
    const r2 = await axios.get('http://localhost:5001/api/vehicles', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log("Vehicles:", r2.data);
  } catch (e) {
    console.error("Error:", e.response ? e.response.data : e.message);
  }
}
run();
