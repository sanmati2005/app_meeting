@echo off
echo Starting AI Meeting App for Deployment...

echo.
echo Starting Backend Server (in-memory MongoDB)...
cd backend
start "Backend Server" cmd /k "node server.dev.js"

echo.
echo Starting Frontend Server...
cd ../frontend
start "Frontend Server" cmd /k "npm run dev"

echo.
echo Application deployed locally!
echo Frontend: http://localhost:3002
echo Backend: http://localhost:5000
echo.
echo Press Ctrl+C to stop the servers...
pause >nul