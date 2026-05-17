# Frontend Blank Screen - Debugging Guide

## Quick Fixes to Try

### 1. **Open Browser Developer Console** (Most Important!)
Press `F12` or `Ctrl+Shift+I` and check the **Console** tab for errors.

**Look for:**
- Red error messages
- Module not found errors
- CORS errors
- Network failures

### 2. **Hard Refresh Browser**
- **Windows/Linux:** `Ctrl+Shift+R`
- **Mac:** `Cmd+Shift+R`

This clears cache and reloads all assets.

### 3. **Check Network Tab**
1. Open DevTools (`F12`)
2. Go to **Network** tab
3. Refresh page (`F5`)
4. Look for failed requests (red text):
   - If `http://localhost:5000/api` fails → Backend not running
   - If CSS/JS files fail → Vite dev server issue

### 4. **Verify Backend is Running**
```bash
# In server terminal, you should see:
✓ Database connected successfully
Server running on port 5000
```

If NOT running, start it:
```bash
cd server
npm run dev
```

### 5. **Verify Frontend Dev Server**
```bash
# In client terminal, you should see:
VITE v5.0.8  ready in XXX ms

➜  Local:   http://localhost:5173/
➜  press h to show help
```

If NOT running, start it:
```bash
cd client
npm run dev
```

---

## Step-by-Step Troubleshooting

### Step 1: Check Browser Console for Errors
```
F12 → Console tab → Look for red text
```

**Common Errors & Solutions:**

| Error | Solution |
|-------|----------|
| `Cannot GET /` | Vite dev server not running. Run `npm run dev` in client folder |
| `CORS error` | Backend not running or wrong URL in `.env` |
| `Module not found` | Clear node_modules: `rm -r node_modules && npm install` |
| `Cannot find module` | Import path wrong or file doesn't exist |
| `AuthContext is not defined` | Check import in App.jsx |

### Step 2: Verify Network Requests
1. Open DevTools (`F12`)
2. Go to **Network** tab
3. Refresh page
4. Look for requests to `http://localhost:5000/api/auth/verify`

**Expected:**
- Status: `200` or `401` (401 is OK if not logged in)
- Response: Should have data or auth error

**Problem:** Status `0` or `ERR_CONNECTION_REFUSED`
- Backend not running

### Step 3: Check React DevTools
1. Install [React Developer Tools](https://chromewebstore.google.com/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi) extension
2. Open DevTools (`F12`)
3. Go to **Components** tab
4. Look for React component tree

**If empty:** React didn't render
- Check console for errors
- Check if `<div id="root"></div>` exists in index.html

### Step 4: Test Individual Components
Create a simple test file to isolate the issue:

**File:** `client/src/Test.jsx`
```javascript
export default function Test() {
  return <div className="bg-blue-500 p-8">Test Content - Frontend is Working!</div>;
}
```

**Update** `client/src/App.jsx` temporarily:
```javascript
import Test from './Test.jsx';

function App() {
  return <Test />;
}

export default App;
```

If you see "Test Content - Frontend is Working!" then:
- ✅ React is rendering
- ✅ Tailwind CSS is working
- ❌ Issue is in routing or components

---

## Complete Debug Checklist

- [ ] Browser console shows NO red errors
- [ ] Backend running: `npm run dev` in server folder
- [ ] Frontend running: `npm run dev` in client folder
- [ ] Backend logs show: "Database connected successfully"
- [ ] Frontend logs show: "VITE ready in XXX ms"
- [ ] Network requests to `http://localhost:5000` succeed
- [ ] `server/.env` has correct database credentials
- [ ] `client/.env` has correct `VITE_API_BASE_URL=http://localhost:5000/api`
- [ ] Hard refresh browser: `Ctrl+Shift+R`
- [ ] Clear browser cache: DevTools → Storage → Clear All

---

## Most Common Causes

### 1️⃣ **Backend Not Running**
**Solution:** 
```bash
cd server && npm run dev
```
**Check:** Backend console should show database connected

### 2️⃣ **Frontend Dev Server Not Running**
**Solution:**
```bash
cd client && npm run dev
```
**Check:** Frontend console should show VITE ready

### 3️⃣ **Wrong .env Configuration**
**Verify:**
```bash
# In server/.env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=zakarya    # or your password
DB_DATABASE=labease_db

# In client/.env
VITE_API_BASE_URL=http://localhost:5000/api
```

### 4️⃣ **Missing Dependencies**
**Solution:**
```bash
# Clear and reinstall
rm -r client/node_modules
cd client && npm install

# Repeat for server if needed
```

### 5️⃣ **Tailwind CSS Not Loading**
**Check:**
```bash
# In client/.env - verify this exists:
VITE_API_BASE_URL=http://localhost:5000/api

# Rebuild
cd client
npm run build

# Or restart dev server
npm run dev
```

---

## Nuclear Option (If Nothing Else Works)

```bash
# 1. Kill all processes
# Ctrl+C in all terminals

# 2. Clean everything
cd client
rm -rf node_modules package-lock.json dist

# 3. Reinstall
npm install
npm run dev

# 4. In new terminal for backend
cd server
npm install
npm run dev

# 5. In browser
http://localhost:5173
```

---

## What to Share If Still Broken

When asking for help, provide:

1. **Browser Console Error** (Screenshot or text from F12 → Console)
2. **Network Tab Status** (Do requests to localhost:5000 show errors?)
3. **Backend Terminal Output** (Last 10 lines after npm run dev)
4. **Frontend Terminal Output** (Last 10 lines after npm run dev)
5. **URL being accessed** (should be http://localhost:5173)

---

## Expected Behavior (When Working)

✅ **Home Page Should Show:**
- LabEase logo in top-left
- Navigation bar with "Tests", "Login", "Register" buttons
- Blue gradient hero section with "Healthcare Made Simple" text
- "Why Choose LabEase?" section with 3 feature cards
- "Popular Tests" section with 4 test cards
- Dark footer with contact info

✅ **Browser DevTools Should Show:**
- Console: No red errors
- Network: All requests successful (green 200 status)
- React Components: Full component tree visible

---

**Once you fix it, the page should show content with the blue color scheme!**
