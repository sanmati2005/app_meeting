# How to Run the AI Meeting App

## Prerequisites
1. Node.js (v14 or higher) installed
2. MongoDB installed and running on default port (27017)

## Option 1: Using the Batch File (Windows)

1. Make sure MongoDB is running on your system
2. Double-click the `run-app.bat` file in the root directory
3. Two command windows will open:
   - Backend server (http://localhost:5000)
   - Frontend server (http://localhost:3000)

## Option 2: Manual Setup

### Start Backend Server:
```bash
cd backend
node server.js
```

### Start Frontend Server:
```bash
cd frontend
npm run dev
```

## Option 3: Using Docker (If Docker is properly configured)

```bash
docker-compose up --build
```

## Access the Application

Once both servers are running:
- Open your browser and go to http://localhost:3000
- The backend API will be available at http://localhost:5000

## Troubleshooting

1. If you get MongoDB connection errors:
   - Make sure MongoDB is installed and running
   - Check that MongoDB is listening on port 27017
   - Verify the connection string in the backend `.env` file

2. If you get module not found errors:
   - Run `npm install` in both frontend and backend directories
   - Make sure all dependencies are properly installed

3. If you get ES module errors:
   - This is a known issue with newer Node.js versions
   - Consider using Docker or downgrading Node.js to v16