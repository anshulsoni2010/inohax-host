import dbConnect from '@/libs/dbConnect';
import Registration from '@/model/Registration';
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    await dbConnect();

    try {
      const body: {
        teamLeaderName: string;
        teamLeaderPhone: string;
        teamLeaderEmail: string;
        projectDomain?: string;
        projectLink?: string;
        teamMembers: Array<{ name: string; socialMediaLink?: string }>;
        communityReferral?: string;
      } = await req.json();

      console.log("Team ", body);

      // Create the team entry in the database
      const team = await Registration.create(body);
      team.save();

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
}

async function sendConfirmationEmail(teamLeaderEmail: string, teamLeaderName: string, teamName: string) {
  // Configure the nodemailer transport
  const transporter = nodemailer.createTransport({
    service: 'gmail',  // You can also use SMTP if needed
    auth: {
      user: process.env.EMAIL_NAME, // Replace with your email
      pass:  process.env.EMAIL_PASWORD   // Replace with your email password or app-specific password
    }
  });

  // Define the email content
  const mailOptions = {
    from: 'inovacteam@gmail.com', // Replace with your email
    to: teamLeaderEmail,
    subject: 'Team Registration Confirmation',
    text: `Dear ${teamLeaderName},

Thank you for submitting your application for Inohax 1.0! We’re excited to review your team’s project and appreciate the effort you’ve put into this stage.

What’s Next?
Our team will carefully evaluate all submissions, and we will notify you of your selection status before November 10th.

If you have any questions or need assistance in the meantime, feel free to reach out to us at inohax1.0@gmail.com.

Thank you once again for your interest in Inohax 1.0, and best of luck in the selection process!

Warm regards,
The Inohax Team`
  };

  // Send the email
  try {
    await transporter.sendMail(mailOptions);
    console.log('Confirmation email sent successfully to:', teamLeaderEmail);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}
