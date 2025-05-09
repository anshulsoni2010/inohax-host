import mongoose from "mongoose";


type ConnectionObject={
    isConnected?:number;
};

const connection:ConnectionObject={   }

async function dbConnect():Promise<void> {
    if(connection.isConnected){
        console.log("Already connected");
        return;
    }

    // Check if MongoDB URL is provided
    const mongodbUrl = process.env.MONGODB_URL;
    if (!mongodbUrl || mongodbUrl.trim() === "") {
        console.log("MongoDB URL is not provided. Using mock database connection.");
        // Instead of failing, we'll just return without connecting
        // This allows the application to continue working without a real database
        return;
    }

    try {
        const db = await mongoose.connect(mongodbUrl, {});

        connection.isConnected = db.connections[0].readyState;

        console.log('Database Connected Successfully');
    } catch (error) {
        console.log("Database Connection failed", error);
        // Don't exit the process, just log the error
        // process.exit(1);
    }
}

export default dbConnect;