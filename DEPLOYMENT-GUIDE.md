# Deployment Guide

## Docker Deployment (Recommended)

### Prerequisites
- Docker Desktop installed and running
- At least 4GB RAM available for Docker

### Deployment Steps

1. **Navigate to the project directory:**
   ```bash
   cd meetingapp
   ```

2. **Build and start all services:**
   ```bash
   docker-compose up --build -d
   ```

3. **Check the status of containers:**
   ```bash
   docker-compose ps
   ```

4. **Access the application:**
   - Main Application: http://localhost
   - Frontend Direct Access: http://localhost:3000
   - Backend API: http://localhost:5000

### Services Overview

| Service | Port | Description |
|---------|------|-------------|
| Nginx | 80/443 | Reverse proxy and load balancer |
| Frontend | 3000 | React application with Vite |
| Backend | 5000 | Node.js/Express API with Socket.IO |
| MongoDB | 27017 | Database for user data and meetings |

### Useful Docker Commands

- **Stop all services:**
  ```bash
  docker-compose down
  ```

- **View logs:**
  ```bash
  docker-compose logs
  ```

- **View specific service logs:**
  ```bash
  docker-compose logs backend
  ```

- **Restart services:**
  ```bash
  docker-compose restart
  ```

### Troubleshooting

1. **Port conflicts:**
   - Make sure no other services are running on ports 80, 443, 3000, 5000, or 27017
   - Use `netstat` or `lsof` to check for port usage

2. **Container fails to start:**
   - Check logs with `docker-compose logs [service-name]`
   - Ensure all environment variables are properly set

3. **Database connection issues:**
   - Verify MongoDB is running and accessible
   - Check connection string in backend environment variables

## Cloud Deployment Options

### Frontend Deployment
- **Vercel** (Recommended):
  1. Create a Vercel account
  2. Connect your GitHub repository
  3. Set environment variables:
     - VITE_BACKEND_URL = your backend URL
  4. Deploy

### Backend Deployment
- **Render** (Recommended):
  1. Create a Render account
  2. Create a new Web Service
  3. Connect your GitHub repository
  4. Set build command: `npm install`
  5. Set start command: `npm start`
  6. Add environment variables:
     - MONGO_URI = your MongoDB connection string
     - JWT_SECRET = your secret key
     - JWT_EXPIRE = 7d

### Database
- **MongoDB Atlas** (Recommended):
  1. Create a MongoDB Atlas account
  2. Create a new cluster
  3. Get the connection string
  4. Use this connection string in your backend environment variables

## Environment Variables

### Backend (.env)
```env
MONGO_URI=mongodb://admin:password@mongodb:27017/meetingapp?authSource=admin
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRE=7d
PORT=5000
```

### Frontend (.env)
```env
VITE_BACKEND_URL=http://localhost:5000
```

## Updating the Application

1. **Pull the latest code:**
   ```bash
   git pull origin main
   ```

2. **Rebuild and restart services:**
   ```bash
   docker-compose down
   docker-compose up --build -d
   ```

## Backup and Restore

### Database Backup
```bash
docker exec meetingapp-mongodb mongodump --db meetingapp --out /dump
```

### Database Restore
```bash
docker exec meetingapp-mongodb mongorestore --db meetingapp /dump/meetingapp
```