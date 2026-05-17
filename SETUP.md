# LabEase Setup Guide

## Complete Installation & Setup Instructions

### Prerequisites
- Node.js v16 or higher
- npm or yarn
- PostgreSQL v12 or higher
- Git
- Stripe Account (for payment integration)

### Step 1: Clone or Extract Project

```bash
cd LabEase
```

### Step 2: Database Setup

#### Option A: PostgreSQL (Local)
```bash
# Connect to PostgreSQL
psql -U postgres

# Create user and database
CREATE USER labease_user WITH PASSWORD 'labease_password';
CREATE DATABASE labease_db OWNER labease_user;
GRANT ALL PRIVILEGES ON DATABASE labease_db TO labease_user;

# Exit PostgreSQL
\q
```

#### Option B: PostgreSQL (Docker)
```bash
docker run --name labease-postgres \
  -e POSTGRES_USER=labease_user \
  -e POSTGRES_PASSWORD=labease_password \
  -e POSTGRES_DB=labease_db \
  -p 5432:5432 \
  -d postgres:14
```

### Step 3: Backend Setup

```bash
cd server

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your configuration
nano .env
```

**Update these values in .env:**
```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=labease_user
DB_PASSWORD=labease_password
DB_DATABASE=labease_db
JWT_SECRET=your_secure_secret_key_here
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
```

### Step 4: Seed Database (Optional)

```bash
# This creates sample data, categories, tests, and demo users
npm run seed

# Demo Credentials:
# Admin: admin@labease.com / admin123
# Staff: staff@labease.com / staff123
```

### Step 5: Frontend Setup

```bash
cd ../client

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your configuration
nano .env
```

**Update these values in .env:**
```
VITE_API_BASE_URL=http://localhost:5000/api
VITE_STRIPE_PUBLIC_KEY=pk_test_xxxxx
```

### Step 6: Get Stripe Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Sign up or log in
3. Navigate to Developers → API Keys
4. Copy Publishable Key and Secret Key
5. Update both .env files with these keys

### Step 7: Run the Application

**Terminal 1 - Start Backend:**
```bash
cd server
npm run dev
```
✓ Backend will run on `http://localhost:5000`

**Terminal 2 - Start Frontend:**
```bash
cd client
npm run dev
```
✓ Frontend will run on `http://localhost:5173`

### Step 8: Access the Application

- **Home Page**: http://localhost:5173
- **Admin Login**: admin@labease.com / admin123
- **Staff Login**: staff@labease.com / staff123
- **Customer Registration**: Create new account at /register

---

## 🔍 Verification Steps

### Backend Health Check
```bash
curl http://localhost:5000/api/health
```
Expected response:
```json
{"status":"OK","timestamp":"2024-01-15T10:30:00.000Z"}
```

### Frontend Health Check
Open http://localhost:5173 in browser and check console for API connection.

---

## 📝 Default Test Data

After running `npm run seed`, the following will be created:

### Categories
- Blood Tests
- Cardiac Tests
- COVID-19
- Diabetes
- Thyroid
- Fertility

### Tests (Example)
- Complete Blood Count (CBC) - $25
- COVID-19 RT-PCR - $50
- ECG - $80
- Thyroid Profile - $60
- Full Body Checkup - $150

### Demo Users
1. **Admin User**
   - Email: admin@labease.com
   - Password: admin123
   - Access: Full admin panel

2. **Lab Staff User**
   - Email: staff@labease.com
   - Password: staff123
   - Access: Staff dashboard, booking management

3. **Sample Customers**
   - Create via registration form

---

## 🐛 Common Issues & Solutions

### Issue: "Database connection failed"
**Solution:**
```bash
# Verify PostgreSQL is running
psql -U labease_user -d labease_db -c "SELECT version();"

# Check environment variables
cat .env | grep DB_
```

### Issue: "Port 5000 or 5173 already in use"
```bash
# Find and kill process
lsof -ti:5000 | xargs kill -9   # Backend
lsof -ti:5173 | xargs kill -9   # Frontend

# Or use different ports
NODE_ENV=development PORT=5001 npm run dev
```

### Issue: "Stripe API key invalid"
**Solution:**
- Verify API keys are correct in .env
- Ensure you're using TEST keys (sk_test_, pk_test_)
- Check Stripe account is activated

### Issue: "npm install fails"
```bash
# Clear npm cache
npm cache clean --force

# Try installing again
npm install

# If still fails, update npm
npm install -g npm@latest
```

---

## 📦 Deployment

### Frontend Deployment (Vercel)
```bash
cd client
npm run build

# Upload dist/ folder to Vercel
# Set environment variables in Vercel dashboard
```

### Backend Deployment (Heroku/Railway)
```bash
# Set environment variables on your hosting platform
# Deploy using Git or CLI

# Example for Heroku:
heroku config:set DB_HOST=your_db_host
heroku config:set STRIPE_SECRET_KEY=sk_live_xxxxx
git push heroku main
```

---

## 🔐 Production Checklist

- [ ] Change JWT_SECRET to a strong random string
- [ ] Update database password
- [ ] Use Stripe LIVE keys (not test keys)
- [ ] Set NODE_ENV=production
- [ ] Enable HTTPS
- [ ] Set up proper CORS origins
- [ ] Configure database backups
- [ ] Set up error logging
- [ ] Enable rate limiting
- [ ] Implement API monitoring

---

## 📞 Need Help?

- Check the README.md for feature overview
- Review API endpoints documentation
- Check error messages in console/logs
- Visit Stripe documentation: https://stripe.com/docs

---

**Happy booking!** 🏥
