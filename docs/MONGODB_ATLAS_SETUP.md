# MongoDB Atlas Database Setup Guide

## Current Status

Aapke MongoDB Atlas mein:
- ✅ **Cluster0** ready hai
- ✅ Connection string: `mongodb+srv://divya78rani_db_user:<password>@cluster0.6vtjy40.mongodb.net/`
- ⚠️ **employee-hr-portal** database abhi create nahi hui

## Step 1: Database Create Karein

### WHAT

MongoDB Atlas mein "employee-hr-portal" database create karna.

### WHY

Backend application ko database chahiye data store karne ke liye. Database automatically create ho jayegi jab pehli baar data insert hoga, lekin explicitly create karna better practice hai.

### HOW

#### Option A: MongoDB Atlas UI se (Recommended)

1. **"+ Create database" button click karein**
   - Screenshot mein green button dikh raha hai
   - Ya top right corner mein "+ Create" button

2. **Database Details Fill Karein:**
   - **Database Name**: `employee-hr-portal`
   - **Collection Name**: `users` (ya koi bhi initial collection)
   - Click "Create"

3. **Database Create Ho Jayegi**
   - Left sidebar mein "employee-hr-portal" dikhegi
   - Ab aap is database ko use kar sakte hain

#### Option B: Backend se Auto-Create (Alternative)

Database automatically create ho jayegi jab pehli baar data insert hoga. Lekin explicitly create karna better hai.

## Step 2: Connection String Update Karein

### WHAT

`.env` file mein connection string ko update karna with correct database name.

### WHY

Connection string mein database name specify karna important hai taaki application directly correct database se connect ho.

### HOW

1. **`apps/backend/.env` file kholen**

2. **MONGODB_URI update karein:**
   ```env
   MONGODB_URI=mongodb+srv://divya78rani_db_user:YOUR_PASSWORD@cluster0.6vtjy40.mongodb.net/employee-hr-portal?retryWrites=true&w=majority
   ```

3. **Important Points:**
   - `YOUR_PASSWORD` ko actual password se replace karein
   - Database name: `employee-hr-portal` (connection string ke end mein)
   - Query parameters: `?retryWrites=true&w=majority` (reliability ke liye)

## Step 3: Network Access Check Karein

### WHAT

MongoDB Atlas mein Network Access allow karna.

### WHY

Agar aapka IP address allowlisted nahi hai, to connection fail ho jayega.

### HOW

1. **MongoDB Atlas Dashboard mein:**
   - Left sidebar mein "Network Access" click karein

2. **IP Address Add Karein:**
   - "Add IP Address" button click karein
   - Development ke liye: `0.0.0.0/0` (all IPs allow) - **Development only!**
   - Production mein specific IPs add karein

3. **Save Karein**

## Step 4: Database User Verify Karein

### WHAT

Database user `divya78rani_db_user` verify karna.

### WHY

User ko proper permissions chahiye database access karne ke liye.

### HOW

1. **MongoDB Atlas Dashboard mein:**
   - Left sidebar mein "Database Access" click karein

2. **User Check Karein:**
   - `divya78rani_db_user` user exist karta hai ya nahi
   - User ko "Read and write to any database" permission honi chahiye (development ke liye)

3. **Password Verify Karein:**
   - Password sahi hai ya nahi
   - Agar password change kiya hai, to `.env` file update karein

## Step 5: Connection Test Karein

### WHAT

Backend se MongoDB connection test karna.

### WHY

Verify karna ki sab kuch sahi se setup hai.

### HOW

1. **`.env` file mein password add karein:**
   ```env
   MONGODB_URI=mongodb+srv://divya78rani_db_user:ACTUAL_PASSWORD@cluster0.6vtjy40.mongodb.net/employee-hr-portal?retryWrites=true&w=majority
   ```

2. **Backend Start Karein:**
   ```bash
   cd apps/backend
   npm run dev
   ```

3. **Success Message:**
   ```
   ✅ MongoDB connected successfully
   📊 MongoDB connection established
   🚀 Server running on http://localhost:3000
   ```

4. **Health Check:**
   ```bash
   curl http://localhost:3000/api/health
   ```
   Ya browser mein: `http://localhost:3000/api/health`

## Troubleshooting

### Error: "MONGODB_URI: Required"

**Problem**: `.env` file missing ya incomplete hai.

**Solution**:
1. `apps/backend/.env` file check karein
2. `MONGODB_URI` properly set hai ya nahi
3. Password correctly added hai ya nahi

### Error: "Authentication failed"

**Problem**: Password galat hai ya user doesn't exist.

**Solution**:
1. MongoDB Atlas → Database Access mein user verify karein
2. Password sahi hai ya nahi check karein
3. Special characters URL encoded hain ya nahi

### Error: "Connection timeout"

**Problem**: IP address allowlisted nahi hai.

**Solution**:
1. MongoDB Atlas → Network Access
2. Apna IP address add karein
3. Ya development ke liye `0.0.0.0/0` allow karein

### Error: "Database not found"

**Problem**: Database name galat hai ya database create nahi hui.

**Solution**:
1. MongoDB Atlas → Data Explorer
2. Database name verify karein
3. Connection string mein database name sahi hai ya nahi check karein

## Quick Checklist

- [ ] Database `employee-hr-portal` create hui
- [ ] `.env` file mein `MONGODB_URI` set hai
- [ ] Password correctly added hai (URL encoded if needed)
- [ ] Network Access mein IP address allowlisted hai
- [ ] Database user verify ho gaya
- [ ] Backend successfully connect ho raha hai

---

**Last Updated**: Initial version
**Maintained By**: Development Team

