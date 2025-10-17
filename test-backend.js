// Backend Test Script
// Run this to verify all API endpoints are working

const BASE_URL = 'http://localhost:3000';

async function testAPI(method, endpoint, data = null, requiresAuth = false) {
  try {
    const options = {
      method,
      headers: {}
    };

    if (requiresAuth) {
      // You'll need to replace this with actual admin session token
      options.headers['x-admin-secret'] = 'admin123';
    }

    if (data) {
      if (data instanceof FormData) {
        options.body = data;
      } else {
        options.headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify(data);
      }
    }

    const res = await fetch(BASE_URL + endpoint, options);
    const json = await res.json();
    
    console.log(`\n✅ ${method} ${endpoint}`);
    console.log('Status:', res.status);
    console.log('Response:', json);
    return { ok: res.ok, data: json };
  } catch (err) {
    console.error(`\n❌ ${method} ${endpoint}`);
    console.error('Error:', err.message);
    return { ok: false, error: err.message };
  }
}

async function runTests() {
  console.log('🚀 Starting Backend Tests...\n');
  console.log('='.repeat(50));

  // Test 1: Health Check
  console.log('\n📡 Testing Health Endpoint...');
  await testAPI('GET', '/api/health');

  // Test 2: Get Products
  console.log('\n📦 Testing Products Endpoint...');
  await testAPI('GET', '/api/products');

  // Test 3: Create User Profile
  console.log('\n👤 Testing Profile Creation...');
  await testAPI('POST', '/api/profile', {
    name: 'Test User',
    email: 'test@example.com',
    phone: '1234567890',
    address: 'Test Address, City'
  });

  // Test 4: Get User Profile
  console.log('\n👤 Testing Get Profile...');
  await testAPI('GET', '/api/profile/test@example.com');

  // Test 5: Book Ambulance
  console.log('\n🚑 Testing Ambulance Booking...');
  await testAPI('POST', '/api/ambulance', {
    name: 'Emergency Patient',
    phone: '9876543210',
    address: '123 Emergency St',
    emergency: 'Heart attack'
  });

  // Test 6: Book Doctor Appointment
  console.log('\n👨‍⚕️ Testing Doctor Appointment...');
  await testAPI('POST', '/api/doctor', {
    name: 'Patient Name',
    phone: '9876543210',
    issue: 'Fever and cold',
    preferredTime: 'Morning (9AM-12PM)'
  });

  // Test 7: Admin - Get All Orders
  console.log('\n📋 Testing Get Orders (Admin)...');
  await testAPI('GET', '/api/orders', null, true);

  // Test 8: Admin - Get All Profiles
  console.log('\n👥 Testing Get All Profiles (Admin)...');
  await testAPI('GET', '/api/profiles', null, true);

  // Test 9: Admin - Get All Prescriptions
  console.log('\n💊 Testing Get Prescriptions (Admin)...');
  await testAPI('GET', '/api/prescriptions', null, true);

  // Test 10: Admin - Get Ambulance Requests
  console.log('\n🚑 Testing Get Ambulance Requests (Admin)...');
  await testAPI('GET', '/api/ambulance', null, true);

  // Test 11: Admin - Get Doctor Appointments
  console.log('\n🩺 Testing Get Doctor Appointments (Admin)...');
  await testAPI('GET', '/api/doctor', null, true);

  console.log('\n' + '='.repeat(50));
  console.log('\n✅ All tests completed!\n');
  console.log('📝 Note: File upload tests (prescriptions, products) require manual testing via frontend.');
  console.log('🔐 Admin endpoints require valid session token or admin password.');
}

// Run tests
runTests().catch(err => {
  console.error('Test suite failed:', err);
  process.exit(1);
});
