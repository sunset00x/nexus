import http from 'http';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import { setupWebSockets } from './sockets/collaboration.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);

app.use(express.json());

// API Endpoints
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);

// Static Client Asset Delivery Engine (No HTML/CSS files written manually)
app.use('/src', express.static(path.join(__dirname, '../frontend/src')));

app.get('*', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nexus — Real-Time Collaborative Workspace</title>
</head>
<body>
    <script type="module" src="/src/main.js"></script>
</body>
</html>`);
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  setupWebSockets(server);
  server.listen(PORT, () => {
    console.log(`=================================================`);
    console.log(`[Nexus Platform] Running at http://localhost:${PORT}`);
    console.log(`=================================================`);
  });
});