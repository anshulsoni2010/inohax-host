import mongoose from "mongoose";
import 'dotenv/config'; // Ensure dotenv is loaded

// Connection state tracking
let connectionPromise: Promise<boolean> | null = null;

/**
 * Connect to MongoDB
 * This function attempts to connect to MongoDB but will not fail the application if it can't connect
 * It uses a cached promise to prevent multiple connection attempts
 */
async function dbConnect(): Promise<boolean> {
    // If mongoose is already connected, return true immediately
    if (mongoose.connection.readyState === 1) {
        return true;
    }

    // If a connection attempt is already in progress, return that promise
    if (connectionPromise) {
        return connectionPromise;
    }

    // Get MongoDB URL from environment variables with fallback
    const mongodbUrl = process.env.MONGODB_URL || "mongodb://localhost:27017/inohax";

    // Create a new connection promise
    connectionPromise = (async () => {
        try {
            console.log("Connecting to MongoDB...");

            // Set Mongoose options
            mongoose.set('strictQuery', false);

            // Connect to MongoDB with improved timeouts
            await mongoose.connect(mongodbUrl, {
                serverSelectionTimeoutMS: 5000, // Increased from 3s to 5s
                socketTimeoutMS: 10000, // Increased from 5s to 10s
                connectTimeoutMS: 5000, // Increased from 3s to 5s
                maxPoolSize: 10, // Increased from 5 to 10
            });

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

            return false;
        } finally {
            // Reset the connection promise after completion (success or failure)
            // This allows future connection attempts if needed
            connectionPromise = null;
        }
    })();

    return connectionPromise;
}

export default dbConnect;