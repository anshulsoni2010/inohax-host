// Script to test MongoDB connection with improved error handling and timeouts
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

// Get the MongoDB URL from environment variables
// If not available, use a default local MongoDB connection
const MONGODB_URL = process.env.MONGODB_URL || 'mongodb://localhost:27017/inohax';

// Set a timeout for the entire script
const SCRIPT_TIMEOUT = 15000; // 15 seconds

async function testConnection() {
  console.log('Testing MongoDB connection...');
  console.log('MongoDB URL:', MONGODB_URL);

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

    console.log('MongoDB connection successful!');

    // Create a simple test schema and model
    const TestSchema = new mongoose.Schema({
      name: String,
      timestamp: { type: Date, default: Date.now }
    });

    const Test = mongoose.models.Test || mongoose.model('Test', TestSchema);

    // Create a test document
    const testDoc = new Test({ name: 'Connection Test' });
    await Promise.race([testDoc.save(), timeoutPromise]);

    console.log('Test document saved successfully!');

    // Find the test document
    const foundDoc = await Promise.race([Test.findOne({ name: 'Connection Test' }), timeoutPromise]);
    console.log('Found test document:', foundDoc);

    // Clean up - delete the test document
    if (foundDoc && foundDoc._id) {
      await Promise.race([Test.deleteOne({ _id: foundDoc._id }), timeoutPromise]);
      console.log('Test document deleted successfully!');
    }

  } catch (error) {
    console.error('MongoDB connection test failed:', error);
  } finally {
    try {
      // Close the connection with a timeout
      const disconnectPromise = mongoose.disconnect();
      await Promise.race([
        disconnectPromise,
        new Promise((_, reject) => setTimeout(() => reject(new Error('Disconnect timed out')), 5000))
      ]);
      console.log('MongoDB connection closed');
    } catch (error) {
      console.error('Error closing MongoDB connection:', error);
    }

    // Force exit the process after a short delay to ensure any pending operations are completed
    console.log('Exiting script...');
    setTimeout(() => process.exit(0), 1000);
  }
}

// Run the test
testConnection();
