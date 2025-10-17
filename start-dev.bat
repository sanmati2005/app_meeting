@echo off
echo Starting AI Meeting App Development Environment...

echo.
echo Starting Backend Server (in-memory MongoDB)...
cd backend
start "Backend Server" cmd /k "node server.dev.js"

echo.
echo Starting Frontend Server...
cd ../frontend
start "Frontend Server" cmd /k "npm run dev"

echo.
echo Development servers started!
echo Frontend: http://localhost:3001
echo Backend: http://localhost:5000
echo.
echo Press any key to exit...
pause >nul