# LabEase Environment Setup Guide

## Summary of Missing Files

The `.gitignore` file ignores the following security-sensitive files that were **not cloned** and need to be created locally:

### Files Created ✓
1. **`server/.env`** - Backend environment configuration
2. **`client/.env`** - Frontend environment configuration

---

## Prerequisites

Before running the project, ensure you have:

1. **Node.js** (v16 or higher)
2. **npm** or **yarn**
3. **PostgreSQL** (v12 or higher)

---

## Database Setup (PostgreSQL)

### 1. Create PostgreSQL Database and User

```sql
-- Connect to PostgreSQL as a superuser
-- Create a new user
CREATE USER labease_user WITH PASSWORD 'labease_password_123';

-- Create a new database
CREATE DATABASE labease_db OWNER labease_user;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE labease_db TO labease_user;
ALTER ROLE labease_user CREATEDB;
```

### 2. Verify PostgreSQL Connection

```bash
# Test connection (Windows Command Prompt or PowerShell)
psql -h localhost -U labease_user -d labease_db -c "\dt"
```

---

## Backend Setup (Server)

### 1. Navigate to Server Directory
```bash
cd server
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure `.env` File

The `server/.env` file has been created with the following configuration:

```env
# Database Configuration (PostgreSQL)
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=labease_user
DB_PASSWORD=labease_password_123
DB_DATABASE=labease_db

# Server Configuration
NODE_ENV=development
PORT=5000

# CORS Configuration
CORS_ORIGIN=http://localhost:5173

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_change_this_in_production_make_it_long_and_random

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here

# Payment Webhook
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

**⚠️ IMPORTANT:** 
- Update `DB_PASSWORD` to match your PostgreSQL user password
- Replace Stripe keys with your actual keys from [Stripe Dashboard](https://dashboard.stripe.com)
- Generate a secure `JWT_SECRET` for production

### 4. Run Database Seed (Optional)

```bash
npm run seed
```

This initializes the database with sample data.

### 5. Start Development Server

```bash
npm run dev
```

Server will run at: `http://localhost:5000`

---

## Frontend Setup (Client)

### 1. Navigate to Client Directory
```bash
cd client
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure `.env` File

The `client/.env` file has been created with:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:5000/api

# Stripe Public Key
VITE_STRIPE_PUBLIC_KEY=pk_test_your_stripe_publishable_key_here
```

**⚠️ IMPORTANT:**
- Replace `VITE_STRIPE_PUBLIC_KEY` with your actual Stripe public key
- Ensure `VITE_API_BASE_URL` matches your backend server URL

### 4. Start Development Server

```bash
npm run dev
```

Frontend will run at: `http://localhost:5173`

---

## Running Both Services Together

### Option 1: Two Terminal Windows

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

### Option 2: Using VS Code

- Open the project in VS Code
- Split the terminal (Ctrl+Shift+5)
- Run `npm run dev` in each terminal

---

## Stripe Setup (If Using Payment Features)

1. Create a [Stripe Account](https://stripe.com)
2. Get your API keys from Dashboard → Developers → API Keys
3. Update `.env` files with:
   - `STRIPE_SECRET_KEY` (backend)
   - `STRIPE_PUBLISHABLE_KEY` (backend & frontend)
4. Setup webhook endpoint:
   - URL: `http://localhost:5000/api/payments/webhook`
   - Events: `payment_intent.succeeded`, `payment_intent.payment_failed`

---

## Project Structure

```
LabEase/
├── server/          # Node.js + Express backend
│   ├── .env         # Backend environment variables (CREATED)
│   ├── .env.example # Example configuration
│   └── src/
│       ├── config/
│       │   └── database.js  # PostgreSQL configuration
│       ├── entities/        # TypeORM entities
│       ├── controllers/     # Business logic
│       ├── routes/          # API endpoints
│       └── services/        # Service layer
├── client/          # React + Vite frontend
│   ├── .env         # Frontend environment variables (CREATED)
│   ├── .env.example # Example configuration
│   └── src/
│       ├── pages/
│       ├── components/
│       ├── api/
│       └── context/
└── .gitignore       # Files not tracked by git
```

---

## Common Issues & Solutions

### ❌ Database Connection Failed
- Verify PostgreSQL is running
- Check credentials in `.env` match your DB user
- Confirm database exists: `psql -l`

### ❌ CORS Error
- Ensure frontend URL matches `CORS_ORIGIN` in server `.env`
- Default: `http://localhost:5173`

### ❌ API Base URL Error
- Verify `VITE_API_BASE_URL` in client `.env` matches server URL
- Default: `http://localhost:5000/api`

### ❌ Stripe Keys Missing
- Get keys from [Stripe Dashboard](https://dashboard.stripe.com)
- Use **Test** keys in development (start with `sk_test_` and `pk_test_`)

### ❌ Port Already in Use
```bash
# Change PORT in server/.env or use:
# Windows
netstat -ano | findstr :5000
taskkill /PID [PID] /F

# macOS/Linux
lsof -i :5000
kill -9 [PID]
```

---

## Next Steps

1. ✅ Create `.env` files (DONE)
2. ✅ Set up PostgreSQL database
3. ✅ Install dependencies
4. ✅ Configure environment variables
5. Run `npm run dev` in both folders
6. Access application at `http://localhost:5173`

---

## Additional Notes

- The `uploads/` directory stores user-uploaded files
- TypeORM will auto-sync entities with database in development
- JWT tokens are stored in browser localStorage
- All API endpoints require authentication except `/auth/login` and `/auth/register`

---

For more information, see `README.md`, `SETUP.md`, and `QUICK_START.md` in the root directory.
