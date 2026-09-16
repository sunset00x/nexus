import express from 'express';
import { Project } from '../models/Project.js';
import { Task } from '../models/Task.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/', async (req, res) => {
  try {
    const projects = await Project.find({ 'members.user': req.user.id });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const project = await Project.create({
      name: req.body.name,
      owner: req.user.id,
      members: [{ user: req.user.id, role: 'OWNER' }]
    });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    const tasks = await Task.find({ projectId: req.params.id });
    res.json({ project, tasks });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/:id/tasks', async (req, res) => {
  try {
    const task = await Task.create({
      projectId: req.params.id,
      title: req.body.title,
      status: req.body.status || 'TODO'
    });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;