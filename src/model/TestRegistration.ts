import mongoose from 'mongoose';

// This schema is identical to the Registration schema but uses a different collection
const TestRegistrationSchema = new mongoose.Schema({
  teamName: { type: String, required: true },
  teamLeaderName: { type: String, required: true },
  teamLeaderPhone: { type: String, required: true },
  teamLeaderEmail: { type: String, required: true },
  teamMembers: [
    {
      name: { type: String, required: true },
      socialMediaLink: { type: String, required: false }, // Optional field
    },
  ],
  projectLink: { type: String, required: false },
  inovactSocialLink: { type: String, required: false },
}, {
  timestamps: true, // Add createdAt and updatedAt fields
  collection: 'test_registrations' // Explicitly set the collection name to test_registrations
});

// Create the model if it doesn't exist
const TestRegistration = mongoose.models.TestRegistration || 
  mongoose.model('TestRegistration', TestRegistrationSchema);

export default TestRegistration;
