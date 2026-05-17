# LabEase - Smart Medical Test Booking & Report Management System

A production-ready PERN stack (PostgreSQL, Express, React, Node.js) application for smart medical test booking and report management.

![Status](https://img.shields.io/badge/status-production--ready-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)

## 🎯 Features

### Authentication & Authorization
- ✅ User registration and login
- ✅ JWT-based authentication
- ✅ Role-based access control (Customer, Lab Staff, Admin)
- ✅ Secure password hashing with bcryptjs
- ✅ Token verification middleware

### Test Management
- ✅ Complete CRUD operations for medical tests
- ✅ Category management
- ✅ Test search and filtering
- ✅ Pricing and duration management

### Booking System
- ✅ Multi-step booking interface
- ✅ Home sampling and lab visit options
- ✅ Date and time slot selection
- ✅ Real-time status tracking
- ✅ Booking cancellation

### Payment Integration
- ✅ Stripe payment gateway integration
- ✅ Checkout session management
- ✅ Payment status tracking
- ✅ Invoice generation
- ✅ Payment success/cancel pages

### Report Management
- ✅ PDF report upload
- ✅ Report ready notifications
- ✅ Secure report download
- ✅ Report status tracking

### Dashboards
- ✅ Customer dashboard with booking history and statistics
- ✅ Lab staff dashboard for booking management
- ✅ Admin dashboard with analytics and user management
- ✅ Role-specific navigation and features

### User Management
- ✅ User profile management
- ✅ Password change functionality
- ✅ User role management (Admin only)
- ✅ User activation/deactivation

## 🏗️ Project Structure

```
LabEase/
├── client/                          # React frontend
│   ├── src/
│   │   ├── api/                    # API service layer
│   │   ├── assets/                 # Images, icons, etc.
│   │   ├── components/             # React components
│   │   │   ├── common/            # Navbar, Footer, etc.
│   │   │   ├── forms/             # Form components
│   │   │   ├── navbar/            # Navigation
│   │   │   ├── sidebar/           # Dashboard sidebar
│   │   │   ├── cards/             # Card components
│   │   │   ├── tables/            # Table components
│   │   │   └── modals/            # Modal components
│   │   ├── context/               # React Context (Auth)
│   │   ├── pages/                 # Page components
│   │   │   ├── auth/              # Login, Register
│   │   │   ├── public/            # Home, TestCatalog
│   │   │   ├── customer/          # Customer pages
│   │   │   ├── staff/             # Lab staff pages
│   │   │   └── admin/             # Admin pages
│   │   ├── layouts/               # Layout components
│   │   ├── routes/                # Routing configuration
│   │   ├── styles/                # Global styles
│   │   └── utils/                 # Helper functions
│   ├── App.jsx
│   ├── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── .env.example
│
├── server/                          # Node.js backend
│   ├── src/
│   │   ├── config/                # Database configuration
│   │   ├── controllers/           # Request handlers
│   │   ├── routes/                # API routes
│   │   ├── middleware/            # Express middleware
│   │   ├── entities/              # TypeORM entities
│   │   ├── services/              # Business logic
│   │   ├── utils/                 # Helper functions
│   │   ├── constants/             # Application constants
│   │   └── index.js               # Server entry point
│   ├── uploads/                   # File uploads directory
│   ├── package.json
│   ├── .env.example
│   └── .gitignore
│
├── README.md
├── .gitignore
└── package.json (optional root)
```

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- PostgreSQL 12+
- Git

### Installation

1. **Clone the repository**
```bash
cd LabEase
```

2. **Setup Backend**
```bash
cd server
npm install

# Create .env file
cp .env.example .env

# Update .env with your database credentials and Stripe keys
# DB_HOST=localhost
# DB_USERNAME=labease_user
# DB_PASSWORD=your_password
# DB_DATABASE=labease_db
# JWT_SECRET=your_jwt_secret
# STRIPE_SECRET_KEY=your_stripe_secret
# STRIPE_PUBLISHABLE_KEY=your_stripe_publishable
```

3. **Setup Frontend**
```bash
cd ../client
npm install

# Create .env file
cp .env.example .env

# Update .env with API base URL
# VITE_API_BASE_URL=http://localhost:5000/api
# VITE_STRIPE_PUBLIC_KEY=your_stripe_publishable_key
```

### Database Setup

1. **Create PostgreSQL Database**
```sql
CREATE USER labease_user WITH PASSWORD 'your_secure_password';
CREATE DATABASE labease_db OWNER labease_user;
```

2. **Tables will be auto-created** by TypeORM on first run

### Running the Application

**Terminal 1 - Start Backend**
```bash
cd server
npm run dev
```
Backend runs at: `http://localhost:5000`

**Terminal 2 - Start Frontend**
```bash
cd client
npm run dev
```
Frontend runs at: `http://localhost:5173`

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/verify` - Verify token

### Tests
- `GET /api/tests` - Get all tests (paginated)
- `GET /api/tests/:id` - Get test by ID
- `GET /api/tests/search?query=` - Search tests
- `POST /api/tests` - Create test (Admin)
- `PUT /api/tests/:id` - Update test (Admin)
- `DELETE /api/tests/:id` - Delete test (Admin)

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category by ID
- `POST /api/categories` - Create category (Admin)
- `PUT /api/categories/:id` - Update category (Admin)
- `DELETE /api/categories/:id` - Delete category (Admin)

### Bookings
- `POST /api/bookings` - Create booking (Customer)
- `GET /api/bookings` - Get all bookings (Admin, Staff)
- `GET /api/bookings/my-bookings` - Get user's bookings
- `GET /api/bookings/id/:id` - Get booking details
- `PUT /api/bookings/:id/status` - Update booking status (Staff, Admin)
- `PUT /api/bookings/:id/cancel` - Cancel booking
- `GET /api/bookings/search` - Search bookings

### Reports
- `POST /api/reports/upload` - Upload report (Staff, Admin)
- `PUT /api/reports/mark-ready` - Mark report as ready
- `GET /api/reports/:bookingId` - Get report
- `GET /api/reports/my-reports` - Get user's reports

### Payments
- `POST /api/payments/create-session` - Create payment session
- `GET /api/payments/status/:sessionId` - Get payment status
- `GET /api/payments/my-payments` - Get user's payments
- `POST /api/payments/webhook` - Stripe webhook

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `POST /api/users/change-password` - Change password
- `GET /api/users` - Get all users (Admin)
- `GET /api/users/role/:role` - Get users by role (Admin)

## 🔐 User Roles

### Customer
- Browse medical tests
- Book tests
- View booking history
- Download reports
- View payment history

### Lab Staff
- View assigned bookings
- Update booking status
- Upload PDF reports
- Mark reports as ready

### Admin
- Manage users (create, activate, deactivate)
- Manage tests and categories
- Manage bookings
- View analytics
- View total revenue
- Control pricing

## 💳 Payment Integration

LabEase uses **Stripe** for secure payment processing.

1. **Get Stripe Keys**
   - Visit [Stripe Dashboard](https://dashboard.stripe.com)
   - Get your Secret Key and Publishable Key

2. **Configure Environment Variables**
   ```
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_PUBLISHABLE_KEY=pk_test_...
   ```

3. **Payment Flow**
   - Customer books tests
   - System creates Stripe checkout session
   - Customer completes payment
   - Webhook confirms payment
   - Booking status updates to SAMPLE_COLLECTED

## 🎨 UI/UX Features

- **Modern Design**: Clean, professional healthcare aesthetic
- **Responsive Layout**: Works perfectly on mobile, tablet, and desktop
- **Smooth Animations**: Framer Motion for engaging interactions
- **Toast Notifications**: Real-time user feedback
- **Loading States**: Skeleton loaders and spinners
- **Error Handling**: Comprehensive error messages
- **Accessible**: WCAG 2.1 compliant

## 📊 Database Schema

### Entities
- **User**: User accounts with roles
- **Category**: Test categories
- **Test**: Medical tests with pricing
- **Booking**: Customer test bookings
- **BookingTest**: Many-to-many relationship between bookings and tests
- **Report**: PDF test reports
- **Invoice**: Booking invoices
- **Payment**: Payment records

## 🔄 Booking Status Flow

```
BOOKED → SAMPLE_COLLECTED → PROCESSING → REPORT_READY → COMPLETED
                              ↓
                           CANCELLED
```

## 🛠️ Tech Stack

### Frontend
- React 18
- Vite
- Tailwind CSS
- React Router
- Axios
- Framer Motion
- React Hot Toast
- Stripe JS

### Backend
- Node.js
- Express.js
- TypeORM
- PostgreSQL
- JWT
- bcryptjs
- Stripe Node SDK
- Multer

## 📝 Environment Variables

### Backend (.env)
```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=labease_user
DB_PASSWORD=your_password
DB_DATABASE=labease_db
JWT_SECRET=your_jwt_secret
JWT_EXPIRY=7d
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
STRIPE_SECRET_KEY=your_stripe_secret
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable
FRONTEND_URL=http://localhost:5173
UPLOAD_DIR=uploads
MAX_FILE_SIZE=5242880
```

### Frontend (.env)
```
VITE_API_BASE_URL=http://localhost:5000/api
VITE_STRIPE_PUBLIC_KEY=your_stripe_publishable_key
```

## 🔐 Security Features

- ✅ JWT authentication with expiry
- ✅ Password hashing with bcryptjs (10 salt rounds)
- ✅ Role-based access control
- ✅ Protected API routes
- ✅ CORS configuration
- ✅ Input validation
- ✅ Secure file upload handling
- ✅ Stripe webhook verification

## 📦 Deployment

### Frontend (Vercel)
```bash
npm run build
# Deploy the dist/ folder to Vercel
```

### Backend (Heroku/Railway)
```bash
# Set environment variables
# Deploy using Git
```

## 🐛 Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Check database credentials in .env
- Verify database exists

### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

### Stripe Integration Issues
- Verify API keys are correct
- Check Stripe account is activated
- Ensure webhook URL is configured

## 📄 License

MIT License - feel free to use this project for your own purposes.

## 👨‍💻 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For support, email support@labease.com or open an issue in the repository.

---

**LabEase** - Making healthcare accessible, one test at a time! 🏥
