# VS Code Setup Guide

## Auto-Start Server in Dev Mode

### WHAT

VS Code tasks aur launch configurations jo server ko automatically start karte hain development mode mein.

### WHY

- **Quick Start**: Ek click se server start
- **Auto Restart**: File changes par automatically restart
- **Debugging**: VS Code debugger se directly debug kar sakte hain
- **Convenience**: Terminal commands type karne ki zarurat nahi

### HOW

## Method 1: VS Code Tasks (Recommended)

### Start Server Using Tasks

1. **Tasks Menu:**
   - Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
   - Type: "Tasks: Run Task"
   - Select: "Start Backend Server"

2. **Keyboard Shortcut:**
   - `Ctrl+Shift+B` (or `Cmd+Shift+B` on Mac)
   - Select task from list

3. **Terminal Menu:**
   - Go to Terminal → Run Task
   - Select "Start Backend Server"

### Available Tasks

- **Start Backend Server**: Backend server start karta hai
- **Start Frontend**: Frontend server start karta hai
- **Start All**: Dono servers ek saath start karte hain

## Method 2: VS Code Launch Configuration (Debug Mode)

### Debug Server

1. **Debug Panel:**
   - Press `F5` ya click Debug icon (left sidebar)
   - Select "Debug Backend Server"
   - Click play button

2. **Breakpoints:**
   - Code mein breakpoints set kar sakte hain
   - Step through code kar sakte hain
   - Variables inspect kar sakte hain

### Available Debug Configurations

- **Debug Backend Server**: Backend ko debug mode mein start karta hai
- **Debug Frontend**: Frontend ko debug mode mein start karta hai
- **Debug Full Stack**: Dono ko ek saath debug mode mein start karta hai

## Method 3: Auto-Start on File Open (Optional)

Agar aap chahte hain ki project open hote hi server automatically start ho:

### Install Extension

1. **Install "Auto Run Command" Extension:**
   - VS Code Extensions mein search karein: "Auto Run Command"
   - Install karein

2. **Configure:**
   - Settings mein add karein:
   ```json
   {
     "auto-run-command.commands": [
       {
         "command": "npm run dev",
         "cwd": "${workspaceFolder}/apps/backend",
         "runOn": "onFileOpen"
       }
     ]
   }
   ```

## Current Setup

### tsx watch (Already Configured)

Hum already `tsx watch` use kar rahe hain jo:
- ✅ File changes detect karta hai
- ✅ Automatically server restart karta hai
- ✅ TypeScript directly run karta hai (compilation ki zarurat nahi)
- ✅ Fast hot reload

**Command:**
```bash
npm run dev
```

### VS Code Tasks

`.vscode/tasks.json` file mein tasks define kiye gaye hain:
- Start Backend Server
- Start Frontend
- Start All

### VS Code Launch Config

`.vscode/launch.json` file mein debug configurations hain:
- Debug Backend Server
- Debug Frontend
- Debug Full Stack

## Quick Start Guide

### Option 1: Terminal (Simple)

```bash
cd apps/backend
npm run dev
```

### Option 2: VS Code Task (Quick)

1. `Ctrl+Shift+P`
2. "Tasks: Run Task"
3. "Start Backend Server"

### Option 3: Debug Mode (Advanced)

1. Press `F5`
2. Select "Debug Backend Server"
3. Server debug mode mein start hoga

## Tips

### Auto-Restart on File Changes

`tsx watch` already configured hai jo automatically restart karta hai file changes par. Kuch extra karne ki zarurat nahi.

### Multiple Terminals

Agar aap chahte hain ki frontend aur backend alag terminals mein run ho:

1. **Terminal 1:**
   ```bash
   cd apps/backend
   npm run dev
   ```

2. **Terminal 2:**
   ```bash
   cd packages/frontend
   npm run dev
   ```

### Stop Server

- Terminal mein: `Ctrl+C`
- VS Code Task: Task stop karne ke liye terminal close karein

## Troubleshooting

### Task Not Found

**Problem**: Task list mein "Start Backend Server" nahi dikh raha

**Solution**: 
- `.vscode/tasks.json` file check karein
- VS Code reload karein (`Ctrl+Shift+P` → "Developer: Reload Window")

### Server Not Starting

**Problem**: Task run hua but server start nahi hua

**Solution**:
- `.env` file check karein (JWT_SECRET, MONGODB_URI)
- Terminal mein error messages check karein
- `npm install` run karein

### Port Already in Use

**Problem**: Port 3000 already in use

**Solution**:
- `.env` file mein `PORT=3001` set karein
- Ya jo process port 3000 use kar raha hai, usko stop karein

---

**Last Updated**: Initial setup
**Maintained By**: Development Team

