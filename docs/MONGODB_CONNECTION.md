# MongoDB Connection Guide

## Cursor AI में MongoDB Extension Setup

### WHAT

Cursor AI VS Code-based editor है, इसलिए VS Code extensions काम करते हैं। MongoDB for VS Code extension Cursor में भी use किया जा सकता है।

### WHY

MongoDB extension से:
- Database को directly VS Code/Cursor में browse कर सकते हैं
- Queries run कर सकते हैं
- Data को visualize कर सकते हैं
- Connection string manage कर सकते हैं

### HOW

## Step 1: MongoDB Extension Install करें

1. **Cursor AI में Extensions खोलें:**
   - Left sidebar में Extensions icon पर click करें
   - या `Ctrl+Shift+X` (Windows) / `Cmd+Shift+X` (Mac) press करें

2. **MongoDB Extension Search करें:**
   - Search box में "MongoDB for VS Code" type करें
   - Official MongoDB extension install करें

3. **Install करें:**
   - Install button पर click करें
   - Extension install होने के बाद reload करें

## Step 2: MongoDB Connection String Setup

### Option A: Cursor में Direct Connect

1. **Command Palette खोलें:**
   - `Ctrl+Shift+P` (Windows) / `Cmd+Shift+P` (Mac)
   - या View → Command Palette

2. **MongoDB Connect:**
   - "MongoDB: Connect" type करें
   - "MongoDB: Connect with Connection String" select करें

3. **Connection String Paste करें:**
   ```
   mongodb+srv://divya78rani_db_user:<db_password>@cluster0.6vtjy40.mongodb.net/
   ```
   - `<db_password>` को अपने actual password से replace करें
   - Password में special characters हों तो URL encode करें

4. **Database Name Add करें:**
   - Connection string के end में database name add करें:
   ```
   mongodb+srv://divya78rani_db_user:<db_password>@cluster0.6vtjy40.mongodb.net/employee-hr-portal
   ```

### Option B: .env File में Setup (Recommended)

1. **apps/backend/.env file खोलें**

2. **MONGODB_URI update करें:**
   ```env
   MONGODB_URI=mongodb+srv://divya78rani_db_user:YOUR_PASSWORD@cluster0.6vtjy40.mongodb.net/employee-hr-portal?retryWrites=true&w=majority
   ```
   - `YOUR_PASSWORD` को अपने actual password से replace करें

3. **Password में Special Characters:**
   - अगर password में special characters हैं (जैसे `@`, `#`, `%`), तो URL encode करें:
   - `@` → `%40`
   - `#` → `%23`
   - `%` → `%25`
   - `&` → `%26`
   - `=` → `%3D`

## Step 3: MongoDB Playground Create करें

1. **Command Palette खोलें:**
   - `Ctrl+Shift+P` / `Cmd+Shift+P`

2. **"MongoDB: Create New Playground" select करें**

3. **Playground में queries run करें:**
   ```javascript
   // Example query
   use('employee-hr-portal');
   
   db.users.find().limit(5);
   ```

## Step 4: Backend में Connection Test करें

1. **Backend start करें:**
   ```bash
   cd apps/backend
   npm run dev
   ```

2. **Check करें:**
   - Console में "✅ MongoDB connected successfully" message दिखना चाहिए
   - अगर error आए, तो connection string check करें

## Troubleshooting

### Connection Error आ रहा है

1. **Password Check करें:**
   - Password सही है या नहीं
   - Special characters URL encoded हैं या नहीं

2. **Network Access Check करें:**
   - MongoDB Atlas में Network Access tab check करें
   - Your IP address allowlisted है या नहीं
   - Development के लिए `0.0.0.0/0` (all IPs) allow कर सकते हैं

3. **Database User Check करें:**
   - MongoDB Atlas में Database Access check करें
   - User `divya78rani_db_user` exists है या नहीं
   - User को proper permissions हैं या नहीं

### Extension काम नहीं कर रहा

1. **Cursor Reload करें:**
   - `Ctrl+Shift+P` → "Developer: Reload Window"

2. **Extension Reinstall करें:**
   - Extensions में MongoDB extension uninstall करें
   - फिर से install करें

3. **Cursor Update Check करें:**
   - Latest version use कर रहे हैं या नहीं

## Security Best Practices

1. **.env File को Git में Commit न करें:**
   - `.env` file `.gitignore` में होनी चाहिए
   - Password को कभी code में hardcode न करें

2. **Production में:**
   - Strong passwords use करें
   - IP whitelisting करें
   - Database user को minimum required permissions दें

3. **Connection String:**
   - Connection string को share न करें
   - Environment variables में store करें

---

**Last Updated**: Initial version
**Maintained By**: Development Team

