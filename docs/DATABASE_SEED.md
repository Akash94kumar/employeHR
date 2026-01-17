# Database Seed Documentation

## Overview

### WHAT
Database seed script that creates initial users for all roles in the HR portal.

### WHY
Provides test users for development and testing. Ensures database has initial data for login testing.

### HOW
Runs a TypeScript script that connects to MongoDB and creates users with hashed passwords.

## Usage

### Run Seed Script

```bash
cd apps/backend
npm run seed
```

### What It Creates

The seed script creates 4 users, one for each role:

1. **Super Admin**
   - Email: `admin@hrportal.com`
   - Password: `password123`
   - Role: `SUPER_ADMIN`

2. **HR Manager**
   - Email: `hr@hrportal.com`
   - Password: `password123`
   - Role: `HR`

3. **Manager**
   - Email: `manager@hrportal.com`
   - Password: `password123`
   - Role: `MANAGER`

4. **Employee**
   - Email: `employee@hrportal.com`
   - Password: `password123`
   - Role: `EMPLOYEE`

## Login Credentials Summary

All users have the same password for easy testing: **`password123`**

| Role | Email | Password |
|------|-------|----------|
| Super Admin | admin@hrportal.com | password123 |
| HR | hr@hrportal.com | password123 |
| Manager | manager@hrportal.com | password123 |
| Employee | employee@hrportal.com | password123 |

## Features

### Safety Checks

- **Prevents Duplicates**: Checks if users already exist before creating
- **Idempotent**: Safe to run multiple times (won't create duplicates)
- **Error Handling**: Graceful error handling with clear messages

### Password Security

- Passwords are hashed using bcrypt before storage
- Uses 10 salt rounds for security
- Original passwords are never stored

## Re-seeding

If you need to re-seed the database:

1. **Option 1**: Delete users manually from MongoDB
2. **Option 2**: Uncomment the delete line in `seed.ts`:
   ```typescript
   // await User.deleteMany({});
   ```

## Troubleshooting

### "Users already exist" Error

If you see this message, users are already in the database. To re-seed:
- Delete users from MongoDB manually, OR
- Uncomment the delete line in seed.ts

### MongoDB Connection Error

Ensure:
- MongoDB is running
- `MONGODB_URI` in `.env` is correct
- Network connectivity to MongoDB

### Script Not Found

Ensure you're in the `apps/backend` directory:
```bash
cd apps/backend
npm run seed
```

## File Location

- **Script**: `apps/backend/src/scripts/seed.ts`
- **Command**: `npm run seed` (defined in `apps/backend/package.json`)

## Next Steps

After seeding:
1. Start backend server: `npm run dev`
2. Start frontend: `npm run dev:frontend`
3. Login with any of the created users
4. Test role-based routing and dashboards

---

**Last Updated**: Initial implementation  
**Maintained By**: Backend Team

