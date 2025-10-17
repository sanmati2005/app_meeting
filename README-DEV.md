# AI Meeting App - Development Setup

This document provides instructions for running the AI Meeting App in development mode with a fully functional backend.

## Prerequisites

1. Node.js (v14 or higher) installed
2. Git installed
3. Docker Desktop (optional, for MongoDB)

## Quick Start

### Option 1: Using the Batch File (Windows)

1. Double-click the `start-app.bat` file in the root directory
2. Two command windows will open:
   - Backend server (http://localhost:5000)
   - Frontend server (http://localhost:3000)

### Option 2: Manual Setup

1. Open a terminal and navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the backend server:
   ```
   npm run dev:memory
   ```

4. Open another terminal and navigate to the frontend directory:
   ```
   cd frontend
   ```

5. Install dependencies:
   ```
   npm install
   ```

6. Start the frontend server:
   ```
   npm run dev
   ```

## Access the Application

Once both servers are running:
- Open your browser and go to http://localhost:3000
- The backend API will be available at http://localhost:5000

## Features Now Working

1. **Real meeting scheduling** - You can create and schedule meetings
2. **Room joining** - Click "Join" to enter a meeting room
3. **Video controls** - Mute/unmute audio, start/stop video
4. **Screen sharing** - Share your screen with other participants
5. **End calls** - Properly leave meetings
6. **Navigation** - Move between different sections of the app

## Troubleshooting

### If you get MongoDB connection errors:
- The app now uses mongodb-memory-server for development, which should work without a separate MongoDB installation
- Make sure you're running `npm run dev:memory` and not `npm run dev`

### If you get module not found errors:
- Run `npm install` in both frontend and backend directories
- Make sure all dependencies are properly installed

### If you get ES module errors:
- Make sure you're using Node.js v14 or higher
- The project is configured to use ES modules

## For Production Deployment

### Frontend (Vercel):
1. Sign in to Vercel with your GitHub account (sanmatipt.123@gmail.com)
2. Connect your repository
3. Set environment variables in Vercel dashboard
4. Deploy

### Backend (Render):
1. Sign up at render.com
2. Create a new web service
3. Connect your GitHub repository
4. Set environment variables
5. Deploy

### Database (MongoDB Atlas):
1. Sign up at mongodb.com
2. Create a free cluster
3. Get your connection string
4. Update the backend `.env` file with your MongoDB URI

## File Structure

```
meetingapp/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   └── vite.config.js
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── server.js
│   └── .env
└── README.md
```