# Running Inohax Without MongoDB

This guide explains how to run the Inohax application without MongoDB. The application is designed to work even when MongoDB is not available, allowing you to process registrations and send confirmation emails without a database.

## How It Works

When MongoDB is not available, the application will:

1. Attempt to connect to MongoDB with a short timeout
2. Log a warning message when the connection fails
3. Continue processing registrations without saving to the database
4. Send confirmation emails to registrants and notifications to admins

This allows you to run the application for testing or demonstration purposes without setting up MongoDB.

## Running the Application

1. Start the Next.js development server:
   ```bash
   npm run dev
   ```

2. You'll see a warning message in the console:
   ```
   Connecting to MongoDB...
   ⚠️ MongoDB Connection failed - continuing without database
   MongoDB is not running. Registrations will be processed but not saved to database.
   ```

3. The application will continue to run, and you can access it at http://localhost:3000

## Testing Registration

You can test the registration process using the provided test script:

```bash
node test-registration.js
```

This script will send a test registration to the API and display the response.

## Setting Up MongoDB (Optional)

If you want to save registrations to a database, you'll need to set up MongoDB:

### Option 1: Local MongoDB

1. Install MongoDB Community Edition:
   - macOS: `brew tap mongodb/brew && brew install mongodb-community`
   - Windows: Download from the MongoDB website
   - Linux: `sudo apt-get install -y mongodb`

2. Start MongoDB:
   - macOS: `brew services start mongodb-community`
   - Windows: Start the MongoDB service
   - Linux: `sudo systemctl start mongodb`

3. Restart the application:
   ```bash
   npm run dev
   ```

### Option 2: MongoDB Atlas (Cloud)

1. Create a free MongoDB Atlas account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster
3. Get your connection string
4. Update the `.env.local` file with your connection string:
   ```
   MONGODB_URL=mongodb+srv://<username>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority
   ```
5. Restart the application:
   ```bash
   npm run dev
   ```

## Troubleshooting

If you encounter issues with the application:

1. Check the console for error messages
2. Ensure the email configuration is correct in `.env.local`
3. Try running the application with the `--trace-warnings` flag:
   ```bash
   NODE_OPTIONS=--trace-warnings npm run dev
   ```

This will provide more detailed error information in the console.
