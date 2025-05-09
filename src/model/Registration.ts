

import mongoose from 'mongoose';

const RegistrationSchema = new mongoose.Schema({
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
});

const Registration = mongoose.models.Registration || mongoose.model('Registration', RegistrationSchema);

export default Registration;
