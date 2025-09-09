@echo off
echo ========================================
echo    CivicPulse Application Startup
echo ========================================
echo.

echo [1/4] Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install root dependencies
    pause
    exit /b 1
)

echo.
echo [2/4] Installing server dependencies...
cd server
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install server dependencies
    pause
    exit /b 1
)
cd ..

echo.
echo [3/4] Installing client dependencies...
cd client
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install client dependencies
    pause
    exit /b 1
)
cd ..

echo.
echo [4/4] Starting the application...
echo.
echo IMPORTANT: Make sure MongoDB is running on your system!
echo You can start MongoDB by running: mongod
echo.
echo The application will start on:
echo - Frontend: http://localhost:3000
echo - Backend: http://localhost:5000
echo.

call npm run dev

pause
