@echo off
echo Starting Local Backends...
echo.

echo Starting Main Backend (Port 5000)...
start "Main Backend" cmd /k "cd backend\server && npm install && npm start"

echo.
echo Starting Teacher Backend (Port 4000)...
start "Teacher Backend" cmd /k "cd Teach__Backend\server && npm install && npm start"

echo.
echo Both backends are starting...
echo Main Backend: http://localhost:5000
echo Teacher Backend: http://localhost:4000
echo.
echo Press any key to exit...
pause
