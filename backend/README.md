# Backend for AI Meeting App

This is the backend for the AI-powered video meeting application built with Node.js, Express, and MongoDB.

## Getting Started

### Prerequisites
- Node.js >= 20.0.0
- MongoDB (local or Atlas)
- npm or yarn

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

## Environment Variables

Create a `.env` file in this directory with the following variables:

```
MONGO_URI=mongodb://localhost:27017/meetingapp
PORT=5001
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRE=30d
```

For production deployment, set `MONGO_URI` to your MongoDB Atlas connection string.

## Available Scripts

- `npm run dev` - Starts the development server with nodemon
- `npm start` - Starts the production server
- `npm run lint` - Runs ESLint on the source files

## API Endpoints

- `/api/auth` - Authentication routes
- `/api/meetings` - Meeting management routes
- `/api/transcription` - Transcription services
- `/api/integrations` - Third-party integrations
- `/api/ai` - AI-powered features
- `/api/gamification` - Gamification features
- `/api/security` - Security-related endpoints

## Socket.IO Events

The backend uses Socket.IO for real-time communication:
- `join-room` - Join a meeting room
- `user-connected` - Notify when a user connects
- `user-disconnected` - Notify when a user disconnects
- `offer` - WebRTC offer
- `answer` - WebRTC answer
- `ice-candidate` - WebRTC ICE candidate