# LabEase - Quick Reference Guide

## 🚀 Start Development (2 Minutes)

### Prerequisites Installed? ✓
- Node.js 16+ 
- PostgreSQL running
- Stripe account

### Commands

```bash
# Terminal 1: Backend
cd server
npm install
npm run dev
# ✓ http://localhost:5000

# Terminal 2: Frontend  
cd client
npm install
npm run dev
# ✓ http://localhost:5173
```

## 📋 Project Structure at a Glance

```
LabEase/
├── server/              Backend (Node/Express/PostgreSQL)
│   ├── src/
│   │   ├── controllers/ Request handlers
│   │   ├── routes/      API endpoints
│   │   ├── services/    Business logic
│   │   ├── entities/    Database models
│   │   ├── middleware/  Auth, errors, uploads
│   │   └── index.js     Server entry
│   └── .env            Configuration
│
├── client/              Frontend (React/Vite/Tailwind)
│   ├── src/
│   │   ├── pages/       Route pages
│   │   ├── components/  Reusable UI
│   │   ├── api/         API service
│   │   ├── context/     Auth state
│   │   ├── layouts/     Page layouts
│   │   └── App.jsx     Main app
│   └── .env            Configuration
│
├── README.md           Full documentation
└── SETUP.md           Installation guide
```

## 🔑 API Routes

### Public Routes
- `GET /api/tests` - Browse tests
- `GET /api/categories` - Get categories
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login

### Authenticated Routes
- `POST /api/bookings` - Create booking
- `GET /api/bookings/my-bookings` - My bookings
- `POST /api/payments/create-session` - Stripe checkout

### Admin Routes
- `POST /api/tests` - Create test
- `GET /api/users` - Manage users
- `GET /api/bookings` - All bookings

## 👥 User Roles & Credentials

### Admin
- Email: `admin@labease.com`
- Password: `admin123`
- Access: Everything

### Lab Staff
- Email: `staff@labease.com`
- Password: `staff123`
- Access: Bookings, reports

### Customer
- Create via `/register`
- Access: Browse, book, view reports

## 🔗 Important Files

| File | Purpose |
|------|---------|
| `server/src/index.js` | Backend server entry |
| `client/src/App.jsx` | Frontend app root |
| `server/src/entities/*` | Database models |
| `server/src/routes/*` | API endpoints |
| `client/src/pages/*` | Page components |
| `client/src/api/index.js` | API client |

## 💳 Stripe Setup

1. Get keys from https://dashboard.stripe.com
2. Update `.env` files with test keys:
   - `STRIPE_SECRET_KEY=sk_test_...`
   - `STRIPE_PUBLISHABLE_KEY=pk_test_...`
3. Test payment flow at `/customer/new-booking`

## 🔄 Common Tasks

### Add a New Test
```bash
# Use admin panel or API:
POST /api/tests
{
  "testName": "Test Name",
  "price": 50,
  "duration": 15,
  "categoryId": "category-id"
}
```

### Create Booking as Customer
```bash
POST /api/bookings
{
  "testIds": ["test-id-1", "test-id-2"],
  "bookingType": "LAB_VISIT",
  "appointmentDate": "2024-02-15",
  "appointmentTime": "10:00",
  "address": "123 Main St",
  "city": "City",
  "state": "State",
  "pincode": "12345"
}
```

### Update Booking Status (Staff/Admin)
```bash
PUT /api/bookings/{id}/status
{
  "status": "SAMPLE_COLLECTED"
}
```

## 🎨 Frontend Routes

| Route | Role | Purpose |
|-------|------|---------|
| `/` | All | Home page |
| `/tests` | All | Browse tests |
| `/login` | All | Sign in |
| `/register` | All | Create account |
| `/customer/*` | Customer | Customer dashboard |
| `/staff/*` | Staff | Staff dashboard |
| `/admin/*` | Admin | Admin dashboard |

## 🗄️ Database Tables

- `users` - User accounts
- `categories` - Test categories
- `tests` - Medical tests
- `bookings` - Test bookings
- `booking_tests` - Booking-test relationships
- `reports` - PDF reports
- `invoices` - Booking invoices
- `payments` - Payment records

## 📊 Booking Status Flow

```
BOOKED → SAMPLE_COLLECTED → PROCESSING → REPORT_READY → COMPLETED
   ↓
CANCELLED
```

## 🐛 Debugging

```bash
# Check backend logs
tail -f server.log

# Database connection
psql -U labease_user -d labease_db

# Kill processes
lsof -ti:5000 | xargs kill -9

# Clear npm cache
npm cache clean --force
```

## ✅ Testing Checklist

- [ ] Can register as customer
- [ ] Can login with credentials
- [ ] Can browse tests
- [ ] Can create booking
- [ ] Can proceed to Stripe payment
- [ ] Payment redirects correctly
- [ ] Staff can update booking status
- [ ] Can download report

## 📞 Support Resources

- **Documentation**: See README.md
- **Setup Issues**: See SETUP.md
- **API Docs**: Check route files in `server/src/routes/`
- **Stripe Help**: https://stripe.com/docs

---

**Ready to book?** 🎉 Start with the SETUP.md!
