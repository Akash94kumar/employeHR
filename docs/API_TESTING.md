# API Testing Guide

## Overview

### WHAT

This guide explains how to test the Employee HR Portal API using Swagger UI and Thunder Client.

### WHY

API testing tools help:
- **Quick Testing**: Test APIs without writing code
- **Documentation**: Interactive API documentation
- **Development**: Faster development and debugging
- **Integration**: Frontend developers can test APIs easily

### HOW

Two tools are set up:
1. **Swagger UI**: Interactive API documentation in browser
2. **Thunder Client**: VS Code extension for API testing

## Swagger UI

### WHAT

Swagger UI provides interactive API documentation where you can test APIs directly from the browser.

### WHY

- **Interactive**: Test APIs without external tools
- **Documentation**: Auto-generated from code comments
- **Standard**: OpenAPI 3.0 standard
- **Easy**: No setup required

### HOW

#### Access Swagger UI

1. **Start the backend server:**
   ```bash
   cd apps/backend
   npm run dev
   ```

2. **Open Swagger UI in browser:**
   ```
   http://localhost:3000/api-docs
   ```

3. **Explore APIs:**
   - See all available endpoints
   - View request/response schemas
   - Test APIs directly from UI

#### Using Swagger UI

1. **Select an endpoint** (e.g., POST /auth/login)
2. **Click "Try it out"**
3. **Fill in request body:**
   ```json
   {
     "email": "test@example.com",
     "password": "Password123!"
   }
   ```
4. **Click "Execute"**
5. **View response** below

#### Authentication in Swagger UI

For protected endpoints (like `/auth/me`):

1. **Login first** using POST /auth/login
2. **Copy the accessToken** from response
3. **Click "Authorize" button** (top right)
4. **Enter token:** `Bearer <your-access-token>`
5. **Click "Authorize"**
6. **Now test protected endpoints**

## Thunder Client

### WHAT

Thunder Client is a VS Code extension for testing APIs. It's like Postman but integrated into VS Code.

### WHY

- **Integrated**: Works directly in VS Code
- **Fast**: Lightweight and fast
- **Collections**: Organize requests in collections
- **Variables**: Use environment variables
- **History**: Request history

### HOW

#### Import Collection

1. **Open Thunder Client:**
   - Click Thunder Client icon in VS Code sidebar
   - Or press `Ctrl+Shift+P` → "Thunder Client: New Request"

2. **Import Collection:**
   - Click "Collections" tab
   - Click "..." (three dots)
   - Select "Import"
   - Choose `apps/backend/thunder-collection.json`

3. **Collection imported!**
   - You'll see folders: "Health" and "Authentication"
   - All requests are ready to use

#### Using Thunder Client

1. **Select a request** (e.g., "Login")
2. **Click "Send"**
3. **View response** in right panel

#### Environment Variables

Thunder Client collection uses variables:

- `{{accessToken}}` - JWT access token
- `{{refreshToken}}` - JWT refresh token

**To use variables:**

1. **Login first:**
   - Run "Login" request
   - Copy `accessToken` from response

2. **Set environment variable:**
   - Click "Env" tab (top right)
   - Create/select environment (e.g., "Local")
   - Add variable:
     - Name: `accessToken`
     - Value: `<paste-token-here>`

3. **Use in requests:**
   - Protected requests automatically use `{{accessToken}}`

#### Testing Flow

**1. Register User:**
```
Request: POST /api/auth/register
Body: {
  "email": "test@example.com",
  "password": "Password123!",
  "role": "EMPLOYEE"
}
```

**2. Login:**
```
Request: POST /api/auth/login
Body: {
  "email": "test@example.com",
  "password": "Password123!"
}

Response: {
  "accessToken": "...",
  "refreshToken": "...",
  "user": {...}
}
```

**3. Set Token:**
- Copy `accessToken` from login response
- Add to Thunder Client environment variable

**4. Get Current User:**
```
Request: GET /api/auth/me
Headers: Authorization: Bearer {{accessToken}}
```

**5. Refresh Token:**
```
Request: POST /api/auth/refresh
Body: {
  "refreshToken": "{{refreshToken}}"
}
```

**6. Logout:**
```
Request: POST /api/auth/logout
Headers: Authorization: Bearer {{accessToken}}
```

## API Endpoints

### Health Check

**GET /api/health**
- No authentication required
- Returns server status

### Authentication

**POST /api/auth/register**
- Register new user
- Body: `{ email, password, role? }`

**POST /api/auth/login**
- Login user
- Body: `{ email, password }`
- Returns: `{ accessToken, refreshToken, user }`

**POST /api/auth/refresh**
- Refresh access token
- Body: `{ refreshToken }`
- Returns: `{ accessToken }`

**GET /api/auth/me**
- Get current user (protected)
- Headers: `Authorization: Bearer <token>`

**POST /api/auth/logout**
- Logout user (protected)
- Headers: `Authorization: Bearer <token>`

## Tips

### Swagger UI Tips

1. **Authorize once**: After authorizing, all protected endpoints work
2. **Copy responses**: Click response to copy
3. **Schema view**: Click "Schema" to see data structure
4. **Try different values**: Test with various inputs

### Thunder Client Tips

1. **Save responses**: Right-click response → "Save Response"
2. **Duplicate requests**: Right-click request → "Duplicate"
3. **History**: View request history in "History" tab
4. **Variables**: Use `{{variableName}}` in URLs, headers, body
5. **Folders**: Organize requests in folders

### Common Issues

**Issue: "Unauthorized" error**
- **Solution**: Make sure you've logged in and set `accessToken` variable

**Issue: "Token expired" error**
- **Solution**: Use refresh token to get new access token

**Issue: "Validation error"**
- **Solution**: Check request body format matches schema

**Issue: Swagger UI not loading**
- **Solution**: Make sure server is running on port 3000

## Example Test Flow

1. **Start server:**
   ```bash
   cd apps/backend
   npm run dev
   ```

2. **Open Swagger UI:**
   - Go to `http://localhost:3000/api-docs`

3. **Register user:**
   - POST /auth/register
   - Body: `{ "email": "test@example.com", "password": "Password123!", "role": "EMPLOYEE" }`

4. **Login:**
   - POST /auth/login
   - Body: `{ "email": "test@example.com", "password": "Password123!" }`
   - Copy `accessToken`

5. **Authorize in Swagger:**
   - Click "Authorize" button
   - Enter: `Bearer <accessToken>`
   - Click "Authorize"

6. **Get current user:**
   - GET /auth/me
   - Click "Execute"
   - Should return user info

7. **Test in Thunder Client:**
   - Import collection
   - Run "Login" request
   - Set `accessToken` variable
   - Run "Get Current User" request

---

**Last Updated**: Initial setup
**Maintained By**: Development Team

