# Setup Guide

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Initial Setup](#initial-setup)
3. [Environment Configuration](#environment-configuration)
4. [Database Setup](#database-setup)
5. [Running the Application](#running-the-application)
6. [Development Workflow](#development-workflow)
7. [Troubleshooting](#troubleshooting)

## Prerequisites

### WHAT

Required software and tools to run the Employee & HR Management Portal.

### WHY

These tools are essential for:
- **Node.js**: Runtime for both frontend and backend
- **MongoDB**: Database for storing application data
- **npm**: Package manager for dependencies
- **Git**: Version control

### HOW

Install the following:

1. **Node.js** (>= 18.0.0)
   - Download from [nodejs.org](https://nodejs.org/)
   - Verify: `node --version`

2. **npm** (>= 9.0.0)
   - Comes with Node.js
   - Verify: `npm --version`

3. **MongoDB** (>= 6.0)
   - Option 1: Local installation
     - Download from [mongodb.com](https://www.mongodb.com/try/download/community)
     - Start MongoDB service
   - Option 2: MongoDB Atlas (cloud)
     - Create account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
     - Get connection string

4. **Git** (optional, for version control)
   - Download from [git-scm.com](https://git-scm.com/)

## Initial Setup

### WHAT

Clone the repository and install dependencies.

### WHY

Monorepo structure requires installing dependencies at the root level, which will install dependencies for all workspace packages.

### HOW

```bash
# Clone the repository (if using Git)
git clone <repository-url>
cd employee-hr-portal

# Install all dependencies (root + all workspaces)
npm install

# This will install:
# - Root dependencies (concurrently, typescript)
# - Frontend dependencies (React, Vite, etc.)
# - Backend dependencies (NestJS, MongoDB, etc.)
```

**Expected Output:**
- `node_modules/` folder at root
- `packages/frontend/node_modules/` (if not hoisted)
- `packages/backend/node_modules/` (if not hoisted)

## Environment Configuration

### WHAT

Configure environment variables for frontend and backend.

### WHY

Environment variables allow:
- Different configurations for development, staging, production
- Secure storage of secrets (API keys, database URLs)
- Easy configuration without code changes

### HOW

### Backend Environment

1. Copy the example file:
```bash
cp packages/backend/.env.example packages/backend/.env
```

2. Edit `packages/backend/.env`:
```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/employee-hr-portal
# Or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/employee-hr-portal

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production
JWT_REFRESH_EXPIRES_IN=30d

# CORS
CORS_ORIGIN=http://localhost:5173

# Rate Limiting
RATE_LIMIT_TTL=60
RATE_LIMIT_MAX=100
```

**Security Note**: 
- Never commit `.env` files to Git
- Use strong, random values for JWT secrets in production
- Rotate secrets regularly

### Frontend Environment

1. Copy the example file:
```bash
cp packages/frontend/.env.example packages/frontend/.env
```

2. Edit `packages/frontend/.env`:
```env
# API Configuration
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=Employee HR Portal

# Feature Flags (optional)
VITE_ENABLE_ANALYTICS=false
```

**Note**: Vite requires `VITE_` prefix for environment variables to be exposed to the client.

## Database Setup

### WHAT

Set up MongoDB database and initial collections.

### WHY

MongoDB needs to be running and accessible before the backend can start. Initial setup ensures proper database structure.

### HOW

### Option 1: Local MongoDB

1. **Start MongoDB Service:**
   ```bash
   # Windows
   net start MongoDB
   
   # macOS (if installed via Homebrew)
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   ```

2. **Verify MongoDB is running:**
   ```bash
   mongosh
   # Or: mongo (older versions)
   ```

3. **Create database (optional, will be created automatically):**
   ```javascript
   use employee-hr-portal
   ```

### Option 2: MongoDB Atlas

1. **Create Cluster:**
   - Log in to MongoDB Atlas
   - Create a new cluster (free tier available)
   - Wait for cluster to be created

2. **Configure Network Access:**
   - Go to Network Access
   - Add IP address (0.0.0.0/0 for development, restrict in production)

3. **Create Database User:**
   - Go to Database Access
   - Create user with read/write permissions
   - Save username and password

4. **Get Connection String:**
   - Go to Clusters → Connect
   - Choose "Connect your application"
   - Copy connection string
   - Replace `<password>` with your database user password
   - Use in `MONGODB_URI` in backend `.env`

### Initial Data (Optional)

The backend will create collections automatically when data is inserted. For initial admin user, you can:

1. Use a seed script (if available):
   ```bash
   npm run seed --workspace=packages/backend
   ```

2. Or use MongoDB Compass to insert initial data

## Running the Application

### WHAT

Start development servers for frontend and backend.

### WHY

Development mode provides:
- Hot Module Replacement (HMR) for fast development
- Source maps for debugging
- Detailed error messages
- Auto-reload on file changes

### HOW

### Option 1: Run Both Together

```bash
# From root directory
npm run dev

# This runs:
# - Frontend on http://localhost:5173
# - Backend on http://localhost:3000
```

### Option 2: Run Separately

**Terminal 1 - Backend:**
```bash
npm run dev:backend
# Backend runs on http://localhost:3000
```

**Terminal 2 - Frontend:**
```bash
npm run dev:frontend
# Frontend runs on http://localhost:5173
```

### Verify Setup

1. **Backend Health Check:**
   - Open browser: http://localhost:3000/api/health
   - Should return: `{ "status": "ok" }`

2. **Frontend:**
   - Open browser: http://localhost:5173
   - Should see the application

## Development Workflow

### WHAT

Recommended workflow for developing features.

### WHY

Following a consistent workflow ensures:
- Code quality
- Proper testing
- Documentation maintenance
- Team collaboration

### HOW

1. **Create Feature Branch:**
   ```bash
   git checkout -b feature/feature-name
   ```

2. **Develop Feature:**
   - Write code following project structure
   - Add tests
   - Update documentation

3. **Run Tests:**
   ```bash
   npm run test
   ```

4. **Lint Code:**
   ```bash
   npm run lint
   npm run lint:fix  # Auto-fix issues
   ```

5. **Type Check:**
   ```bash
   npm run type-check
   ```

6. **Commit Changes:**
   ```bash
   git add .
   git commit -m "feat: add feature description"
   ```

7. **Push and Create PR:**
   ```bash
   git push origin feature/feature-name
   ```

## Troubleshooting

### Common Issues

#### 1. Port Already in Use

**Error**: `EADDRINUSE: address already in use :::3000`

**Solution**:
```bash
# Find process using port (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or change port in .env file
PORT=3001
```

#### 2. MongoDB Connection Failed

**Error**: `MongoServerError: connect ECONNREFUSED`

**Solutions**:
- Verify MongoDB is running: `mongosh`
- Check `MONGODB_URI` in `.env`
- For Atlas: Check network access and credentials

#### 3. Module Not Found

**Error**: `Cannot find module 'xxx'`

**Solution**:
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

#### 4. TypeScript Errors

**Error**: Type errors in IDE

**Solution**:
```bash
# Restart TypeScript server in IDE
# Or run type check
npm run type-check
```

#### 5. CORS Errors

**Error**: `CORS policy: No 'Access-Control-Allow-Origin' header`

**Solution**:
- Check `CORS_ORIGIN` in backend `.env` matches frontend URL
- Verify frontend `VITE_API_URL` matches backend URL

### Getting Help

1. Check documentation in `docs/` folder
2. Review error messages carefully
3. Check GitHub issues (if applicable)
4. Ask team members

---

**Last Updated**: Initial version
**Maintained By**: Development Team

