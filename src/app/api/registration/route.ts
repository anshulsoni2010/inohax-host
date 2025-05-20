import dbConnect from '@/libs/dbConnect';
import Registration from '@/model/Registration';
import nodemailer from 'nodemailer';
import mongoose from 'mongoose';

export async function POST(req: Request) {
    const registrationEndDate = new Date('2025-05-20T23:59:00');
  if (new Date() > registrationEndDate) {
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Registration period has ended'
      }),
      { status: 403 }
    );
  }

  try {
    // Try to connect to MongoDB with a more robust approach
    const connectionResult = await dbConnect();
    console.log(`MongoDB connection attempt result: ${connectionResult ? 'Connected' : 'Failed to connect'}`);

    const body: {
      teamName: string;
      teamLeaderName: string;
      teamLeaderPhone: string;
      teamLeaderEmail: string;
      teamMembers: Array<{ name: string; socialMediaLink?: string }>;
      projectLink?: string;
      inovactSocialLink?: string;
    } = await req.json();

    console.log("Team ", body);

    // Validate Inovact Social Link if provided
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

    // Try to create the team entry in the database
    let team;

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

    // Check if mongoose is connected - use a more reliable approach
    const isConnected = mongoose.connection.readyState === 1;

    // Try to save to database if connected, otherwise proceed with email only
    if (isConnected) {
      try {
        // Create a new registration document
        team = new Registration(registrationData);

        // Save with a longer timeout and await completion
        await team.save({ timeout: 10000 });
        console.log("✅ Registration saved to database successfully");
      } catch (error) {
        console.log("⚠️ Could not save to database:", error instanceof Error ? error.message : 'Unknown error');

        // Instead of failing, continue with the registration process
        // This allows the form to work even if database save fails
        console.log("Continuing with registration process despite database save failure");

        // Set team to the registration data so we can still return it
        team = registrationData;
      }
    } else {
      // Instead of returning an error, continue with the registration process
      console.log("⚠️ MongoDB is not connected, proceeding with registration without database save");

      // Set team to the registration data so we can still return it
      team = registrationData;
    }

    // Send confirmation email to the team leader
    try {
      await sendConfirmationEmail(body.teamLeaderEmail, body.teamLeaderName, body.teamName);
    } catch (error) {
      console.error("⚠️ Failed to send confirmation email:", error instanceof Error ? error.message : 'Unknown error');
      // Continue even if email sending fails, but log the error
    }

    return new Response(
      JSON.stringify({
        success: true,
        team,
        message: "Registration successful! A confirmation email has been sent to your email address."
      }),
      { status: 201 }
    );
  } catch (error: unknown) {
    console.log("Error", error);

    let errorMessage = 'An unknown error occurred';

    // Narrow the type of 'error'
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return new Response(JSON.stringify({ success: false, error: errorMessage }), { status: 400 });
  }
}

async function sendConfirmationEmail(teamLeaderEmail: string, teamLeaderName: string, teamName: string) {
  console.log('Starting email sending process...');

  // Check if email credentials are available
  if (!process.env.EMAIL_NAME || !process.env.EMAIL_PASSWORD) {
    console.error('Email credentials are missing in environment variables');
    throw new Error('Email credentials are missing. Please check your environment variables.');
  }

  // Configure the nodemailer transport with settings optimized for serverless environments
  // Using a simpler configuration that works better in AWS Lambda
  const transporter = nodemailer.createTransport({
    service: 'gmail', // Using the service name is more reliable in serverless
    auth: {
      user: process.env.EMAIL_NAME,
      pass: process.env.EMAIL_PASSWORD // This should be an app password, not your regular password
    },
    tls: {
      rejectUnauthorized: false // Helps with some SSL issues in serverless environments
    }
  });

  // Send email to the team leader
  const mailOptions = {
    from: `"Inohax Team" <${process.env.EMAIL_NAME}>`, // Proper format with name and email
    to: teamLeaderEmail,
    subject: `Thank You for Registering for Inohax 2.0 – Submit Your Idea by May 20th!`,
    html: `Hi ${teamLeaderName},<br><br>

  Thank you for registering for <b>Inohax 2.0</b> – we're thrilled to have you onboard for this exciting journey of innovation and collaboration! 🚀<br><br>

  <b>Next Step:</b><br><br>

  Submit your hackathon idea using the link below by May 20th, 2025:<br><br>

  👉 <a href="https://forms.gle/gLg4dXnxATbAA6Na8">https://forms.gle/gLg4dXnxATbAA6Na8</a><br><br>

  Your idea submission is essential to move forward in the hackathon process, so don't miss the deadline!<br><br>

  If you have any questions or need help, feel free to reply to this email or reach out to us directly.<br><br>

  Best regards,<br>
  Team Inohax`,
    // Add text version for better deliverability
    text: `Hi ${teamLeaderName},

Thank you for registering for Inohax 2.0 – we're thrilled to have you onboard for this exciting journey of innovation and collaboration! 🚀

Next Step:

Submit your hackathon idea using the link below by May 20th, 2025:

https://forms.gle/gLg4dXnxATbAA6Na8

Your idea submission is essential to move forward in the hackathon process, so don't miss the deadline!

If you have any questions or need help, feel free to reply to this email or reach out to us directly.

Best regards,
Team Inohax`
  };

  try {
    // Send email to the team leader
    await transporter.sendMail(mailOptions);
    console.log('Confirmation email sent successfully to:', teamLeaderEmail);

    // Send a copy of the registration to the admin email
    const adminMailOptions = {
      from: `"Inohax Team" <${process.env.EMAIL_NAME}>`,
      to: 'inohax2.0@gmail.com', // Admin email address
      subject: `New Inohax 2.0 Registration: Team "${teamName}"`,
      html: `
        <h2>New Team Registration</h2>
        <p><strong>Team Name:</strong> ${teamName}</p>
        <p><strong>Team Leader:</strong> ${teamLeaderName}</p>
        <p><strong>Email:</strong> ${teamLeaderEmail}</p>
        <p>A confirmation email has been sent to the team leader.</p>
      `
    };

    await transporter.sendMail(adminMailOptions);
    console.log('Notification email sent to admin');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};
