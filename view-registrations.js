// Script to view registrations in both collections
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

// Define schemas for both collections
const RegistrationSchema = new mongoose.Schema({
  teamName: String,
  teamLeaderName: String,
  teamLeaderEmail: String,
  createdAt: Date
}, { collection: 'registrations' });

const TestRegistrationSchema = new mongoose.Schema({
  teamName: String,
  teamLeaderName: String,
  teamLeaderEmail: String,
  createdAt: Date
}, { collection: 'test_registrations' });

// Create models
const Registration = mongoose.models.Registration || 
  mongoose.model('Registration', RegistrationSchema);
  
const TestRegistration = mongoose.models.TestRegistration || 
  mongoose.model('TestRegistration', TestRegistrationSchema);

async function viewRegistrations() {
  console.log('📊 Viewing registrations in MongoDB...');
  
  // Get MongoDB URL from environment variables
  const mongodbUrl = process.env.MONGODB_URL || 'mongodb://localhost:27017/inohax';
  console.log('🔗 MongoDB URL:', mongodbUrl);
  
  try {
    // Connect to MongoDB
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(mongodbUrl, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 5000,
      connectTimeoutMS: 5000
    });
    
    console.log('✅ Connected to MongoDB');
    
    // Get real registrations
    console.log('\n📝 Real Registrations (registrations collection):');
    const registrations = await Registration.find().sort({ createdAt: -1 }).limit(10);
    
    if (registrations.length === 0) {
      console.log('   No registrations found');
    } else {
      registrations.forEach((reg, index) => {
        console.log(`   ${index + 1}. ${reg.teamName} - ${reg.teamLeaderName} (${reg.teamLeaderEmail})`);
        console.log(`      Created: ${reg.createdAt ? new Date(reg.createdAt).toLocaleString() : 'Unknown'}`);
      });
      
      // Show total count
      const totalCount = await Registration.countDocuments();
      console.log(`\n   Total real registrations: ${totalCount}`);
    }
    
    // Get test registrations
    console.log('\n🧪 Test Registrations (test_registrations collection):');
    const testRegistrations = await TestRegistration.find().sort({ createdAt: -1 }).limit(10);
    
    if (testRegistrations.length === 0) {
      console.log('   No test registrations found');
    } else {
      testRegistrations.forEach((reg, index) => {
        console.log(`   ${index + 1}. ${reg.teamName} - ${reg.teamLeaderName} (${reg.teamLeaderEmail})`);
        console.log(`      Created: ${reg.createdAt ? new Date(reg.createdAt).toLocaleString() : 'Unknown'}`);
      });
      
      // Show total count
      const totalTestCount = await TestRegistration.countDocuments();
      console.log(`\n   Total test registrations: ${totalTestCount}`);
    }
    
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error.message);
    console.log('   Make sure MongoDB is running and the connection string is correct');
  } finally {
    // Close the connection
    await mongoose.disconnect();
    console.log('\n🔌 MongoDB connection closed');
  }
}

// Run the function
viewRegistrations();
