
const axios = require('axios');

const baseURL = 'http://localhost:4000';
let authToken = '';

async function testBackend() {
  try {
    console.log('🚀 Testing Backend APIs...\n');

    // Test 1: Register a user
    console.log('1. Testing User Registration...');
    const registerResponse = await axios.post(`${baseURL}/api/auth/register`, {
      name: "Test User",
      email: "test@example.com",
      password: "password123",
      role: "student"
    });
    console.log('✅ Registration successful:', registerResponse.data.message);
    authToken = registerResponse.data.token;

    // Test 2: Login
    console.log('\n2. Testing User Login...');
    const loginResponse = await axios.post(`${baseURL}/api/auth/login`, {
      email: "test@example.com",
      password: "password123"
    });
    console.log('✅ Login successful:', loginResponse.data.message);

    // Test 3: Get Profile
    console.log('\n3. Testing Get Profile...');
    const profileResponse = await axios.get(`${baseURL}/api/auth/profile`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Profile retrieved:', profileResponse.data.user.name);

    // Test 4: Create Live Session
    console.log('\n4. Testing Create Live Session...');
    const sessionResponse = await axios.post(`${baseURL}/api/live-sessions/create`, {
      title: "Test Session",
      description: "Test Description",
      subject: "Mathematics",
      scheduledTime: new Date(Date.now() + 3600000).toISOString(),
      duration: 60
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Live session created:', sessionResponse.data.session.title);

    // Test 5: Create Group Chat
    console.log('\n5. Testing Create Group Chat...');
    const chatResponse = await axios.post(`${baseURL}/api/group-chat/create`, {
      name: "Test Group",
      description: "Test Description",
      type: "subject",
      subject: "Mathematics"
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Group chat created:', chatResponse.data.groupChat.name);

    console.log('\n🎉 All tests passed! Backend is working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data?.message || error.message);
  }
}

testBackend();
