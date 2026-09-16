import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  title: { type: String, required: true },
  status: { type: String, enum: ['TODO', 'IN_PROGRESS', 'CODE_REVIEW', 'DONE'], default: 'TODO' },
  createdAt: { type: Date, default: Date.now }
});

export const Task = mongoose.model('Task', taskSchema);