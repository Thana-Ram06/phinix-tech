# CivicPulse Startup Script for PowerShell
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "    CivicPulse Application Startup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js not found. Please install Node.js from https://nodejs.org/" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if npm is available
try {
    $npmVersion = npm --version
    Write-Host "✓ npm found: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ npm not found. Please install Node.js with npm" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "[1/4] Installing root dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to install root dependencies" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "[2/4] Installing server dependencies..." -ForegroundColor Yellow
Set-Location server
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to install server dependencies" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Set-Location ..

Write-Host ""
Write-Host "[3/4] Installing client dependencies..." -ForegroundColor Yellow
Set-Location client
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to install client dependencies" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Set-Location ..

Write-Host ""
Write-Host "[4/4] Starting the application..." -ForegroundColor Yellow
Write-Host ""
Write-Host "IMPORTANT: Make sure MongoDB is running on your system!" -ForegroundColor Red
Write-Host "You can start MongoDB by running: mongod" -ForegroundColor Yellow
Write-Host ""
Write-Host "The application will start on:" -ForegroundColor Green
Write-Host "- Frontend: http://localhost:3000" -ForegroundColor Green
Write-Host "- Backend: http://localhost:5000" -ForegroundColor Green
Write-Host ""

npm run dev

Read-Host "Press Enter to exit"
