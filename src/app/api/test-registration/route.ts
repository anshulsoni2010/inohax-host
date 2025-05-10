import dbConnect from '@/libs/dbConnect';
import TestRegistration from '@/model/TestRegistration';
import mongoose from 'mongoose';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  // No registration end date check for test registrations
  
  // Try to connect to MongoDB, but continue even if it fails
  await dbConnect();

  try {
    const body: {
      teamName: string;
      teamLeaderName: string;
      teamLeaderPhone: string;
      teamLeaderEmail: string;
      teamMembers: Array<{ name: string; socialMediaLink?: string }>;
      projectLink?: string;
      inovactSocialLink?: string;
    } = await req.json();

    console.log("Test Registration:", body);

    // Validate Inovact Social Link if provided (same validation as real registrations)
    if (body.inovactSocialLink) {
      try {
        // Check if it's a valid URL
        const url = new URL(body.inovactSocialLink);

        // Check if it's from the Inovact domain
        if (!url.hostname.includes('inovact.in')) {
          return new Response(
            JSON.stringify({
              success: false,
              error: 'Please enter a valid Inovact Social link (e.g., https://inovact.in/...)'
            }),
            { status: 400 }
          );
        }

        // Check if it has an ID parameter
        const postId = url.searchParams.get('id');
        if (!postId) {
          return new Response(
            JSON.stringify({
              success: false,
              error: 'Invalid Inovact Social link. Please provide a link with an ID parameter (e.g., ?id=...)'
            }),
            { status: 400 }
          );
        }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (_error) {
        return new Response(
          JSON.stringify({
            success: false,
            error: 'Please enter a valid URL for the Inovact Social link'
          }),
          { status: 400 }
        );
      }
    }

    // Try to create the test registration entry in the database
    let testRegistration;
    
    // Create a registration document regardless of database connection
    const registrationData = {
      teamName: body.teamName,
      teamLeaderName: body.teamLeaderName,
      teamLeaderPhone: body.teamLeaderPhone,
      teamLeaderEmail: body.teamLeaderEmail,
      teamMembers: body.teamMembers || [],
      projectLink: body.projectLink,
      inovactSocialLink: body.inovactSocialLink
    };
    
    // Check if mongoose is connected
    const isConnected = mongoose.connection.readyState === 1;
    
    if (isConnected) {
      try {
        // Create a new test registration document
        testRegistration = new TestRegistration(registrationData);
        
        // Save with a short timeout
        await testRegistration.save({ timeout: 3000 });
        console.log("✅ Test registration saved to database successfully");
      } catch (error) {
        console.log("⚠️ Could not save test registration to database:", error instanceof Error ? error.message : 'Unknown error');
        // Use the registration data if save fails
        testRegistration = registrationData;
      }
    } else {
      console.log("⚠️ MongoDB is not connected, processing test registration without database save");
      testRegistration = registrationData;
    }

    // For test registrations, we'll skip sending actual emails
    // Instead, we'll just log that we would have sent emails
    console.log(`[TEST MODE] Would have sent confirmation email to: ${body.teamLeaderEmail}`);
    console.log(`[TEST MODE] Would have sent notification email to admin`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        testRegistration,
        message: "Test registration processed successfully. No emails were sent."
      }), 
      { status: 201 }
    );
  } catch (error: unknown) {
    console.log("Error in test registration:", error);

    let errorMessage = 'An unknown error occurred';

    // Narrow the type of 'error'
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return new Response(
      JSON.stringify({ success: false, error: errorMessage }), 
      { status: 400 }
    );
  }
}
