import mongoose from 'mongoose';
import crypto from 'crypto';

// Counter schema for auto-incrementing admin IDs
const CounterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 }
});

const Counter = mongoose.models.Counter || mongoose.model('Counter', CounterSchema);

// Schema for admin users
const AdminUserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  adminId: {
    type: String,
    required: true,
    unique: true
  },
  // Store password hash and salt for security
  passwordHash: {
    type: String,
    required: true
  },
  passwordSalt: {
    type: String,
    required: true
  },
  lastLogin: {
    type: Date,
    default: null
  }
}, {
  timestamps: true, // Add createdAt and updatedAt fields
  collection: 'admin_users' // Explicitly set the collection name
});

// Method to set password (generates salt and hash)
AdminUserSchema.methods.setPassword = function(password: string) {
  // Generate a random salt
  this.passwordSalt = crypto.randomBytes(16).toString('hex');

  // Hash the password with the salt
  this.passwordHash = crypto
    .pbkdf2Sync(password, this.passwordSalt, 1000, 64, 'sha512')
    .toString('hex');
};

// Method to validate password
AdminUserSchema.methods.validatePassword = function(password: string) {
  const hash = crypto
    .pbkdf2Sync(password, this.passwordSalt, 1000, 64, 'sha512')
    .toString('hex');

  return this.passwordHash === hash;
};

// Function to get the next admin ID sequence
async function getNextSequence(name: string) {
  try {
    const counter = await Counter.findByIdAndUpdate(
      { _id: name },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    return String(counter.seq).padStart(2, '0'); // Format as "01", "02", etc.
  } catch (error) {
    console.error('Error getting next sequence:', error);
    throw error;
  }
}

// Pre-validate hook to assign the actual ID
AdminUserSchema.pre('validate', async function(next) {
  try {
    // Only assign ID for new documents
    if (this.isNew) {
      // Get the next sequence number
      const nextId = await getNextSequence('adminId');

      // Assign the ID
      this.adminId = nextId;
      console.log(`Auto-assigned admin ID: ${nextId} for user: ${this.username}`);
    }
    next();
  } catch (error) {
    console.error('Error in pre-validate hook:', error);
    next(error as Error);
  }
});

// Static method to create initial admin if none exists
AdminUserSchema.statics.createInitialAdmin = async function() {
  const AdminUser = this;

  // Check if any admin exists
  const adminCount = await AdminUser.countDocuments();

  if (adminCount === 0) {
    console.log('No admin users found. Creating initial admin user...');

    // Reset counter for admin ID
    await Counter.findByIdAndUpdate(
      { _id: 'adminId' },
      { seq: 0 },
      { upsert: true }
    );

    // Create default admin
    const initialAdmin = new AdminUser({
      username: 'Sarang',
      // adminId will be auto-assigned by pre-save hook
    });

    // Set password
    initialAdmin.setPassword('Inohax!2.0');

    // Save to database
    await initialAdmin.save();

    console.log('Initial admin user created successfully');
  }
};

// Create the model
const AdminUser = mongoose.models.AdminUser || mongoose.model('AdminUser', AdminUserSchema);

export default AdminUser;
