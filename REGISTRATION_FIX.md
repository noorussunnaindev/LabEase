# Registration Bug Fix - Complete Solution

## Issue Fixed
The registration endpoint was failing because:
- Client was sending `name` (single field) instead of `firstName` and `lastName`
- Seed script and API calls were using different field names

## Changes Made

### 1. Backend Registration Controller
**File**: [server/src/controllers/authController.js](server/src/controllers/authController.js)

✅ Added support for `name` field - automatically splits into `firstName` and `lastName`
✅ Added detailed validation with specific error messages for each field
✅ Added email format validation
✅ Added password minimum length check (6 characters)
✅ Security: Ignores any `role` parameter and always sets users to `CUSTOMER` role
✅ Added debug logging to help diagnose issues

**Example Request Formats Now Supported:**

```json
// Format 1: React Form (firstName + lastName)
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "1234567890"
}
```

```json
// Format 2: Seed/API (single name field)
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "1234567890"
}
```

### 2. Backend AuthService
**File**: [server/src/services/AuthService.js](server/src/services/AuthService.js)

✅ Updated to accept optional `role` parameter
✅ Sets `isActive: true` automatically
✅ Defaults to `CUSTOMER` role for all registrations

## Testing the Fix

### Test 1: React Frontend Registration
1. Open http://localhost:5173
2. Go to Register page
3. Fill in form:
   - First Name: `John`
   - Last Name: `Doe`
   - Email: `john@example.com`
   - Phone: `1234567890` (optional)
   - Password: `password123`
4. Click "Create Account"
5. Should see success message and redirect to dashboard

**Expected Console Output (Server):**
```
📝 Register Request Body: {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  password: 'password123',
  phone: '1234567890'
}
📝 Parsed fields: {
  email: 'john@example.com',
  password: 'password123',
  firstName: 'John',
  lastName: 'Doe',
  phone: '1234567890',
  role: undefined
}
```

### Test 2: Seed Script (Create Admin User)
1. In server terminal, run:
```bash
npm run seed
```

2. Should see output:
```
📦 Database connected
✓ Admin user created
✓ Lab staff user created
✓ Categories created
...
```

**Admin User Created:**
- Email: `admin@labease.com`
- Password: `admin123`
- Role: `ADMIN`

**Lab Staff User Created:**
- Email: `staff@labease.com`
- Password: `staff123`
- Role: `LAB_STAFF`

### Test 3: API Registration with `name` Field (Curl/Postman)
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@test.com",
    "password": "123456",
    "phone": "1234567890"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid-here",
      "email": "admin@test.com",
      "firstName": "Admin",
      "lastName": "User",
      "role": "CUSTOMER"
    },
    "token": "jwt-token-here"
  },
  "message": "Registration successful"
}
```

## Validation Rules

| Field | Rule | Error Message |
|-------|------|---------------|
| firstName | Required, non-empty | "First name is required" |
| lastName | Required, non-empty | "Last name is required" |
| email | Required, valid format | "Email is required" OR "Please enter a valid email address" |
| password | Required, min 6 chars | "Password is required" OR "Password must be at least 6 characters long" |
| phone | Optional | - |
| name | Optional (alternative to firstName/lastName) | - |
| role | Ignored (always CUSTOMER) | Warning logged if provided |

## Security Features

✅ **Role Protection**: Any attempt to set `ADMIN` or `LAB_STAFF` role during registration is logged as warning and ignored
✅ **Email Validation**: Prevents invalid email formats
✅ **Password Requirements**: Minimum 6 characters enforced
✅ **Duplicate Email Check**: Prevents registering with same email twice
✅ **Token Generation**: JWT token issued after successful registration

## Troubleshooting

### ❌ "First name is required"
- Check that `firstName` field is not empty
- If using `name` field, ensure it's not empty and contains at least one word

### ❌ "Email is required" or "Please enter a valid email address"
- Verify email is in format: `user@domain.com`
- Ensure email field is not empty

### ❌ "Password must be at least 6 characters long"
- Ensure password has minimum 6 characters
- Examples of valid passwords: `password123`, `test@123`, `abc123`

### ❌ "Email already registered"
- This email is already in use
- Try with a different email address

## Database Reset (If Needed)

If you need to clear and reseed the database:

```bash
# 1. Stop the server (Ctrl+C)
# 2. Delete the database
#    - PostgreSQL: DROP DATABASE labease_db;
#    - CREATE DATABASE labease_db;
# 3. Restart server
# 4. Run seed script
npm run seed
```

## Next Steps

1. ✅ Restart server: `npm run dev` (in server folder)
2. ✅ Test registration via React form
3. ✅ Test with seed script: `npm run seed`
4. ✅ Verify login works with created users
5. ✅ Check database to confirm users are stored

---

All fixes are now in place. The registration system supports both frontend form format and API/seed script format.
