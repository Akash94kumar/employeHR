# Environment Variables Setup

## Quick Setup

1. **Create `.env` file in `apps/backend/` directory**

2. **Copy this content and replace `<db_password>` with your actual password:**

```env
# Server Configuration
NODE_ENV=development
PORT=3000

# Database Configuration
# MongoDB Atlas Connection String
# Replace <db_password> with your actual password
MONGODB_URI=mongodb+srv://divya78rani_db_user:<db_password>@cluster0.6vtjy40.mongodb.net/employee-hr-portal?retryWrites=true&w=majority

# CORS Configuration
CORS_ORIGIN=http://localhost:5173
```

## Important Notes

### Password में Special Characters

अगर आपके password में special characters हैं, तो उन्हें URL encode करना होगा:

- `@` → `%40`
- `#` → `%23`
- `%` → `%25`
- `&` → `%26`
- `=` → `%3D`
- `+` → `%2B`
- ` ` (space) → `%20`

### Example

अगर password है: `MyP@ss#123`

तो connection string होगा:
```
MONGODB_URI=mongodb+srv://divya78rani_db_user:MyP%40ss%23123@cluster0.6vtjy40.mongodb.net/employee-hr-portal?retryWrites=true&w=majority
```

## Testing Connection

After setting up `.env`, test the connection:

```bash
cd apps/backend
npm run dev
```

You should see:
```
✅ MongoDB connected successfully
🚀 Server running on http://localhost:3000
```

