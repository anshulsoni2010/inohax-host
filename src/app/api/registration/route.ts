import dbConnect from '@/libs/dbConnect';
import Registration from '@/model/Registration';
import nodemailer from 'nodemailer';
import mongoose from 'mongoose';

export async function POST(req: Request) {
    const registrationEndDate = new Date('2025-05-21T23:59:00');
  if (new Date() > registrationEndDate) {
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Registration period has ended'
      }),
      { status: 403 }
    );
  }

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

    // Check if mongoose is connected
    const isConnected = mongoose.connection.readyState === 1;

    if (isConnected) {
      try {
        // Create a new registration document
        team = new Registration(registrationData);

        // Save with a short timeout and await completion
        await team.save({ timeout: 5000 });
        console.log("✅ Registration saved to database successfully");
      } catch (error) {
        console.log("⚠️ Could not save to database:", error instanceof Error ? error.message : 'Unknown error');
        // Return an error response if database save fails
        return new Response(
          JSON.stringify({
            success: false,
            error: "Failed to save registration to database. Please try again."
          }),
          { status: 500 }
        );
      }
    } else {
      console.log("⚠️ MongoDB is not connected, cannot process registration");
      return new Response(
        JSON.stringify({
          success: false,
          error: "Database connection is not available. Please try again later."
        }),
        { status: 503 }
      );
    }

    // Send confirmation email to the team leader
    try {
      await sendConfirmationEmail(body.teamLeaderEmail, body.teamLeaderName, body.teamName, body.inovactSocialLink);
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

async function sendConfirmationEmail(teamLeaderEmail: string, teamLeaderName: string, teamName: string, inovactSocialLink?: string) {
  // Configure the nodemailer transport
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_NAME,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  // Send email to the team leader
  const mailOptions = {
    from: 'inovacteam@gmail.com', // Replace with your email
    to: teamLeaderEmail,
    subject: `Inohax 2.0 Registration Confirmation for Team "${teamName}"`,
    html: `Dear ${teamLeaderName},<br><br>

  Thank you for submitting your application for <b>Inohax 2.0</b>! We’re excited to review your team’s project and appreciate the effort you’ve put into this stage.<br><br>

  <b>What’s Next?</b><br>
  Our team will carefully evaluate all submissions, and we will notify you of your selection status before the end of 21st May.<br><br>

  If you have any questions or need assistance in the meantime, feel free to reach out to us at inohax2.0@gmail.com
<br> <br>
  Do checkout <a href="https://inovact.in/"> Inovact </a> - A Social Network For Students & Entreprenuers Making Collaborations Simple & Faster On Projects and Ideas Powered by Proof Of Work.
<br>  <br>

  Thank you once again for your interest in <b>Inohax 2.0</b>, and best of luck in the selection process!<br><br>
<br> <br>
  Warm regards,<br>
  Team Inohax`
  };
  try {
    // Send email to the team leader
    await transporter.sendMail(mailOptions);
    console.log('Confirmation email sent successfully to:', teamLeaderEmail);

    // Send a copy of the registration to the admin email
    const adminMailOptions = {
      from: 'inovacteam@gmail.com',
      to: 'inohax2.0@gmail.com', // Admin email address
      subject: `New Inohax 2.0 Registration: Team "${teamName}"`,
      html: `
        <h2>New Team Registration</h2>
        <p><strong>Team Name:</strong> ${teamName}</p>
        <p><strong>Team Leader:</strong> ${teamLeaderName}</p>
        <p><strong>Email:</strong> ${teamLeaderEmail}</p>
        <p><strong>Inovact Social Link:</strong> ${inovactSocialLink || 'Not provided'}</p>
        <p>A confirmation email has been sent to the team leader.</p>
      `
    };

    await transporter.sendMail(adminMailOptions);
    console.log('Notification email sent to admin');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};
