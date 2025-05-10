import mongoose from "mongoose";
import 'dotenv/config'; // Ensure dotenv is loaded

// Simple connection object to track connection state
let isConnected = false;

/**
 * Connect to MongoDB
 * This function attempts to connect to MongoDB but will not fail the application if it can't connect
 */
async function dbConnect(): Promise<boolean> {
    // If already connected, return true
    if (isConnected) {
        return true;
    }

    // Get MongoDB URL from environment variables with fallback
    const mongodbUrl = process.env.MONGODB_URL || "mongodb://localhost:27017/inohax";

    try {
        console.log("Connecting to MongoDB...");

        // Set Mongoose options
        mongoose.set('strictQuery', false);

        // Connect to MongoDB with short timeouts
        await mongoose.connect(mongodbUrl, {
            serverSelectionTimeoutMS: 3000, // Timeout after 3s
            socketTimeoutMS: 5000, // Close sockets after 5s of inactivity
            connectTimeoutMS: 3000, // Give up initial connection after 3s
            maxPoolSize: 5, // Maintain up to 5 socket connections
        });

        isConnected = true;
        console.log('✅ MongoDB Connected Successfully');
        return true;
    } catch (error) {
        console.log("⚠️ MongoDB Connection failed - continuing without database");

        // Simple error message based on error type
        if (error instanceof Error) {
            if (error.message.includes('ECONNREFUSED')) {
                console.log("   MongoDB is not running. Registrations will be processed but not saved to database.");
            } else if (error.message.includes('authentication failed')) {
                console.log("   Authentication failed. Check MongoDB username and password.");
            } else {
                console.log(`   Error: ${error.message}`);
            }
        }

        isConnected = false;
        return false;
    }
}

export default dbConnect;