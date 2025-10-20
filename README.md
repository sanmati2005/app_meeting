# AI Meeting App

An AI-powered video meeting application with real-time collaboration features.

## Project Structure

```
meetingapp/
├── frontend/          # React frontend application
├── backend/           # Node.js/Express backend API
├── DEPLOYMENT-INSTRUCTIONS.md  # Detailed deployment guide
└── README.md          # This file
```

## Features

- Real-time video conferencing with WebRTC
- AI-powered meeting transcription
- Meeting recording and playback
- Gamification elements
- Security features
- Integration with third-party services

## Tech Stack

### Frontend
- React 18+
- Vite
- Material-UI
- Socket.IO Client

### Backend
- Node.js
- Express
- MongoDB/Mongoose
- Socket.IO
- JSON Web Tokens (JWT)

## Getting Started

### Prerequisites
- Node.js >= 20.0.0
- MongoDB (local or Atlas)

### Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd meetingapp
   ```

2. Install dependencies for both frontend and backend:
   ```bash
   # Install backend dependencies
   cd backend
   npm install
   cd ..
   
   # Install frontend dependencies
   cd frontend
   npm install
   cd ..
   ```

3. Set up environment variables:
   - Create `backend/.env` (see backend/README.md)
   - Create `frontend/.env` (see frontend/README.md)

4. Run the development servers:
   ```bash
   # Run both frontend and backend
   npm run dev
   
   # Or run separately
   # Terminal 1: Backend
   cd backend
   npm run dev
   
   # Terminal 2: Frontend
   cd frontend
   npm run dev
   ```

## Deployment

See [DEPLOYMENT-INSTRUCTIONS.md](DEPLOYMENT-INSTRUCTIONS.md) for detailed deployment instructions for:
- Frontend on Vercel
- Backend on Render.com

## Project Documentation

- [Frontend README](frontend/README.md)
- [Backend README](backend/README.md)
- [Deployment Instructions](DEPLOYMENT-INSTRUCTIONS.md)
