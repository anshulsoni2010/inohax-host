// Script to test the full registration process
const axios = require('axios');

async function testFullRegistration() {
  console.log('🧪 Testing full registration process...');

  // Sample registration data
  const registrationData = {
    teamName: 'Full Test Team ' + new Date().toISOString().slice(0, 16),
    teamLeaderName: 'Full Test Leader',
    teamLeaderPhone: '9876543210',
    teamLeaderEmail: 'full-test@example.com',
    teamMembers: [],
    inovactSocialLink: 'https://api.inovact.in/v1/post?id=12345'
  };

  try {
    // Send a POST request to the regular registration API
    console.log('📤 Sending registration data...');
    const response = await axios.post('http://localhost:3000/api/registration', registrationData);

    // Check the response
    if (response.status === 201) {
      console.log('✅ Registration successful!');
      console.log('📋 Response:', JSON.stringify(response.data, null, 2));
      console.log('\n🔍 This registration should be saved to the registrations collection');
      console.log('   and should have sent confirmation emails.');
    } else {
      console.log('❌ Registration failed with status:', response.status);
      console.log('Response:', response.data);
    }
  } catch (error) {
    console.error('❌ Error during registration:', error.message);

    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

// Run the test
testFullRegistration();
