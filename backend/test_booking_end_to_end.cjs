const axios = require('axios');
async function run() {
  try {
    // 1. Register
    const r1 = await axios.post('http://localhost:5001/api/auth/register', {
      name: "Booking Test", email: "bookingtest@test.com", password: "password123"
    });
    const token = r1.data.session.access_token;
    
    // 2. Get Services to get a valid service UUID
    const r2 = await axios.get('http://localhost:5001/api/services');
    const serviceId = r2.data[0].id;
    
    // 3. Add a vehicle
    const r3 = await axios.post('http://localhost:5001/api/vehicles', {
      make: "Tesla", model: "Model S", year: 2024, color: "Black", registration_number: "TSLA-01"
    }, { headers: { Authorization: `Bearer ${token}` } });
    const vehicleId = r3.data.vehicle.id;

    // 4. Create booking
    console.log("Attempting booking with:", { vehicle_id: vehicleId, service_ids: [serviceId] });
    const r4 = await axios.post('http://localhost:5001/api/bookings', {
      vehicle_id: vehicleId,
      service_ids: [serviceId],
      date: "12 August 2026",
      time_slot: "3:00 PM",
      total_amount: 499
    }, { headers: { Authorization: `Bearer ${token}` } });
    
    console.log("Booking successful!", r4.data);
  } catch (e) {
    console.error("Booking Error:", e.response ? JSON.stringify(e.response.data, null, 2) : e.message);
  }
}
run();
