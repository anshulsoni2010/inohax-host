// Simple script to check if MongoDB is running locally
const { MongoClient } = require('mongodb');
const net = require('net');

// Function to check if a port is open
function isPortOpen(port, host) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    
    // Set a timeout of 1 second
    socket.setTimeout(1000);
    
    // Handle connect event
    socket.on('connect', () => {
      socket.destroy();
      resolve(true);
    });
    
    // Handle error event
    socket.on('error', () => {
      socket.destroy();
      resolve(false);
    });
    
    // Handle timeout event
    socket.on('timeout', () => {
      socket.destroy();
      resolve(false);
    });
    
    // Try to connect
    socket.connect(port, host);
  });
}

// Function to check if MongoDB is running
async function checkMongoDB() {
  console.log('Checking if MongoDB is running locally...');
  
  // Check if port 27017 is open (default MongoDB port)
  const isOpen = await isPortOpen(27017, 'localhost');
  
  if (isOpen) {
    console.log('MongoDB port 27017 is open. Attempting to connect...');
    
    // Try to connect to MongoDB
    const client = new MongoClient('mongodb://localhost:27017', {
      connectTimeoutMS: 1000,
      socketTimeoutMS: 1000,
      serverSelectionTimeoutMS: 1000
    });
    
    try {
      await client.connect();
      console.log('Successfully connected to MongoDB!');
      
      // Get server info
      const admin = client.db('admin').admin();
      const serverInfo = await admin.serverInfo();
      console.log('MongoDB version:', serverInfo.version);
      
      // List databases
      const dbs = await client.db().admin().listDatabases();
      console.log('Available databases:');
      dbs.databases.forEach(db => {
        console.log(`- ${db.name}`);
      });
      
      await client.close();
      return true;
    } catch (error) {
      console.error('Failed to connect to MongoDB:', error.message);
      return false;
    }
  } else {
    console.error('MongoDB port 27017 is not open. MongoDB is not running.');
    console.log('Please start MongoDB using one of the following commands:');
    console.log('- macOS: brew services start mongodb-community');
    console.log('- Windows: Start MongoDB service from Services application');
    console.log('- Linux: sudo systemctl start mongodb');
    return false;
  }
}

// Run the check
checkMongoDB()
  .then(isRunning => {
    if (isRunning) {
      console.log('MongoDB is running and accessible.');
    } else {
      console.log('MongoDB is not running or not accessible.');
    }
    process.exit(0);
  })
  .catch(error => {
    console.error('Error checking MongoDB:', error);
    process.exit(1);
  });
