import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import dotenv from 'dotenv';

// Import routes
import authRoutes from './routes/auth.js';
import meetingsRoutes from './routes/meetings.js';
import transcriptionRoutes from './routes/transcription.js';
import integrationsRoutes from './routes/integrations.js';
import aiRoutes from './routes/ai.js';
import gamificationRoutes from './routes/gamification.js';
import securityRoutes from './routes/security.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  },
  transports: ['websocket', 'polling'],
  allowEIO3: true,
  // Mobile-friendly settings for development
  pingInterval: 60000,  // 60 seconds
  pingTimeout: 20000,   // 20 seconds
  upgradeTimeout: 30000, // 30 seconds
  allowUpgrades: true,
  cleanupEmptyChildNamespaces: true
});

// Middleware
app.use(cors());
app.use(express.json());

// Connect to in-memory MongoDB for development
async function connectToDatabase() {
  try {
    const mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    
    await mongoose.connect(uri);
    
    console.log('In-memory MongoDB connected');
  } catch (err) {
    console.error('Database connection error:', err);
    process.exit(1);
  }
}

connectToDatabase();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/meetings', meetingsRoutes);
app.use('/api/transcription', transcriptionRoutes);
app.use('/api/integrations', integrationsRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/gamification', gamificationRoutes);
app.use('/api/security', securityRoutes);

// Simple route
app.get('/', (req, res) => {
  res.send('AI Meeting App Backend Server is running!');
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Mobile device detection
  const isMobile = socket.handshake.headers['user-agent'] && 
    /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(socket.handshake.headers['user-agent']);
  
  // Set mobile-specific timeout values
  if (isMobile) {
    // Increase timeouts for mobile devices
    socket.setTimeout && socket.setTimeout(120000); // 2 minutes
  }

  // Handle room joining
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).emit('user-connected', userId);

    // Handle disconnect
    socket.on('disconnect', () => {
      socket.to(roomId).emit('user-disconnected', userId);
    });
  });

  // Handle WebRTC signaling
  socket.on('offer', (offer, roomId) => {
    socket.to(roomId).emit('offer', offer);
  });

  socket.on('answer', (answer, roomId) => {
    socket.to(roomId).emit('answer', answer);
  });

  socket.on('ice-candidate', (candidate, roomId) => {
    socket.to(roomId).emit('ice-candidate', candidate);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Development server is running on port ${PORT}`);
});