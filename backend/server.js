import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import mongoose from 'mongoose';
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
    origin: process.env.NODE_ENV === 'production' 
      ? ["https://app-meeting-25nw.vercel.app", "https://app-meeting-25nw.vercel.app/"] 
      : "*",
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ['websocket', 'polling'],
  allowEIO3: true
});

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log('MongoDB connected');
}).catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

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

// Store active participants and their join times
const activeParticipants = new Map();
// Store socket IDs for participants
const participantSockets = new Map();

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Handle room joining
  socket.on('join-room', async (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).emit('user-connected', userId);

    // Record join time
    const joinTime = new Date();
    activeParticipants.set(`${roomId}-${userId}`, {
      userId,
      roomId,
      joinTime,
      lastActive: joinTime
    });
    
    // Record socket ID for participant
    participantSockets.set(`${roomId}-${userId}`, socket.id);

    // Update meeting document with participant join time
    try {
      // Notify other participants
      socket.to(roomId).emit('participant-joined', { userId, joinTime });
    } catch (error) {
      console.error('Error updating participant join time:', error);
    }

    // Handle disconnect
    socket.on('disconnect', async () => {
      const participantKey = `${roomId}-${userId}`;
      const participantData = activeParticipants.get(participantKey);
      
      if (participantData) {
        const leaveTime = new Date();
        const duration = leaveTime - participantData.joinTime;
        
        // Remove from active participants
        activeParticipants.delete(participantKey);
        participantSockets.delete(participantKey);
        
        // Notify other participants
        socket.to(roomId).emit('user-disconnected', userId);
        
        // Update meeting document with participant leave time and duration
        try {
          // In a real implementation, this would update the meeting document
          console.log(`Participant ${userId} left room ${roomId} after ${duration}ms`);
        } catch (error) {
          console.error('Error updating participant leave time:', error);
        }
      }
    });
  });

  // Handle participant mute status change
  socket.on('mute-status-change', (data) => {
    const { roomId, userId, muted } = data;
    socket.to(roomId).emit('participant-muted', { userId, muted });
    
    // Update last active time
    const participantKey = `${roomId}-${userId}`;
    const participantData = activeParticipants.get(participantKey);
    if (participantData) {
      participantData.lastActive = new Date();
      activeParticipants.set(participantKey, participantData);
    }
  });

  // Handle participant video status change
  socket.on('video-status-change', (data) => {
    const { roomId, userId, videoOff } = data;
    socket.to(roomId).emit('participant-video-changed', { userId, videoOff });
    
    // Update last active time
    const participantKey = `${roomId}-${userId}`;
    const participantData = activeParticipants.get(participantKey);
    if (participantData) {
      participantData.lastActive = new Date();
      activeParticipants.set(participantKey, participantData);
    }
  });

  // Handle hand raise
  socket.on('hand-raise', (data) => {
    const { roomId, userId, raised } = data;
    socket.to(roomId).emit('participant-hand-raised', { userId, raised });
    
    // Update last active time
    const participantKey = `${roomId}-${userId}`;
    const participantData = activeParticipants.get(participantKey);
    if (participantData) {
      participantData.lastActive = new Date();
      activeParticipants.set(participantKey, participantData);
    }
  });

  // Handle participant removal
  socket.on('remove-participant', (data) => {
    const { roomId, participantId } = data;
    socket.to(roomId).emit('participant-removed', { participantId });
    
    // Also notify the removed participant directly
    const participantKey = `${roomId}-${participantId}`;
    const participantSocketId = participantSockets.get(participantKey);
    if (participantSocketId) {
      // Find the socket and send a direct message
      const participantSocket = io.sockets.sockets.get(participantSocketId);
      if (participantSocket) {
        participantSocket.emit('you-were-removed', { roomId });
      }
    }
  });

  // Handle spotlight participant
  socket.on('spotlight-participant', (data) => {
    const { roomId, participantId, spotlighted } = data;
    socket.to(roomId).emit('participant-spotlighted', { participantId, spotlighted });
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

const PORT = process.env.PORT || 5001;

// Start server
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});