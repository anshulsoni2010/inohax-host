// src/model/Registration.ts

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
  projectDomain: { type: String, required: false },
  projectLink: { type: String, required: false },
 projectDescription: { type: String},

  communityReferral: { type: String, required: false },
});

const Registration = mongoose.models.Registration || mongoose.model('Registration', RegistrationSchema);

export default Registration;
