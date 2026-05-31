@echo off
REM TRADEX - ngrok Setup Script for Windows
REM This script sets up ngrok to share TRADEX with others via the internet

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║  TRADEX - ngrok Internet Sharing Setup                      ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

REM Check if ngrok exists
where ngrok >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ ngrok is not installed or not in PATH
    echo.
    echo 📦 INSTALLATION REQUIRED
    echo.
    echo Download ngrok from: https://ngrok.com/download
    echo.
    echo Steps:
    echo 1. Visit: https://ngrok.com/download
    echo 2. Download ngrok for Windows
    echo 3. Extract to: C:\Program Files\ngrok
    echo 4. Add to PATH (or run from extraction folder)
    echo 5. Run this script again
    echo.
    pause
    exit /b 1
)

echo ✅ ngrok found!
echo.
echo 🔑 AUTHENTICATION SETUP
echo.
echo To use ngrok, you need:
echo 1. Free ngrok account: https://ngrok.com/signup
echo 2. Your authtoken from: https://dashboard.ngrok.com/get-started/your-authtoken
echo.

set /p AUTHTOKEN="Enter your ngrok auth token: "

if "%AUTHTOKEN%"=="" (
    echo ❌ No auth token provided
    pause
    exit /b 1
)

echo.
echo 🔐 Configuring ngrok with your auth token...
ngrok config add-authtoken %AUTHTOKEN%

if %errorlevel% equ 0 (
    echo ✅ Auth token configured successfully!
) else (
    echo ❌ Failed to configure auth token
    pause
    exit /b 1
)

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║  TRADEX Ready for Internet Sharing!                         ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

echo To share TRADEX with others:
echo.
echo 🌐 OPTION 1: Share Backend API
echo    Command: ngrok http 5000 --region us
echo    This creates public URL for the API
echo.
echo 🌐 OPTION 2: Share Test Page  
echo    Command: ngrok http 8080 --region us
echo    This creates public URL for landing page
echo.
echo 🌐 OPTION 3: Share Frontend
echo    Command: ngrok http 3000 --region us
echo    This creates public URL for full website
echo.
echo 📋 EXAMPLE (in separate terminal windows):
echo.
echo Terminal 1:
echo   ngrok http 5000 --region us
echo.
echo Terminal 2:
echo   ngrok http 8080 --region us
echo.
echo Then share the URLs with others!
echo.
echo Press any key to open ngrok.com dashboard...
pause

start "" https://dashboard.ngrok.com/

echo.
echo ✅ Setup complete! Visit: https://dashboard.ngrok.com/
echo.
pause
