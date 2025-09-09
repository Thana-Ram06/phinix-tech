# 🚀 CivicPulse Setup Guide

This guide will help you set up and run the CivicPulse application on your local machine.

## 📋 Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** (v4.4 or higher) - [Download here](https://www.mongodb.com/try/download/community)
- **Git** (optional) - [Download here](https://git-scm.com/)

## 🛠 Installation Steps

### Step 1: Install Dependencies

Open your terminal/command prompt in the project directory and run:

```bash
npm run install-all
```

This will install dependencies for both the frontend and backend.

### Step 2: Set Up Environment Variables

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Copy the environment template:
   ```bash
   copy env.example .env
   ```
   (On Mac/Linux: `cp env.example .env`)

3. Edit the `.env` file with your configuration:
   ```env
   MONGODB_URI=mongodb://localhost:27017/civicpulse
   JWT_SECRET=your_super_secret_jwt_key_here
   PORT=5000
   ```

### Step 3: Start MongoDB

**Option A: Local MongoDB**
```bash
# Start MongoDB service
mongod
```

**Option B: MongoDB Atlas (Cloud)**
- Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
- Create a new cluster
- Get your connection string
- Update `MONGODB_URI` in your `.env` file

### Step 4: Seed Demo Data (Optional)

To populate the database with sample data:

```bash
cd server
npm run seed
```

This creates:
- 3 demo officials
- 4 sample complaints
- Demo login: `demo@civicpulse.com` / `demo123`

### Step 5: Start the Application

From the root directory, run:

```bash
npm run dev
```

This starts both:
- Backend server on http://localhost:5000
- Frontend development server on http://localhost:3000

## 🌐 Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

## 🎯 Quick Demo

### For Citizens:
1. Go to http://localhost:3000
2. Click "Report an Issue"
3. Upload a photo and fill out the form
4. View public issues and leaderboard

### For Officials:
1. Go to http://localhost:3000/admin/login
2. Login with: `demo@civicpulse.com` / `demo123`
3. View and manage complaints in the dashboard

## 🔧 Troubleshooting

### Common Issues:

**1. MongoDB Connection Error**
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Make sure MongoDB is running. Start it with `mongod` or check your MongoDB service.

**2. Port Already in Use**
```
Error: listen EADDRINUSE :::5000
```
**Solution**: Kill the process using port 5000 or change the PORT in your `.env` file.

**3. Module Not Found**
```
Error: Cannot find module 'express'
```
**Solution**: Run `npm run install-all` to install all dependencies.

**4. Image Upload Issues**
```
Error: ENOENT: no such file or directory 'uploads'
```
**Solution**: The server automatically creates the uploads directory. If it fails, create it manually:
```bash
mkdir server/uploads
```

### Getting Help:

1. Check the console for error messages
2. Ensure all dependencies are installed
3. Verify MongoDB is running
4. Check that ports 3000 and 5000 are available

## 📁 Project Structure

```
civicpulse/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   └── App.js         # Main app component
│   └── package.json
├── server/                # Node.js backend
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── scripts/          # Utility scripts
│   └── index.js          # Server entry point
├── package.json          # Root package.json
└── README.md
```

## 🚀 Production Deployment

### Backend (Heroku Example):
1. Create a Heroku app
2. Set environment variables in Heroku dashboard
3. Connect to MongoDB Atlas
4. Deploy the server folder

### Frontend (Netlify Example):
1. Build the React app: `npm run build`
2. Deploy the `client/build` folder to Netlify
3. Update API endpoints for production

## 🎉 You're Ready!

Your CivicPulse application should now be running successfully. Start exploring the features and customize it for your needs!

For more information, check the main [README.md](README.md) file.
