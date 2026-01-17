# Quick Start Guide

## WHAT

This guide helps you get the Employee HR Portal up and running in minutes.

## WHY

A quick start guide enables developers to:
- Start contributing immediately
- Verify their setup is correct
- Understand the basic workflow

## HOW

### Prerequisites Check

```bash
# Check Node.js version (should be >= 18.0.0)
node --version

# Check npm version (should be >= 9.0.0)
npm --version

# Check MongoDB (if using local)
mongosh --version
```

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
# Backend
cp packages/backend/.env.example packages/backend/.env
# Edit packages/backend/.env with your MongoDB URI

# Frontend
cp packages/frontend/.env.example packages/frontend/.env
# Edit packages/frontend/.env if needed
```

### Start Development

```bash
# Option 1: Run both frontend and backend
npm run dev

# Option 2: Run separately
# Terminal 1
npm run dev:backend

# Terminal 2
npm run dev:frontend
```

### Verify Setup

1. **Backend Health Check**
   - Open: http://localhost:3000/api/health
   - Should see: `{"status":"ok","timestamp":"..."}`

2. **Frontend**
   - Open: http://localhost:5173
   - Should see: Employee HR Portal homepage

### Next Steps

1. Read [ARCHITECTURE.md](./ARCHITECTURE.md) to understand the structure
2. Read [CONTRIBUTING.md](./CONTRIBUTING.md) for development guidelines
3. Check [FEATURES.md](./FEATURES.md) for planned features
4. Start building features!

---

**Last Updated**: Initial version

