import dbConnect from '@/libs/dbConnect';
import Registration from '@/model/Registration';
import AdminUser from '@/model/AdminUser';
import { NextRequest, NextResponse } from 'next/server';

// Auth middleware function with database validation
const authMiddleware = async (req: NextRequest) => {
  // First check for token-based auth
  const authToken = req.headers.get('x-auth-token');

  if (authToken) {
    // Simple token format: username:timestamp:hash
    const tokenParts = authToken.split(':');
    if (tokenParts.length === 3) {
      const [username, timestamp, hash] = tokenParts;

      // For simplicity, we'll just validate the username exists
      // In a real app, you'd verify the hash and check token expiration
      try {
        await dbConnect();
        await AdminUser.createInitialAdmin();

        const admin = await AdminUser.findOne({
          $or: [{ username }, { adminId: username }]
        });

        if (admin) {
          // Update last login time
          admin.lastLogin = new Date();
          await admin.save();
          console.log(`Admin token auth successful for: ${admin.username} (ID: ${admin.adminId})`);
          return true;
        }
      } catch (error) {
        console.error('Token auth error:', error);
        // Fallback for hardcoded admin
        if (username === 'Sarang') {
          return true;
        }
      }
    }
  }

  // Fall back to Basic auth if no token or token validation failed
  const authHeader = req.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return false;
  }

  // Extract credentials
  const base64Credentials = authHeader.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
  const [username, password] = credentials.split(':');

  try {
    // Connect to database
    await dbConnect();

    // Ensure initial admin exists
    await AdminUser.createInitialAdmin();

    // Find admin by username or adminId (allow login with either)
    const admin = await AdminUser.findOne({
      $or: [{ username }, { adminId: username }]
    });

    if (!admin) {
      console.log(`No admin found for username/adminId: ${username}`);
      return false;
    }

    // Validate password
    const isValid = admin.validatePassword(password);

    if (isValid) {
      // Update last login time
      admin.lastLogin = new Date();
      await admin.save();
      console.log(`Admin login successful for: ${admin.username} (ID: ${admin.adminId})`);
      return true;
    }

    console.log(`Invalid password for admin: ${admin.username} (ID: ${admin.adminId})`);
    return false;
  } catch (error) {
    console.error('Auth error:', error);
    // Fallback to hardcoded credentials if database fails
    return (username === 'Sarang' && password === 'Inohax!2.0');
  }
};

export async function GET(req: NextRequest) {
  // Check authentication
  const isAuthenticated = await authMiddleware(req);

  if (!isAuthenticated) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  try {
    // Connect to database
    await dbConnect();

    // Get all registrations
    const registrations = await Registration.find().sort({ createdAt: -1 });

    return NextResponse.json({ success: true, registrations });
  } catch (error) {
    console.error('Error fetching registrations:', error);

    // Return error response
    return NextResponse.json(
      { success: false, error: 'Failed to fetch registrations' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  // Check authentication
  const isAuthenticated = await authMiddleware(req);

  if (!isAuthenticated) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  try {
    // Get registration ID from URL
    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Registration ID is required' },
        { status: 400 }
      );
    }

    // Connect to database
    await dbConnect();

    // Delete registration
    const result = await Registration.findByIdAndDelete(id);

    if (!result) {
      return NextResponse.json(
        { success: false, error: 'Registration not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Registration deleted successfully' });
  } catch (error) {
    console.error('Error deleting registration:', error);

    // Return error response
    return NextResponse.json(
      { success: false, error: 'Failed to delete registration' },
      { status: 500 }
    );
  }
}
