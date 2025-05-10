// Script to check MongoDB connection in production environment
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

// Get the MongoDB URL from environment variables
const MONGODB_URL = process.env.MONGODB_URL || 'mongodb://localhost:27017/inohax';

// Set a timeout for the entire script
const SCRIPT_TIMEOUT = 15000; // 15 seconds

async function checkProductionDB() {
  console.log('🔍 Checking MongoDB connection for production environment...');
  console.log('🔗 MongoDB URL:', MONGODB_URL);
  
  // Create a timeout promise that will reject after SCRIPT_TIMEOUT milliseconds
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Connection test timed out after ${SCRIPT_TIMEOUT/1000} seconds`));
    }, SCRIPT_TIMEOUT);
  });

  try {
    // Set Mongoose options
    mongoose.set('strictQuery', false);

    // Connect to MongoDB with shorter timeouts
    const connectionPromise = mongoose.connect(MONGODB_URL, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s
      socketTimeoutMS: 10000, // Close sockets after 10s of inactivity
      connectTimeoutMS: 5000, // Give up initial connection after 5s
      maxPoolSize: 5, // Maintain up to 5 socket connections
    });

    // Race the connection promise against the timeout promise
    await Promise.race([connectionPromise, timeoutPromise]);

    console.log('✅ MongoDB connection successful!');
    
    // Check if we can access the database
    console.log('📊 Checking database access...');
    
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
    
    // Try to count documents in both collections
    const registrationCount = await Registration.countDocuments();
    const testRegistrationCount = await TestRegistration.countDocuments();
    
    console.log(`📝 Real registrations count: ${registrationCount}`);
    console.log(`🧪 Test registrations count: ${testRegistrationCount}`);
    
    // Try to create a test document
    const testDoc = new TestRegistration({
      teamName: 'Production Test ' + new Date().toISOString(),
      teamLeaderName: 'Production Test Leader',
      teamLeaderEmail: 'production-test@example.com',
      createdAt: new Date()
    });
    
    await testDoc.save();
    console.log('✅ Successfully created a test document in test_registrations collection');
    
    // Delete the test document
    await TestRegistration.findByIdAndDelete(testDoc._id);
    console.log('✅ Successfully deleted the test document');
    
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection test failed:', error);
    
    // Provide more specific error information
    if (error instanceof Error) {
      if (error.message.includes('ECONNREFUSED')) {
        console.error('   MongoDB server is not running or not accessible');
      } else if (error.message.includes('authentication failed')) {
        console.error('   Authentication failed. Check MongoDB username and password');
      } else if (error.message.includes('timed out')) {
        console.error('   Connection timed out. Check network connectivity and MongoDB server status');
      } else {
        console.error(`   Error: ${error.message}`);
      }
    }
    
    return false;
  } finally {
    try {
      // Close the connection with a timeout
      const disconnectPromise = mongoose.disconnect();
      await Promise.race([
        disconnectPromise,
        new Promise((_, reject) => setTimeout(() => reject(new Error('Disconnect timed out')), 5000))
      ]);
      console.log('🔌 MongoDB connection closed');
    } catch (error) {
      console.error('Error closing MongoDB connection:', error);
    }

    // Force exit the process after a short delay to ensure any pending operations are completed
    console.log('Exiting script...');
    setTimeout(() => process.exit(0), 1000);
  }
}

// Run the check
checkProductionDB();
