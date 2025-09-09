# 🔧 Troubleshooting Guide

## Common Terminal Issues & Solutions

### 1. "npm is not recognized" or "node is not recognized"

**Problem:** Node.js is not installed or not in PATH
**Solution:**
1. Download and install Node.js from https://nodejs.org/
2. Restart your terminal/command prompt
3. Verify installation: `node --version` and `npm --version`

### 2. "Cannot find module" errors

**Problem:** Dependencies not installed properly
**Solution:**
```bash
# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json
rm -rf server/node_modules server/package-lock.json
rm -rf client/node_modules client/package-lock.json

# Reinstall everything
npm install
cd server && npm install && cd ..
cd client && npm install && cd ..
```

### 3. "Port already in use" errors

**Problem:** Ports 3000 or 5000 are already in use
**Solution:**
```bash
# Windows - Kill processes on ports
netstat -ano | findstr :3000
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F

# Mac/Linux - Kill processes on ports
lsof -ti:3000 | xargs kill -9
lsof -ti:5000 | xargs kill -9
```

### 4. "MongoDB connection failed"

**Problem:** MongoDB is not running
**Solution:**
```bash
# Start MongoDB locally
mongod

# Or use MongoDB Atlas (cloud) - update MONGODB_URI in server/.env
```

### 5. "Permission denied" (Mac/Linux)

**Problem:** Script doesn't have execute permissions
**Solution:**
```bash
chmod +x start.sh
./start.sh
```

### 6. "EADDRINUSE" errors

**Problem:** Port is already in use
**Solution:**
1. Find what's using the port: `netstat -ano | findstr :5000`
2. Kill the process: `taskkill /PID <PID> /F`
3. Or change the port in server/.env

### 7. "Module not found" in specific folders

**Problem:** Dependencies not installed in correct folder
**Solution:**
```bash
# Make sure you're in the right directory
cd "D:\phenix tech"

# Install in each folder separately
npm install
cd server
npm install
cd ../client
npm install
cd ..
```

### 8. Windows PowerShell execution policy error

**Problem:** PowerShell won't run scripts
**Solution:**
```bash
# Run this in PowerShell as Administrator
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Or use Command Prompt instead of PowerShell
```

### 9. Path issues on Windows

**Problem:** Spaces in path causing issues
**Solution:**
```bash
# Use quotes around the path
cd "D:\phenix tech"

# Or rename folder to remove spaces
# Rename "phenix tech" to "phenixtech"
```

## Step-by-Step Manual Setup

If automated scripts fail, follow these steps:

### Step 1: Verify Prerequisites
```bash
node --version    # Should show v14 or higher
npm --version     # Should show v6 or higher
```

### Step 2: Install Dependencies Manually
```bash
# Root directory
cd "D:\phenix tech"
npm install

# Server directory
cd server
npm install
cd ..

# Client directory
cd client
npm install
cd ..
```

### Step 3: Start MongoDB
```bash
# In a separate terminal
mongod
```

### Step 4: Start Application
```bash
# Option 1: Both together
npm run dev

# Option 2: Separately (2 terminals)
# Terminal 1:
cd server && npm run dev

# Terminal 2:
cd client && npm start
```

## Quick Fix Commands

```bash
# Reset everything and start fresh
rm -rf node_modules package-lock.json
rm -rf server/node_modules server/package-lock.json
rm -rf client/node_modules client/package-lock.json

# Reinstall
npm install
cd server && npm install && cd ..
cd client && npm install && cd ..

# Start
npm run dev
```

## Still Having Issues?

1. **Check Node.js version:** Must be v14 or higher
2. **Check MongoDB:** Must be running on port 27017
3. **Check ports:** 3000 and 5000 must be available
4. **Check paths:** Make sure you're in the correct directory
5. **Check permissions:** Make sure you have write access to the folder

## Alternative: Use VS Code Terminal

1. Open VS Code
2. Open the project folder
3. Open integrated terminal (Ctrl + `)
4. Run commands from there

This often resolves path and permission issues.
