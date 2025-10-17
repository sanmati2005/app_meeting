# AI Meeting App - Development Setup

## Running the Application

### Backend Server
The backend server is running on port 5000 with in-memory MongoDB:
- URL: http://localhost:5000
- Uses mongodb-memory-server for development (no need for separate MongoDB installation)

### Frontend Server
The frontend server is running on port 3001:
- URL: http://localhost:3001

## How to Run

### Prerequisites
1. Node.js (v14 or higher) installed
2. Git installed

### Starting the Application

1. **Start the backend server:**
   ```bash
   cd backend
   node server.dev.js
   ```

2. **Start the frontend server (in a new terminal):**
   ```bash
   cd frontend
   npm run dev
   ```

### Accessing the Application
1. Open your browser and go to http://localhost:3001
2. The backend API is available at http://localhost:5000

## Features

### Working Functionality
1. **Meeting Scheduling** - Create and schedule meetings
2. **Video Call Interface** - Join meetings with camera and microphone controls
3. **Meeting Controls** - Mute/unmute audio, start/stop video, share screen
4. **Navigation** - Move between different sections of the app

### Button Functionality
- **Mute/Unmute Audio** - Toggle microphone on/off
- **Start/Stop Video** - Toggle camera on/off
- **Share Screen** - Share your screen with other participants
- **End Call** - Leave the meeting
- **Join Meeting** - Enter a meeting room
- **Schedule Meeting** - Create new meetings

## Development Notes

### Architecture
- **Frontend**: React with Vite
- **Backend**: Node.js with Express
- **Database**: In-memory MongoDB for development
- **Real-time Communication**: Socket.IO

### File Structure
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
│   ├── server.dev.js (development server with in-memory MongoDB)
│   └── .env
```

### Environment Variables
- Backend: Check `backend/.env` for configuration
- Frontend: Check `frontend/.env` for configuration

## Troubleshooting

### If the backend fails to start:
1. Make sure you're running `node server.dev.js` and not `npm run dev`
2. Check that port 5000 is not in use by another application

### If the frontend fails to start:
1. Make sure you're in the `frontend` directory
2. Check that port 3000/3001 is not in use by another application

### If buttons aren't working:
1. Make sure both frontend and backend servers are running
2. Check the browser console for any errors
3. Verify that the WebSocket connection is established

## For Production Deployment

### Frontend (Vercel):
1. Sign in to Vercel with your GitHub account
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