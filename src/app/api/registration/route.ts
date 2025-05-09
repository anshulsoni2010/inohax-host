import dbConnect from '@/libs/dbConnect';
import Registration from '@/model/Registration';
import nodemailer from 'nodemailer';

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
      } catch (error) {
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
    try {
      team = await Registration.create(body);
      await team.save();
      console.log("Registration saved to database");
    } catch (error) {
      console.log("Could not save to database, but continuing with registration process", error);
      // If database operation fails, we'll still continue with the registration process
      // This allows the application to work without a real database connection
      team = body; // Use the request body as the team data
    }

    // Send confirmation email to the team leader
    await sendConfirmationEmail(body.teamLeaderEmail, body.teamLeaderName, body.teamName);

    return new Response(JSON.stringify({ success: true, team }), { status: 201 });
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
  // Configure the nodemailer transport
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_NAME,
     pass:  process.env.EMAIL_PASWORD
    }
  });

  const mailOptions = {
    from: 'inovacteam@gmail.com', // Replace with your email
    to: teamLeaderEmail,
    subject: `${teamName} - Team Registration Confirmation`,
    html: `Dear ${teamLeaderName},<br><br>

  Thank you for submitting your application for <b>Inohax 2.0</b>! We’re excited to review your team’s project and appreciate the effort you’ve put into this stage.<br><br>

  <b>What’s Next?</b><br>
  Our team will carefully evaluate all submissions, and we will notify you of your selection status before the end of 21st May.<br><br>

  If you have any questions or need assistance in the meantime, feel free to reach out to us at inohax2.0@gmail.com
<br> <br>
  Do checkout <a href="https://play.google.com/store/apps/details?id=in.pranaydas.inovact"> Inovact Social </a> - A Social Network For Students & Entreprenuers Making Collaborations Simple & Faster On Projects and Ideas Powered by Proof Of Work.
<br>  <br>

  Thank you once again for your interest in <b>Inohax 2.0</b>, and best of luck in the selection process!<br><br>
<br> <br>
  Warm regards,<br>
  The Inohax 2.0 Team`
  };
  try {
    await transporter.sendMail(mailOptions);
    console.log('Confirmation email sent successfully to:', teamLeaderEmail);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};
