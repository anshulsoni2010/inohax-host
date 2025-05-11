import dbConnect from '@/libs/dbConnect';
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

// GET - Fetch all admin users
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

    // Ensure initial admin exists
    await AdminUser.createInitialAdmin();

    // Get all admin users (exclude password hash and salt)
    const admins = await AdminUser.find({}, { passwordHash: 0, passwordSalt: 0 }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, admins });
  } catch (error) {
    console.error('Error fetching admin users:', error);

    // Return error response
    return NextResponse.json(
      { success: false, error: 'Failed to fetch admin users' },
      { status: 500 }
    );
  }
}

// POST - Create a new admin user
export async function POST(req: NextRequest) {
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
    // Parse request body
    const body = await req.json();
    const { username, password } = body;

    // Validate required fields
    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Connect to database
    await dbConnect();

    // Check if username already exists
    const existingAdmin = await AdminUser.findOne({ username });

    if (existingAdmin) {
      return NextResponse.json(
        { success: false, error: 'Username already exists' },
        { status: 400 }
      );
    }

    let newAdmin;

    try {
      // Create new admin user
      newAdmin = new AdminUser({
        username
        // adminId will be auto-assigned by the pre-validate hook
      });

      // Set password (this will generate salt and hash)
      newAdmin.setPassword(password);

      // Save to database
      await newAdmin.save();

      // Refresh the admin data to get the assigned ID
      const savedAdmin = await AdminUser.findById(newAdmin._id);

      // Update the newAdmin reference with the saved data
      if (savedAdmin) {
        newAdmin = savedAdmin;
      }

      console.log(`Created new admin: ${newAdmin.username} with ID: ${newAdmin.adminId}`);

      // Return success response (exclude password hash and salt)
      return NextResponse.json({
        success: true,
        admin: {
          id: newAdmin._id,
          username: newAdmin.username,
          adminId: newAdmin.adminId,
          createdAt: newAdmin.createdAt
        }
      }, { status: 201 });
    } catch (error) {
      console.error('Error creating admin user:', error);

      // Return error response
      return NextResponse.json(
        { success: false, error: 'Failed to create admin user' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error creating admin user:', error);

    // Return error response
    return NextResponse.json(
      { success: false, error: 'Failed to create admin user' },
      { status: 500 }
    );
  }
}

// PUT - Update an admin user
export async function PUT(req: NextRequest) {
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
    // Parse request body
    const body = await req.json();
    const { id, username, password } = body;

    // Validate required fields
    if (!id || !username) {
      return NextResponse.json(
        { success: false, error: 'ID and username are required' },
        { status: 400 }
      );
    }

    // Connect to database
    await dbConnect();

    // Check if username already exists (excluding current admin)
    const existingAdmin = await AdminUser.findOne({
      username,
      _id: { $ne: id }
    });

    if (existingAdmin) {
      return NextResponse.json(
        { success: false, error: 'Username already exists' },
        { status: 400 }
      );
    }

    // Find admin by ID
    const admin = await AdminUser.findById(id);

    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Admin user not found' },
        { status: 404 }
      );
    }

    // Update username only
    admin.username = username;

    // Update password if provided
    if (password) {
      admin.setPassword(password);
    }

    // Save changes
    await admin.save();

    // Return success response (exclude password hash and salt)
    return NextResponse.json({
      success: true,
      admin: {
        id: admin._id,
        username: admin.username,
        adminId: admin.adminId,
        createdAt: admin.createdAt,
        updatedAt: admin.updatedAt
      }
    });
  } catch (error) {
    console.error('Error updating admin user:', error);

    // Return error response
    return NextResponse.json(
      { success: false, error: 'Failed to update admin user' },
      { status: 500 }
    );
  }
}

// DELETE - Delete an admin user
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
    // Get admin ID from URL
    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Admin ID is required' },
        { status: 400 }
      );
    }

    // Connect to database
    await dbConnect();

    // Count total admins
    const adminCount = await AdminUser.countDocuments();

    if (adminCount <= 1) {
      return NextResponse.json(
        { success: false, error: 'Cannot delete the last admin user' },
        { status: 400 }
      );
    }

    // Delete admin
    const result = await AdminUser.findByIdAndDelete(id);

    if (!result) {
      return NextResponse.json(
        { success: false, error: 'Admin user not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Admin user deleted successfully' });
  } catch (error) {
    console.error('Error deleting admin user:', error);

    // Return error response
    return NextResponse.json(
      { success: false, error: 'Failed to delete admin user' },
      { status: 500 }
    );
  }
}
