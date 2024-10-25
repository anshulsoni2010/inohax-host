import dbConnect from '@/libs/dbConnect';
import Registration from '@/model/Registration';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  await dbConnect();

  try {
    const body: {
      teamName: string;
      teamLeaderName: string;
      teamLeaderPhone: string;
      teamLeaderEmail: string;
      teamMembers: Array<{ name: string; socialMediaLink?: string }>;
      projectDomain?: string;
      projectLink?: string;
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

async function sendConfirmationEmail(teamLeaderEmail: string, teamLeaderName: string, teamName: string) {
  // Configure the nodemailer transport
  const transporter = nodemailer.createTransport({
    service: 'gmail',  // You can also use SMTP if needed
    auth: {
      user: process.env.EMAIL_NAME, // Replace with your email
      pass:  process.env.EMAIL_PASWORD   // Replace with your email password or app-specific password
    }
  });

  const mailOptions = {
    from: 'inovacteam@gmail.com', // Replace with your email
    to: teamLeaderEmail,
    subject: `${teamName} - Team Registration Confirmation`,
    html: `Dear ${teamLeaderName},<br><br>

  Thank you for submitting your application for <b>Inohax 1.0</b>! We’re excited to review your team’s project and appreciate the effort you’ve put into this stage.<br><br>

  <b>What’s Next?</b><br>
  Our team will carefully evaluate all submissions, and we will notify you of your selection status before November 8th.<br><br>

  If you have any questions or need assistance in the meantime, feel free to reach out to us at inohax1.0@gmail.com

  Do checkout <a href="https://play.google.com/store/apps/details?id=in.pranaydas.inovact"> Inovact Social </a> - A Social Network For Students & Entreprenuers Making Collaborations Simple & Faster On Projects and Ideas Powered by Proof Of Work.

  Thank you once again for your interest in <b>Inohax 1.0</b>, and best of luck in the selection process!<br><br>

  Warm regards,<br>
  The Inohax Team`
  };
  try {
    await transporter.sendMail(mailOptions);
    console.log('Confirmation email sent successfully to:', teamLeaderEmail);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};
