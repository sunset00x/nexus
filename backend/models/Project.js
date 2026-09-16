import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  members: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role: { type: String, enum: ['OWNER', 'ADMIN', 'MEMBER', 'VIEWER'], default: 'MEMBER' }
  }],
  createdAt: { type: Date, default: Date.now }
});

export const Project = mongoose.model('Project', projectSchema);