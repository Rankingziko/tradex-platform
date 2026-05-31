# TRADEX - Testing & Verification Guide

## ✅ Website Testing Checklist

Run through this checklist to verify all features are working correctly.

---

## 🚀 Phase 1: Server Startup Verification

### Backend Server
- [ ] Navigate to `c:\Users\Hp\OneDrive\Desktop\code\server`
- [ ] Run `node server.js`
- [ ] Verify output shows:
  ```
  ✅ Server running on port 5000
  🔧 Environment: development
  🌐 URL: http://localhost:5000
  ```
- [ ] Test: `curl http://localhost:5000/api/health` returns OK

### Frontend Server
- [ ] Navigate to `c:\Users\Hp\OneDrive\Desktop\code\client`
- [ ] Run `npm start`
- [ ] Verify browser opens at `http://localhost:3000`
- [ ] Verify no red errors in console

---

## 🧪 Phase 2: Authentication Testing

### Register New Account
- [ ] Go to http://localhost:3000/register
- [ ] Fill in form:
  - First Name: `Test`
  - Last Name: `User`
  - Email: `test@tradex.com`
  - Password: `TestPass123`
- [ ] Click "Create Account"
- [ ] Verify redirects to login page
- [ ] Verify success message

### Login with New Account
- [ ] Email: `test@tradex.com`
- [ ] Password: `TestPass123`
- [ ] Click "Sign In"
- [ ] Verify redirects to dashboard
- [ ] Verify user name displays in sidebar

### Test Demo Account
- [ ] Logout (click profile → Logout)
- [ ] Email: `demo@tradex.com`
- [ ] Password: `demo123`
- [ ] Verify login successful

---

## 📊 Phase 3: Dashboard Testing

### Dashboard Page
- [ ] Verify page loads at http://localhost:3000/dashboard
- [ ] Check elements display:
  - [ ] Welcome message with user name
  - [ ] Total Balance card
  - [ ] Total Deposited card
  - [ ] Total Withdrawn card
  - [ ] Available Margin card
- [ ] Check Wallets section:
  - [ ] Shows wallet list
  - [ ] Each wallet has currency symbol
  - [ ] Each wallet shows balance

### Market Data
- [ ] Check Top Gainers section displays
- [ ] Check Top Losers section displays
- [ ] Verify prices are displayed
- [ ] Verify percentage changes shown

---

## 📈 Phase 4: Trading System Testing

### Navigate to Trading Page
- [ ] Click "Trading" in sidebar
- [ ] Verify page loads at http://localhost:3000/trading
- [ ] Check elements display:
  - [ ] Trading Stats cards
  - [ ] Trade Form
  - [ ] Open Trades section
  - [ ] Trade History

### Create a Test Trade
- [ ] Click "New Trade" button
- [ ] Fill in form:
  - [ ] Symbol: Select from dropdown (e.g., BTC/USD)
  - [ ] Type: Select "Buy" or "Sell"
  - [ ] Quantity: Enter `1`
  - [ ] Entry Price: Enter `45000`
  - [ ] Leverage: Select `1x`
  - [ ] Stop Loss: Enter `44000` (optional)
  - [ ] Take Profit: Enter `50000` (optional)
- [ ] Click "Place Trade" button
- [ ] Verify success message
- [ ] Verify trade appears in Open Trades
- [ ] Verify trade appears in Trade History

### Close a Trade
- [ ] Click "Close" button on an open trade
- [ ] Verify close price prompt
- [ ] Enter exit price
- [ ] Verify trade status changes to "Closed"
- [ ] Verify P/L displays

---

## 💰 Phase 5: Wallet & Deposits Testing

### Navigate to Wallet Page
- [ ] Click "Wallet" in sidebar
- [ ] Verify page loads at http://localhost:3000/wallet
- [ ] Check elements:
  - [ ] Total Balance displays
  - [ ] Wallet grid shows all currencies
  - [ ] Each wallet shows balance
  - [ ] Deposit and Withdraw buttons visible

### Test Deposit
- [ ] Click "Deposit" button
- [ ] Fill form:
  - [ ] Currency: Select `BTC`
  - [ ] Amount: Enter `0.5`
  - [ ] Method: Select `Crypto`
- [ ] Click "Create Deposit"
- [ ] Verify success message
- [ ] Verify deposit appears in history

### Test Withdrawal (Optional)
- [ ] Click "Withdraw" button
- [ ] Fill form:
  - [ ] Currency: Select `BTC`
  - [ ] Amount: Enter `0.1`
  - [ ] Method: Select `Crypto`
  - [ ] Address: Enter `1A1z7agoat...`
- [ ] Click "Request Withdrawal"
- [ ] Verify pending status

---

## 📊 Phase 6: Markets Testing

### Navigate to Markets Page
- [ ] Click "Markets" in sidebar
- [ ] Verify page loads at http://localhost:3000/markets
- [ ] Check elements:
  - [ ] Search box displays
  - [ ] Sort dropdown displays
  - [ ] Market table displays
  - [ ] At least 10 coins show

### Test Search
- [ ] Type "Bitcoin" in search box
- [ ] Verify table filters to show BTC
- [ ] Clear search
- [ ] Verify all coins return

### Test Sorting
- [ ] Click "Sort by" dropdown
- [ ] Select "Price"
- [ ] Verify table re-sorts
- [ ] Try other sort options

### Test Favorites
- [ ] Click star icon on a coin
- [ ] Verify star fills in (highlights)
- [ ] Click again to unfavorite
- [ ] Verify star empties

---

## 📜 Phase 7: History Testing

### Navigate to History Page
- [ ] Click "History" in sidebar
- [ ] Verify page loads at http://localhost:3000/history

### Test Trades Tab
- [ ] Click "Trades" tab
- [ ] Verify recent trades display
- [ ] Check columns: Symbol, Type, Entry, Exit, P/L, %Return, Date
- [ ] Verify at least one trade shows

### Test Deposits Tab
- [ ] Click "Deposits" tab
- [ ] Verify deposits display as cards
- [ ] Each card shows: amount, currency, date, status
- [ ] Verify status badge displays

### Test Withdrawals Tab
- [ ] Click "Withdrawals" tab
- [ ] Verify withdrawals display
- [ ] Check status is "Pending" for new withdrawals

### Test Transfers Tab
- [ ] Click "Transfers" tab
- [ ] Check structure (should be empty if no transfers made)

---

## 👤 Phase 8: Profile Testing

### Navigate to Profile Page
- [ ] Click profile icon or "Settings" in sidebar
- [ ] Verify page loads at http://localhost:3000/profile
- [ ] Check sections:
  - [ ] Profile header with name
  - [ ] Account Information section
  - [ ] Security section
  - [ ] Logout button

### Edit Profile
- [ ] Click "Edit Profile" button
- [ ] Change First Name to "John"
- [ ] Change Phone to "+1234567890"
- [ ] Click "Save Changes"
- [ ] Verify success message
- [ ] Verify name updates in sidebar

### Test Password Change (Optional)
- [ ] Click "Change Password" button
- [ ] Enter current password
- [ ] Enter new password
- [ ] Confirm new password
- [ ] Click "Update"
- [ ] Verify success message

---

## 📱 Phase 9: Mobile Responsiveness Testing

### Desktop View (Full Width)
- [ ] Open DevTools (F12)
- [ ] Verify all content displays properly
- [ ] Verify sidebar visible
- [ ] Check all buttons are clickable

### Tablet View (768px)
- [ ] Press F12 → Toggle device toolbar
- [ ] Select iPad or similar
- [ ] Verify layout adapts
- [ ] Verify all features still work

### Mobile View (375px)
- [ ] Press F12 → Toggle device toolbar
- [ ] Select iPhone or similar (375x667)
- [ ] Verify sidebar collapses/hides
- [ ] Verify bottom navigation appears
- [ ] Test bottom nav:
  - [ ] Click Dashboard icon
  - [ ] Click Trading icon
  - [ ] Click Wallet icon
  - [ ] Click Markets icon
  - [ ] Click Settings icon
- [ ] Verify all pages load correctly
- [ ] Verify forms are easy to fill

---

## 🎨 Phase 10: UI/UX Testing

### Visual Elements
- [ ] Dark mode theme applied to all pages
- [ ] Gradient backgrounds visible
- [ ] Glassmorphism cards have transparency effect
- [ ] All text readable on dark background
- [ ] Icons display correctly (Lucide icons)

### Colors & Design
- [ ] Cyan/blue gradients visible
- [ ] Green used for positive values
- [ ] Red used for negative values
- [ ] Cards have rounded corners
- [ ] Buttons have hover effects

### Animations
- [ ] Page transitions are smooth
- [ ] Buttons have hover animations
- [ ] Forms have focus effects
- [ ] Lists have smooth scrolling

---

## 🔐 Phase 11: Security Testing

### Login Security
- [ ] Try logging in with wrong password
- [ ] Verify error message appears
- [ ] Try accessing /dashboard without login
- [ ] Verify redirects to /login

### Token Storage
- [ ] Open DevTools → Application → LocalStorage
- [ ] Verify token is stored after login
- [ ] Verify token cleared after logout
- [ ] Verify email/user info stored if applicable

### Password Requirements
- [ ] During register, verify password requirements show
- [ ] Try password without uppercase - shows requirement
- [ ] Try password without number - shows requirement
- [ ] Try password less than 8 chars - shows requirement

---

## 🌐 Phase 12: API Testing

### Test API Endpoints (In terminal/Postman)

**Health Check:**
```bash
curl http://localhost:5000/api/health
```
Expected: OK response

**Get Markets:**
```bash
curl http://localhost:5000/api/markets
```
Expected: JSON array of market data

**Register (POST):**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test2@tradex.com",
    "password": "TestPass123"
  }'
```
Expected: User created with token

**Login (POST):**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@tradex.com",
    "password": "TestPass123"
  }'
```
Expected: Returns token

---

## 🌍 Phase 13: Network Access Testing

### Local Network Access
- [ ] Find your IP: `ipconfig` → IPv4 Address
- [ ] From another computer on network:
  - [ ] Open browser
  - [ ] Go to `http://YOUR_IP:3000`
  - [ ] Verify app loads
  - [ ] Try registering
  - [ ] Try logging in
  - [ ] Try a trade

### Internet Access (Optional - with ngrok)
- [ ] Install ngrok: `choco install ngrok`
- [ ] Run: `ngrok http 5000`
- [ ] Copy ngrok URL
- [ ] Test API: `curl YOUR_NGROK_URL/api/markets`
- [ ] Share ngrok URL with someone
- [ ] Have them access frontend via: `ngrok http 3000`

---

## ✅ Final Verification

### All Systems Go?
- [ ] Backend running on :5000
- [ ] Frontend running on :3000
- [ ] No console errors
- [ ] All pages load
- [ ] Trading works
- [ ] Wallet displays
- [ ] Markets show data
- [ ] Mobile responsive
- [ ] UI looks professional
- [ ] Network accessible

---

## 🐛 If Something Fails

### Backend Issues
```bash
# Check if running
curl http://localhost:5000/api/health

# Check logs in terminal
# Restart: Ctrl+C then node server.js
```

### Frontend Issues
```bash
# Check browser console (F12)
# Look for red errors
# Check Network tab for failed requests
# Restart: Ctrl+C then npm start
```

### API Connection Issues
- Check `.env` files for correct URLs
- Verify backend is running
- Check firewall isn't blocking port 5000
- Restart both services

### Database Issues
- Ensure MongoDB is running
- Check connection string in `.env`
- Verify MongoDB is accessible

---

## 📋 Test Results Summary

After completing all tests, fill in:

| Phase | Status | Notes |
|-------|--------|-------|
| Server Startup | ✅/❌ | |
| Authentication | ✅/❌ | |
| Dashboard | ✅/❌ | |
| Trading | ✅/❌ | |
| Wallet | ✅/❌ | |
| Markets | ✅/❌ | |
| History | ✅/❌ | |
| Profile | ✅/❌ | |
| Mobile | ✅/❌ | |
| UI/UX | ✅/❌ | |
| Security | ✅/❌ | |
| API | ✅/❌ | |
| Network | ✅/❌ | |

---

## 🎉 All Tests Passed?

Congratulations! Your TRADEX application is fully functional and ready to use! 🚀

**Share with Others:**
- Local Network: `http://YOUR_IP:3000`
- Internet: Use ngrok URL or deploy to cloud

---

**Happy Testing! 📈**
