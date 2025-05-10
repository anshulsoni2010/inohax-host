// Script to test the registration process using the test-registration endpoint
const axios = require('axios');

async function testRegistration() {
  console.log('🧪 Testing registration process using test endpoint...');

  // Sample registration data
  const registrationData = {
    teamName: 'Test Team ' + new Date().toISOString().slice(0, 16),
    teamLeaderName: 'Test Leader',
    teamLeaderPhone: '1234567890',
    teamLeaderEmail: 'test@example.com',
    teamMembers: [
      { name: 'Member 1', socialMediaLink: 'https://example.com/member1' }
    ],
    projectLink: 'https://example.com/project',
    inovactSocialLink: 'https://api.inovact.in/v1/post?id=12345'
  };

  try {
    // Send a POST request to the test registration API
    console.log('📤 Sending test registration data...');
    const response = await axios.post('http://localhost:3000/api/test-registration', registrationData);

    // Check the response
    if (response.status === 201) {
      console.log('✅ Test registration successful!');
      console.log('📋 Response:', JSON.stringify(response.data, null, 2));
      console.log('\n🔍 Note: This test registration was saved to the test_registrations collection');
      console.log('   and did not send any actual emails.');
    } else {
      console.log('❌ Test registration failed with status:', response.status);
      console.log('Response:', response.data);
    }
  } catch (error) {
    console.error('❌ Error during test registration:', error.message);

    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

// Run the test
testRegistration();
