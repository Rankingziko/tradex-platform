@echo off
REM TRADEX Startup Script - Windows
REM This script starts both backend and frontend servers

echo.
echo ╔════════════════════════════════════════╗
echo ║   TRADEX - Full Stack Startup Script   ║
echo ╚════════════════════════════════════════╝
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed. Please install it from https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js found
echo.

REM Navigate to server directory
cd /d c:\Users\Hp\OneDrive\Desktop\code\server
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to navigate to server directory
    pause
    exit /b 1
)

echo 📦 Installing backend dependencies...
call node -e "require('child_process').execSync('npm install', {stdio: 'inherit'})"
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to install backend dependencies
    pause
    exit /b 1
)

echo ✅ Backend dependencies installed
echo.

REM Start backend in a new window
echo 🚀 Starting backend server on port 5000...
start "TRADEX Backend" cmd /k "cd /d c:\Users\Hp\OneDrive\Desktop\code\server && node server.js"

timeout /t 3 /nobreak

REM Navigate to client directory
cd /d c:\Users\Hp\OneDrive\Desktop\code\client
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to navigate to client directory
    pause
    exit /b 1
)

echo 📦 Installing frontend dependencies (this may take a few minutes)...
call node -e "require('child_process').execSync('npm install', {stdio: 'inherit'})"
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to install frontend dependencies
    pause
    exit /b 1
)

echo ✅ Frontend dependencies installed
echo.

REM Start frontend in a new window
echo 🚀 Starting frontend server on port 3000...
start "TRADEX Frontend" cmd /k "cd /d c:\Users\Hp\OneDrive\Desktop\code\client && npm start"

echo.
echo ╔════════════════════════════════════════╗
echo ║         SERVERS STARTING...            ║
echo ╠════════════════════════════════════════╣
echo ║  Backend:  http://localhost:5000      ║
echo ║  Frontend: http://localhost:3000      ║
echo ║  API:      http://localhost:5000/api  ║
echo ╠════════════════════════════════════════╣
echo ║  Two terminal windows will open.       ║
echo ║  Close this window when done.          ║
echo ╚════════════════════════════════════════╝
echo.

pause
