# Development Server Options

## Overview

### WHAT

Do options available hain server ko development mode mein run karne ke liye:
1. **tsx watch** (Default) - TypeScript ke liye optimized
2. **nodemon** - Traditional file watcher

### WHY

Dono tools automatically server restart karte hain file changes par, lekin different approaches use karte hain.

### HOW

## Option 1: tsx watch (Recommended - Currently Using)

### WHAT

`tsx watch` TypeScript files ko directly run karta hai without compilation step.

### WHY

- ✅ **Fast**: No compilation step needed
- ✅ **TypeScript Native**: Directly TypeScript run karta hai
- ✅ **Lightweight**: Less dependencies
- ✅ **Fast Restart**: Quick file change detection

### HOW

```bash
cd apps/backend
npm run dev
```

**Command**: `tsx watch src/server.ts`

**Features**:
- File changes detect karta hai
- Automatically server restart karta hai
- TypeScript directly run karta hai
- Fast hot reload

## Option 2: nodemon (Alternative)

### WHAT

`nodemon` traditional file watcher hai jo file changes detect karke process restart karta hai.

### WHY

- ✅ **Familiar**: Developers ko pata hai
- ✅ **Configurable**: `nodemon.json` se configure kar sakte hain
- ✅ **Flexible**: Different file types watch kar sakta hai
- ❌ **Slower**: Compilation step chahiye (but we use tsx, so no issue)

### HOW

```bash
cd apps/backend
npm run dev:nodemon
```

**Command**: `nodemon --exec tsx src/server.ts`

**Configuration**: `nodemon.json` file mein settings

**Features**:
- File changes detect karta hai
- Automatically server restart karta hai
- Configurable watch patterns
- Delay option (1 second default)

## Comparison

| Feature | tsx watch | nodemon |
|---------|-----------|---------|
| TypeScript Support | ✅ Native | ✅ (with tsx) |
| Speed | ⚡ Fast | 🐢 Slightly slower |
| Configuration | Simple | More options |
| File Watching | ✅ | ✅ |
| Auto Restart | ✅ | ✅ |
| Dependencies | Less | More |

## Current Setup

### Default: tsx watch

```json
"dev": "tsx watch src/server.ts"
```

**Use**: `npm run dev`

### Alternative: nodemon

```json
"dev:nodemon": "nodemon --exec tsx src/server.ts"
```

**Use**: `npm run dev:nodemon`

## Nodemon Configuration

`nodemon.json` file mein:

```json
{
  "watch": ["src"],           // Watch src folder
  "ext": "ts,json",          // Watch .ts and .json files
  "ignore": ["**/*.test.ts"], // Ignore test files
  "exec": "tsx src/server.ts", // Command to run
  "delay": 1000              // 1 second delay before restart
}
```

## Which One to Use?

### Use tsx watch if:
- ✅ You want fastest development experience
- ✅ You prefer simpler setup
- ✅ You're using TypeScript

### Use nodemon if:
- ✅ You're familiar with nodemon
- ✅ You need more configuration options
- ✅ You want delay before restart

## Recommendation

**tsx watch** recommended hai kyunki:
- TypeScript ke liye optimized
- Faster
- Simpler
- Less dependencies

But agar aap nodemon prefer karte hain, to `npm run dev:nodemon` use kar sakte hain.

## Installation

Nodemon already added hai `package.json` mein. Install karne ke liye:

```bash
cd apps/backend
npm install
```

## Usage Examples

### tsx watch (Default)
```bash
cd apps/backend
npm run dev
```

### nodemon
```bash
cd apps/backend
npm run dev:nodemon
```

### VS Code Task
- `Ctrl+Shift+P` → "Tasks: Run Task"
- "Start Backend Server" select karein
- (Uses tsx watch by default)

## Troubleshooting

### Server Not Restarting

**Problem**: File changes par server restart nahi ho raha

**Solution**:
1. Check file save ho gaya hai ya nahi
2. Check file `src/` folder mein hai ya nahi
3. Try nodemon: `npm run dev:nodemon`

### Too Many Restarts

**Problem**: Server bahut baar restart ho raha hai

**Solution**:
- Nodemon use karein with delay: `nodemon.json` mein `"delay": 2000` set karein

### Slow Restart

**Problem**: Server restart slow hai

**Solution**:
- tsx watch use karein (faster)
- Nodemon delay kam karein

---

**Last Updated**: Initial setup
**Maintained By**: Development Team

