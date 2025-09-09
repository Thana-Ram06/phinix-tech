# 🔧 Manual Setup Guide - Step by Step

If the automated scripts aren't working, follow these manual steps:

## Step 1: Open Terminal/Command Prompt

**Windows:**
- Press `Win + R`, type `cmd`, press Enter
- Or press `Win + X` and select "Command Prompt"

**Mac/Linux:**
- Press `Cmd + Space` (Mac) or `Ctrl + Alt + T` (Linux)
- Type `terminal` and press Enter

## Step 2: Navigate to Project Directory

```bash
cd "D:\phenix tech"
```

## Step 3: Install Dependencies (One by One)

### 3.1 Install Root Dependencies
```bash
npm install
```

### 3.2 Install Server Dependencies
```bash
cd server
npm install
cd ..
```

### 3.3 Install Client Dependencies
```bash
cd client
npm install
cd ..
```

## Step 4: Start MongoDB

**Option A: If MongoDB is installed locally:**
```bash
mongod
```

**Option B: If using MongoDB Atlas (Cloud):**
- Skip this step, just make sure your connection string is correct

## Step 5: Seed Demo Data (Optional)

```bash
cd server
npm run seed
cd ..
```

## Step 6: Start the Application

**Option A: Start both frontend and backend together:**
```bash
npm run dev
```

**Option B: Start them separately (in different terminals):**

Terminal 1 (Backend):
```bash
cd server
npm run dev
```

Terminal 2 (Frontend):
```bash
cd client
npm start
```

## Step 7: Access the Application

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000

## 🚨 Common Issues & Solutions

### Issue 1: "npm is not recognized"
**Solution:** Install Node.js from https://nodejs.org/

### Issue 2: "MongoDB connection failed"
**Solution:** 
- Make sure MongoDB is running: `mongod`
- Or use MongoDB Atlas (cloud)

### Issue 3: "Port already in use"
**Solution:**
- Kill processes using ports 3000/5000
- Or change ports in configuration

### Issue 4: "Module not found"
**Solution:**
- Make sure you're in the correct directory
- Run `npm install` in each folder (root, server, client)

### Issue 5: "Permission denied" (Mac/Linux)
**Solution:**
```bash
chmod +x start.sh
./start.sh
```

## 📋 Quick Commands Reference

```bash
# Navigate to project
cd "D:\phenix tech"

# Install everything
npm install
cd server && npm install && cd ..
cd client && npm install && cd ..

# Start MongoDB (if local)
mongod

# Start application
npm run dev

# Or start separately
# Terminal 1:
cd server && npm run dev

# Terminal 2:
cd client && npm start
```

## ✅ Verification

You should see:
1. Backend running on port 5000
2. Frontend running on port 3000
3. No error messages in terminal
4. Can access http://localhost:3000 in browser

If you see any errors, check the error message and refer to the solutions above.
