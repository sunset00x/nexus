import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongod = null;

export async function connectDB() {
  try {
    let uri = process.env.MONGODB_URI;

    // Launch an in-memory MongoDB instance automatically
    if (!uri || uri.includes('127.0.0.1') || uri.includes('localhost')) {
      mongod = await MongoMemoryServer.create();
      uri = mongod.getUri();
      console.log('[Nexus System] In-Memory MongoDB Started Automatically');
    }

    mongoose.set('strictQuery', false);
    await mongoose.connect(uri);
    console.log('[Nexus System] Connected to MongoDB Database');
  } catch (err) {
    console.error('[Nexus System] Database Connection Error:', err.message);
  }
}