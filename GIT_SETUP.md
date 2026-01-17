# Git Setup & GitHub Push Guide

## ✅ Security Check

`.gitignore` file properly configured to exclude:
- ✅ `node_modules/` - Dependencies (not needed in repo)
- ✅ `.env` files - Environment variables with tokens/secrets
- ✅ Build outputs (`dist/`, `build/`)
- ✅ Log files
- ✅ Cache files

## 🚀 GitHub Push Steps

### 1. Check Current Status

```bash
git status
```

### 2. Add All Files (except ignored ones)

```bash
git add .
```

**Important**: `.env` files and `node_modules` will NOT be added (they're in `.gitignore`)

### 3. Verify What Will Be Committed

```bash
git status
```

Make sure you DON'T see:
- ❌ `.env` files
- ❌ `node_modules/` folders
- ❌ Any files with tokens/secrets

### 4. Create First Commit

```bash
git commit -m "Initial commit: Employee HR Management Portal

- MERN stack setup
- Authentication & Authorization
- Role-based access control (SUPER_ADMIN, HR, EMPLOYEE)
- Admin HR Management module
- Navigation & Logout functionality
- Token persistence fix
- Design system with styled-components
- Database models and seeding"
```

### 5. Create GitHub Repository

1. Go to [GitHub](https://github.com)
2. Click "New repository"
3. Name: `employeHR` (or your preferred name)
4. **DO NOT** initialize with README, .gitignore, or license
5. Click "Create repository"

### 6. Add Remote and Push

```bash
# Add GitHub remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/employeHR.git

# Or if using SSH:
# git remote add origin git@github.com:YOUR_USERNAME/employeHR.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## 🔒 Security Reminders

### Before Pushing:

1. **Check for .env files**:
   ```bash
   git status | grep .env
   ```
   Should return nothing!

2. **Check for node_modules**:
   ```bash
   git status | grep node_modules
   ```
   Should return nothing!

3. **Verify .gitignore is working**:
   ```bash
   git check-ignore -v apps/backend/.env
   ```
   Should show that .env is ignored

### If .env File Already Committed (Emergency):

```bash
# Remove from git history (but keep local file)
git rm --cached apps/backend/.env

# Commit the removal
git commit -m "Remove .env file from repository"

# Push
git push
```

## 📝 Environment Variables Setup

Since `.env` files are NOT in repository, create `.env.example` files:

### `apps/backend/.env.example`:
```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/employehr?retryWrites=true&w=majority

# JWT Secrets
JWT_ACCESS_SECRET=your_access_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here

# Server
PORT=3000
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:5173
```

### `packages/frontend/.env.example`:
```env
VITE_API_URL=http://localhost:3000/api
```

## 🔄 Future Updates

### Daily Workflow:

```bash
# Check status
git status

# Add changes
git add .

# Commit
git commit -m "Description of changes"

# Push
git push
```

### Branch Strategy (Optional):

```bash
# Create feature branch
git checkout -b feature/new-feature

# Work on feature
# ... make changes ...

# Commit
git add .
git commit -m "Add new feature"

# Push branch
git push -u origin feature/new-feature

# Merge to main (on GitHub or locally)
git checkout main
git merge feature/new-feature
git push
```

## ⚠️ Important Notes

1. **Never commit**:
   - `.env` files
   - `node_modules/`
   - API keys, tokens, passwords
   - Personal credentials

2. **Always check** `git status` before committing

3. **Use `.env.example`** files to document required environment variables

4. **If secrets are accidentally committed**:
   - Remove from git history immediately
   - Rotate/change all exposed secrets
   - Consider using GitHub Secrets for CI/CD

## 📚 Additional Resources

- [Git Documentation](https://git-scm.com/doc)
- [GitHub Docs](https://docs.github.com)
- [.gitignore Best Practices](https://github.com/github/gitignore)

---

**Last Updated**: Git Setup Guide  
**Status**: ✅ Ready for GitHub Push
