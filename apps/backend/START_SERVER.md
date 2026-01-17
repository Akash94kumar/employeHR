# Server Start Guide

## Problem: ERR_CONNECTION_REFUSED

Agar aapko `ERR_CONNECTION_REFUSED` error aa raha hai, iska matlab server nahi chal raha.

## Solution: Server Start Karein

### Step 1: .env File Check Karein

`apps/backend/.env` file mein yeh variables honi chahiye:

```env
NODE_ENV=development
PORT=3000

MONGODB_URI=mongodb+srv://divya78rani_db_user:YOUR_PASSWORD@cluster0.6vtjy40.mongodb.net/employee-hr-portal?retryWrites=true&w=majority

CORS_ORIGIN=http://localhost:5173

# IMPORTANT: JWT Secrets (at least 32 characters each)
JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters-long-change-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-at-least-32-characters-long-change-in-production
```

### Step 2: Server Start Karein

**Option 1: Terminal se (Recommended)**
```bash
cd apps/backend
npm run dev
```

**Option 2: Root se**
```bash
npm run dev:backend-express
```

### Step 3: Verify Server

Agar server sahi se start hua, to aapko yeh dikhega:
```
✅ MongoDB connected successfully
📊 MongoDB connection established
🚀 Server running on http://localhost:3000
📝 Environment: development
🔗 Health check: http://localhost:3000/api/health
```

### Step 4: Test API

Browser ya Thunder Client mein:
- Health Check: `http://localhost:3000/api/health`
- Swagger UI: `http://localhost:3000/api-docs`
- Register: `http://localhost:3000/api/auth/register`

## Common Issues

### Issue 1: "JWT_SECRET must be at least 32 characters"

**Solution**: `.env` file mein JWT_SECRET aur JWT_REFRESH_SECRET add karein (minimum 32 characters)

### Issue 2: "MONGODB_URI is not defined"

**Solution**: `.env` file mein MONGODB_URI add karein with correct password

### Issue 3: "Port 3000 already in use"

**Solution**: 
- Ya to port change karein `.env` mein: `PORT=3001`
- Ya jo process port 3000 use kar raha hai, usko stop karein

### Issue 4: MongoDB connection failed

**Solution**: 
- MongoDB Atlas mein Network Access check karein
- Password sahi hai ya nahi verify karein
- Connection string sahi hai ya nahi check karein

## Quick Start Commands

```bash
# 1. Navigate to backend
cd apps/backend

# 2. Check .env file exists
# (Make sure JWT_SECRET and JWT_REFRESH_SECRET are set)

# 3. Start server
npm run dev

# 4. Open browser
# http://localhost:3000/api-docs (Swagger UI)
# http://localhost:3000/api/health (Health check)
```

