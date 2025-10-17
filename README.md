# AI Meeting App

A beautiful, modern, and highly attractive AI-powered video meeting application with advanced collaboration features.

## 🌟 Features

### Core Video & Audio
- HD video and audio calls with adaptive bitrates
- Group video meetings supporting large numbers of participants
- Screen sharing options (entire screen, window, tab)
- Background blur, AI-powered dynamic virtual backgrounds, and live video filters
- Clear mic and camera toggle controls with visual feedback per participant
- Speaker detection and gallery/active speaker views
- Real-time voice waveforms on video feeds

### Meeting Management & Collaboration
- Create new meetings and schedule future meetings with calendar API integration
- Unique meeting IDs and easy-to-share invite links
- Robust waiting rooms and passcodes for secure meeting entry
- Breakout rooms functionality to split participants into smaller groups
- Meeting recording with AI-generated transcripts and notes
- AI-powered live meeting summary and action item generation
- Real-time polls, Q&A, chat, and interactive whiteboard with annotation
- Persistent chat with emoji reactions, message threading, and file sharing

### Participant & Host Controls
- Real-time participant list with status (online, muted, video on/off, raise hand)
- Host/moderator control to mute/unmute, spotlight, or remove participants
- Smart noise suppression and echo cancellation using AI
- Automated participant engagement analytics with personalized feedback

### Notifications & User Experience
- Real-time push notifications (join/leave, chat, invites)
- Meeting reminders via email and calendar integration
- In-app notifications with smooth animations
- Dark mode/light mode themes with sleek, minimalist UI design
- Responsive design for desktop, tablet, and smartphones
- Voice commands for muting, stopping video, screen sharing, and more
- Onboarding tutorials and user help overlay

### Backend & Integrations
- Scalable server infrastructure for signaling and media relay using WebRTC
- Secure authentication with OAuth and single sign-on (SSO)
- End-to-end encryption options for meetings
- Database for storing meeting schedules, user data, recordings, and analytics
- RESTful APIs and SDKs for third party integrations
- Integration with productivity tools (Google Drive, Microsoft Teams, Slack, Notion, Airtable)

### Unique AI-Powered Features
- Real-time emotional and sentiment analysis of voice and chat
- AI-driven smart meeting assistant providing live suggestions and reminders
- Gamification elements like participation scores, badges, and leaderboards
- AI-generated personalized meeting recaps sent automatically post-meeting
- Advanced voice cloning for accessibility features
- Automatic language translation and multilingual support with live subtitles

## 🏗️ Architecture

### Frontend
- **Framework**: React with Vite
- **State Management**: React Context API
- **Styling**: CSS Modules with modern CSS features
- **Real-time Communication**: Socket.IO client
- **UI Components**: Custom-built with modern design principles

### Backend
- **Framework**: Node.js with Express
- **Real-time Communication**: Socket.IO
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT with OAuth support
- **WebRTC**: For peer-to-peer video/audio communication
- **AI Services**: Integration with various AI APIs for transcription, translation, and analysis

### Infrastructure
- **Deployment**: Docker containers
- **Load Balancing**: Nginx
- **CDN**: For static assets
- **Monitoring**: Application performance monitoring

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/yourusername/meetingapp.git
cd meetingapp
```

2. **Install frontend dependencies:**
```bash
cd frontend
npm install
```

3. **Install backend dependencies:**
```bash
cd ../backend
npm install
```

4. **Set up environment variables:**
Create `.env` files in both `frontend` and `backend` directories with the required variables.

5. **Start the development servers:**
```bash
# In backend directory
npm run dev

# In frontend directory
npm run dev
```

### How to Join Meetings

#### For Meeting Hosts
1. Navigate to the "Meetings" tab
2. Click "+ Start Instant Meeting" for an immediate meeting
3. Or click "+ Schedule Meeting" to plan a future meeting
4. Share the generated Meeting ID with participants

#### For Participants
1. Get the Meeting ID from the host
2. Navigate to the Meetings page in the app
3. Click "Join" on the meeting you want to attend
4. Alternatively, join directly using the URL: `http://localhost:3002/room/{MEETING_ID}`

#### Technical Details
- Meetings use WebRTC for peer-to-peer video/audio communication
- Socket.IO handles real-time signaling between participants
- No sign-up required - anyone with the meeting ID can join
- All communication happens in real-time with low latency

### Project Structure
```
meetingapp/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── hooks/
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

## 🧪 Testing

### Frontend Testing
- Unit tests with Jest and React Testing Library
- Integration tests for complex components
- End-to-end tests with Cypress

### Backend Testing
- Unit tests with Jest
- Integration tests for API endpoints
- Load testing with Artillery

## 📦 Deployment

### Production Build
```bash
# Frontend
cd frontend
npm run build

# Backend
cd ../backend
npm start
```

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up --build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Thanks to all contributors who have helped build this project
- Inspired by modern video conferencing platforms with AI enhancements