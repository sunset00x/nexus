import mongoose from 'mongoose';

export async function connectDB() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/nexus';
  try {
    await mongoose.connect(uri);
    console.log('[Nexus System] Connected to MongoDB Database');
  } catch (err) {
    console.error('[Nexus System] Database Connection Error:', err);
  }
}