import express from 'express';
import crypto from 'crypto';
import { Project } from '../models/Project.js';
import { Task } from '../models/Task.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticateToken);

// Generate unique 6-digit code on project creation
router.post('/', async (req, res) => {
  try {
    const inviteCode = crypto.randomBytes(3).toString('hex').toUpperCase();
    const project = await Project.create({
      name: req.body.name,
      owner: req.user.id,
      inviteCode,
      members: [{ user: req.user.id, role: 'OWNER' }]
    });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Join Project via Invite Code
router.post('/join', async (req, res) => {
  const { code } = req.body;
  try {
    const project = await Project.findOne({ inviteCode: code.toUpperCase() });
    if (!project) return res.status(404).json({ message: 'Invalid Invite Code' });

    const isMember = project.members.some(m => m.user.toString() === req.user.id);
    if (!isMember) {
      project.members.push({ user: req.user.id, role: 'MEMBER' });
      await project.save();
    }

    res.json({ success: true, projectId: project._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;