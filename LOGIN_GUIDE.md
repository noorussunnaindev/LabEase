# Login Guide - Admin, Staff & Customer Accounts

## Overview

The LabEase system now supports three different user types, each with their own separate dashboards and functionality:

1. **Customer** - Regular users who book tests and view reports
2. **Lab Staff** - Laboratory employees who process samples and upload reports
3. **Admin** - System administrators who manage users, tests, and system settings

---

## Demo Accounts

All three demo accounts are automatically created when you run the seed script.

### To Create Demo Accounts:

```bash
cd server
npm run seed
```

Expected output:
```
✓ Admin user created
✓ Lab staff user created
✓ Customer user created
```

---

## Demo Credentials

### 👔 Admin Account
- **Email:** `admin@labease.com`
- **Password:** `admin123`
- **Role:** ADMIN
- **Access:** Full system access, user management, analytics, settings

### 👨‍⚕️ Lab Staff Account
- **Email:** `staff@labease.com`
- **Password:** `staff123`
- **Role:** LAB_STAFF
- **Access:** Manage test bookings, upload reports, process samples

### 👤 Customer Account
- **Email:** `customer@labease.com`
- **Password:** `password123`
- **Role:** CUSTOMER
- **Access:** Book tests, view personal bookings, download reports

---

## How to Login

### Using the Web Interface

1. Open the frontend at `http://localhost:5173`
2. Click on **Login** or navigate to `/login`
3. **Select your account type** using the tabs at the top:
   - 👤 Customer (blue)
   - 👨‍⚕️ Lab Staff (green)
   - 👔 Admin (red)

4. **Option A - Quick Login (Demo):**
   - Click the demo credentials button
   - Automatically fills email & password
   - Click "Sign In"

5. **Option B - Manual Login:**
   - Enter email address
   - Enter password
   - Click "Sign In"

6. **Success!**
   - You'll be redirected to your role-specific dashboard
   - Toast notification: "Login successful! Welcome [First Name]"

---

## Dashboard Features by Role

### 👤 Customer Dashboard
**URL:** `/customer/dashboard`

**Features:**
- View booking statistics
- 📋 **My Bookings** - Browse all your test bookings
- 📄 **Reports** - View and download test reports
- 💳 **Payments** - View payment history
- ⚙️ **Settings** - Update profile information

**Sidebar Navigation:**
- Dashboard
- My Bookings
- Reports
- Payments
- Settings

---

### 👨‍⚕️ Lab Staff Dashboard
**URL:** `/staff/dashboard`

**Features:**
- View pending tests count
- View in-progress tests
- View completed tests count
- 📋 **Bookings** - Manage test bookings and sample collection
- 📄 **Reports** - Upload and manage test reports

**Sidebar Navigation:**
- Dashboard
- Bookings
- Reports

**Key Functions:**
- Mark samples as collected
- Update booking status (SAMPLE_COLLECTED → PROCESSING → REPORT_READY)
- Upload test reports with PDFs/images
- Add comments to bookings

---

### 👔 Admin Dashboard
**URL:** `/admin/dashboard`

**Features:**
- Total bookings count
- Completed bookings count
- Pending bookings count
- Revenue statistics
- 📊 **Analytics** - View platform analytics
- 📋 **Bookings** - Manage all system bookings
- 🧪 **Tests** - Manage medical tests
- 👥 **Users** - Manage all users (create, edit, delete)

**Sidebar Navigation:**
- Dashboard
- Bookings
- Tests
- Users
- Analytics

**Key Functions:**
- Create/Edit/Delete tests
- Create/Edit/Delete users
- View system-wide analytics
- Manage all bookings
- View revenue reports

---

## Login Flow Diagram

```
http://localhost:5173/login
    ↓
Select Account Type:
├─ Customer (Blue)
├─ Lab Staff (Green)
└─ Admin (Red)
    ↓
Enter Credentials (OR click Quick Demo)
    ↓
Submit Login
    ↓
Backend Verification
    ├─ Valid credentials
    │  ├─ Generate JWT token
    │  ├─ Store in localStorage
    │  └─ Get user role
    │
    └─ Invalid credentials
       └─ Show error toast
    ↓
Auto-redirect to Dashboard:
├─ Customer → /customer/dashboard
├─ Staff → /staff/dashboard
└─ Admin → /admin/dashboard
```

---

## Security Features

✅ **Role-Based Access Control (RBAC)**
- Each user type can only access their authorized routes
- Attempting to access unauthorized routes redirects to home page

✅ **JWT Token Authentication**
- Tokens stored securely in browser localStorage
- Expires after 7 days
- Automatically removed on logout

✅ **Password Security**
- Passwords hashed with bcryptjs
- Minimum 6 characters required
- Never stored in plaintext

✅ **CORS Protection**
- API only accepts requests from `http://localhost:5173`
- Cross-origin requests properly validated

---

## Troubleshooting Login Issues

### ❌ "Invalid credentials"
**Solution:**
- Verify you typed the email correctly
- Check password is exactly as shown above
- Try the Quick Demo button instead
- Ensure backend is running and database connected

### ❌ "Cannot connect to server"
**Solution:**
- Verify backend is running: `npm run dev` in server folder
- Check `.env` file has correct database credentials
- Confirm `VITE_API_BASE_URL` in `client/.env` is `http://localhost:5000/api`

### ❌ "Blank page after login"
**Solution:**
- Check browser console for errors (F12 → Console)
- Hard refresh: `Ctrl+Shift+R`
- Verify the dashboard page file exists for your role

### ❌ "Redirects back to login after loading"
**Solution:**
- Check JWT_SECRET in server/.env is set
- Clear browser localStorage: `localStorage.clear()` in console
- Restart both backend and frontend

### ❌ "Can't see demo credentials button"
**Solution:**
- Refresh the page
- Make sure you selected the correct account type tab
- Check all three tabs (Customer, Lab Staff, Admin)

---

## Creating Additional Users

### Via Frontend Registration
1. Go to `/register`
2. Fill in:
   - First Name
   - Last Name
   - Email
   - Phone (optional)
   - Password (min 6 characters)
3. Click "Create Account"
4. Automatically logs in as CUSTOMER role

### Via Backend API
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jane",
    "lastName": "Doe",
    "email": "jane@example.com",
    "password": "password123",
    "phone": "1234567890"
  }'
```

**Note:** Users registered via frontend/API are always CUSTOMER role
Admin and staff accounts must be created by database administrators

---

## User Roles Database

### Role Types

| Role | Value | Permissions |
|------|-------|-------------|
| Customer | `CUSTOMER` | Book tests, view personal reports |
| Lab Staff | `LAB_STAFF` | Process samples, upload reports |
| Admin | `ADMIN` | Full system access |

### Database Query to View Users

```sql
-- Connect to PostgreSQL
psql -h localhost -U labease_user -d labease_db

-- View all users
SELECT id, "firstName", "lastName", email, role, "isActive" FROM users;

-- View users by role
SELECT * FROM users WHERE role = 'ADMIN';
SELECT * FROM users WHERE role = 'LAB_STAFF';
SELECT * FROM users WHERE role = 'CUSTOMER';
```

---

## Session Management

### Logout
Click the user avatar in the top-right corner and select "Logout"

**Actions:**
- Clears JWT token from localStorage
- Clears user data from localStorage
- Redirects to home page
- Next page refresh shows login page

### Session Expiry
- JWT tokens expire after **7 days**
- Automatic logout when token expires
- Page redirects to login with notification

### Remember Me
- Currently NOT implemented
- Frontend always remembers session with stored token
- Can be enhanced in future

---

## Testing All Three Accounts

### Quick Test Workflow

1. **Test Admin Account (2 mins)**
   - Login as admin@labease.com
   - Navigate to "Users" page
   - View all system users
   - Logout

2. **Test Staff Account (2 mins)**
   - Login as staff@labease.com
   - Navigate to "Bookings" page
   - View pending tests
   - Logout

3. **Test Customer Account (3 mins)**
   - Login as customer@labease.com
   - Navigate to "Browse Tests"
   - Click on a test to view details
   - Go to "My Bookings" (should be empty initially)
   - Logout

---

## Next Steps

After successful login:

### For Customers:
1. Browse available tests in "Browse Tests" page
2. Create a new booking
3. Complete payment via Stripe
4. Wait for lab staff to process
5. View uploaded reports

### For Lab Staff:
1. Go to "Bookings" page
2. Mark samples as collected
3. Upload test reports
4. Update booking status

### For Admins:
1. Manage users in "Users" page
2. Create/edit tests in "Tests" page
3. View analytics in "Analytics" page
4. Oversee system operations

---

**All three login types are now fully functional!** 🎉
