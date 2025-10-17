@echo off
echo Starting AI Meeting App...

echo Starting Backend Server...
cd backend
start "Backend" cmd /k "node server.js"

echo Starting Frontend Server...
cd ../frontend
start "Frontend" cmd /k "npm run dev"

echo.
echo Application started!
echo Frontend will be available at http://localhost:3000
echo Backend will be available at http://localhost:5000
pause