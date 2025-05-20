// Registration endpoint is now disabled
// All registration attempts will be blocked with a 403 response
export async function POST(req: Request) {
  // Log the attempt for monitoring
  const body = await req.json().catch(() => ({})); // Safely parse JSON if exists
  
  console.log('Registration attempt blocked', {
    timestamp: new Date().toISOString(),
    ip: req.headers.get('x-forwarded-for') || 'unknown',
    userAgent: req.headers.get('user-agent'),
    body: body || 'No body'
  });

  return new Response(
    JSON.stringify({
      success: false,
      error: 'REGISTRATIONS_STOPPED',
      message: 'Registrations for Inohax 2.0 have been stopped. Thank you for your interest!'
    }),
    { 
      status: 403,
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
}
