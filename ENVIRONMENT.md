# Environment Configuration

## Environment Variables

### Frontend (.env file)
```bash
VITE_BACKEND_URL=http://localhost:5000
```

This variable is used to configure the API base URL for all backend requests.

### Backend (.env file)
```bash
MONGO_URI=mongodb://localhost:27017/meetingapp
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRE=7d
PORT=5000
```

## Configuration Files

### Frontend Configuration (vite.config.js)
The frontend uses Vite with proxy configuration for API requests:
- Port: 3000 (or next available port)
- Proxy: `/api` requests are forwarded to the backend URL
- Auto-open browser on start

### Backend Configuration (server.js)
The backend uses:
- Port: 5000
- MongoDB connection via MONGO_URI
- JWT authentication
- Socket.IO for real-time communication

## Running the Application

### Development Mode
1. Start the backend server:
   ```bash
   cd backend
   npm run dev
   ```

2. Start the frontend server:
   ```bash
   cd frontend
   npm run dev
   ```

### Production Mode
1. Build the frontend:
   ```bash
   cd frontend
   npm run build
   ```

2. Start the backend:
   ```bash
   cd backend
   npm start
   ```

## API Integration

The frontend uses the `api.js` service to communicate with the backend:
- All API requests are prefixed with `/api`
- Authentication is handled via JWT tokens in localStorage
- Error handling and fallback mechanisms are implemented

## Port Information
- Frontend: http://localhost:3000 (or next available port)
- Backend: http://localhost:5000
- MongoDB: mongodb://localhost:27017

## Troubleshooting

### Environment Variable Issues
1. Ensure `.env` files exist in both frontend and backend directories
2. Restart development servers after changing environment variables
3. Check that variables are properly referenced in configuration files

### Connection Issues
1. Verify that backend server is running on the correct port
2. Check MongoDB connection string in backend `.env`
3. Ensure firewall settings allow connections on required ports