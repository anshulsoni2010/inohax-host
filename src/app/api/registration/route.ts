import dbConnect from '@/libs/dbConnect';
import Registration from '@/model/Registration';

export async function POST(req: Request) {
  await dbConnect();

  try {
    const body: { teamName: string; teamLeaderName: string; teamLeaderPhone: string; teamLeaderEmail: string; teamMembers: Array<{ name: string; socialMediaLink?: string }>; projectDomain?: string; projectLink?: string; } = await req.json();
    console.log("Team ", body);

    const team = await Registration.create(body);
    team.save();
    return new Response(JSON.stringify({ success: true, team }), { status: 201 });
  } catch (error: unknown) {  // Use 'unknown' instead of 'any'
    console.log("Error", error);
    
    let errorMessage = 'An unknown error occurred';
    
    // Narrow the type of 'error'
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    return new Response(JSON.stringify({ success: false, error: errorMessage }), { status: 400 });
  }
}
