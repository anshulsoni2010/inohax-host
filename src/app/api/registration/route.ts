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

  // Define the email content
  const mailOptions = {
    from: 'inovacteam@gmail.com', // Replace with your email
    to: teamLeaderEmail,
    subject: 'Team Registration Confirmation',
    text: `Hello ${teamLeaderName},\n\nCongratulations! Your team "${teamName}" has been successfully registered.\n\nBest regards,\nYour Team`
  };

  // Send the email
  try {
    await transporter.sendMail(mailOptions);
    console.log('Confirmation email sent successfully to:', teamLeaderEmail);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}
