# API Response Format Documentation

## Overview

### WHAT
Standardized API response format for all endpoints in the HR Portal backend.

### WHY
Consistent response format provides:
- **Predictable Structure**: Frontend knows exactly what to expect
- **Easy Error Handling**: Standardized error format
- **Better DX**: Easier to work with API
- **REST Best Practices**: Follows industry standards

### HOW
All responses follow a consistent structure using response utility functions.

## Response Format

### Success Response

**Structure:**
```json
{
  "success": true,
  "data": {
    // Response data here
  },
  "message": "Optional success message"
}
```

**Example:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "694efe4bba9ac4ecee775d71",
      "email": "admin@hrportal.com",
      "role": "SUPER_ADMIN"
    }
  }
}
```

### Error Response

**Structure:**
```json
{
  "success": false,
  "error": {
    "message": "Error message",
    "code": "ERROR_CODE",
    "details": {}
  }
}
```

**Example:**
```json
{
  "success": false,
  "error": {
    "message": "Invalid credentials",
    "code": "INVALID_CREDENTIALS"
  }
}
```

## HTTP Status Codes

### Success Codes

- **200 OK**: Successful GET, PUT, PATCH, DELETE
- **201 Created**: Successful POST (resource created)
- **204 No Content**: Successful DELETE (no response body)

### Error Codes

- **400 Bad Request**: Validation errors, invalid input
- **401 Unauthorized**: Authentication required or failed
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server errors

## Usage in Controllers

### Success Response

```typescript
import { sendSuccess } from '../../utils/response.util';

// Simple success
sendSuccess(res, data, 200);

// With message
sendSuccess(res, data, 201, 'User created successfully');

// Example: Login
sendSuccess(res, {
  accessToken: '...',
  refreshToken: '...',
  user: {...}
}, 200);
```

### Error Response

```typescript
import { sendError } from '../../utils/response.util';

// Simple error
sendError(res, 'Invalid credentials', 401);

// With error code
sendError(res, 'User not found', 404, 'USER_NOT_FOUND');

// With details
sendError(res, 'Validation failed', 400, 'VALIDATION_ERROR', {
  fields: ['email', 'password']
});
```

### Paginated Response

```typescript
import { sendPaginated } from '../../utils/response.util';

sendPaginated(res, items, {
  page: 1,
  limit: 10,
  total: 100,
  totalPages: 10
}, 200);
```

## Response Utility Functions

### `sendSuccess(res, data, statusCode?, message?)`

Sends a successful response.

**Parameters:**
- `res`: Express Response object
- `data`: Response data (any type)
- `statusCode`: HTTP status code (default: 200)
- `message`: Optional success message

**Returns:** void

### `sendError(res, message, statusCode?, code?, details?)`

Sends an error response.

**Parameters:**
- `res`: Express Response object
- `message`: Error message
- `statusCode`: HTTP status code (default: 400)
- `code`: Optional error code
- `details`: Optional error details

**Returns:** void

### `sendPaginated(res, items, pagination, statusCode?)`

Sends a paginated response.

**Parameters:**
- `res`: Express Response object
- `items`: Array of items
- `pagination`: Pagination metadata
- `statusCode`: HTTP status code (default: 200)

**Returns:** void

## Examples

### Authentication Endpoints

**Login:**
```json
{
  "success": true,
  "data": {
    "accessToken": "...",
    "refreshToken": "...",
    "user": {
      "id": "...",
      "email": "...",
      "role": "..."
    }
  }
}
```

**Register:**
```json
{
  "success": true,
  "data": {
    "message": "User created successfully",
    "user": {
      "id": "...",
      "email": "...",
      "role": "..."
    }
  }
}
```

**Get Current User:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "...",
      "email": "...",
      "role": "...",
      "isActive": true,
      "createdAt": "...",
      "updatedAt": "..."
    }
  }
}
```

### Error Examples

**Invalid Credentials:**
```json
{
  "success": false,
  "error": {
    "message": "Invalid credentials"
  }
}
```

**Validation Error:**
```json
{
  "success": false,
  "error": {
    "message": "Validation failed",
    "code": "VALIDATION_ERROR",
    "details": {
      "fields": ["email", "password"]
    }
  }
}
```

**Unauthorized:**
```json
{
  "success": false,
  "error": {
    "message": "Unauthorized - Invalid or missing token"
  }
}
```

## Frontend Integration

### TypeScript Types

```typescript
interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
}

interface ApiErrorResponse {
  success: false;
  error: {
    message: string;
    code?: string;
    details?: any;
  };
}

type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
```

### Usage in Frontend

```typescript
// Success response
const response = await apiClient.post('/auth/login', credentials);
if (response.data.success) {
  const { accessToken, refreshToken, user } = response.data.data;
  // Handle success
}

// Error response
try {
  await apiClient.post('/auth/login', credentials);
} catch (error) {
  if (error.response?.data?.success === false) {
    const { message, code } = error.response.data.error;
    // Handle error
  }
}
```

## Benefits

1. **Consistency**: All endpoints follow same format
2. **Type Safety**: TypeScript types for responses
3. **Error Handling**: Standardized error format
4. **Developer Experience**: Easy to work with
5. **Maintainability**: Centralized response logic

## Migration

All existing endpoints have been updated to use the response utility:

- ✅ `/api/auth/login`
- ✅ `/api/auth/register`
- ✅ `/api/auth/refresh`
- ✅ `/api/auth/logout`
- ✅ `/api/auth/me`
- ✅ `/api/health`

## Best Practices

1. **Always use response utilities**: Don't manually format responses
2. **Use appropriate status codes**: 200 for success, 201 for creation
3. **Include error codes**: For programmatic error handling
4. **Add messages when helpful**: Especially for creation endpoints
5. **Keep data structure consistent**: Same endpoint should always return same structure

---

**Last Updated**: Standardized response format implementation  
**Maintained By**: Backend Team

