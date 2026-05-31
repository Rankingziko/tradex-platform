# 🚀 TRADEX - Complete Full-Stack Crypto Trading Platform Setup Guide

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Prerequisites](#prerequisites)
5. [Installation & Setup](#installation--setup)
6. [Configuration](#configuration)
7. [Running the Application](#running-the-application)
8. [API Documentation](#api-documentation)
9. [Database Schema](#database-schema)
10. [Deployment](#deployment)
11. [Troubleshooting](#troubleshooting)

---

## 📊 Project Overview

**TRADEX** is a professional-grade cryptocurrency and forex trading platform with:
- Real-time market data integration
- Complete trading system (Buy/Sell/Limit orders)
- Deposit & withdrawal management
- Admin dashboard
- User authentication & security
- Responsive mobile-first design
- Production-ready codebase

### Key Features
✅ Real-time crypto prices (Binance API)
✅ Forex market data
✅ Interactive trading charts (Chart.js/TradingView)
✅ Complete trade execution
✅ Deposit/withdrawal system
✅ JWT authentication
✅ 2FA security
✅ Admin controls
✅ Mobile responsive
✅ Dark theme UI

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18.2
- **Styling**: TailwindCSS 3.3 + Custom CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **State Management**: Context API + Zustand
- **HTTP Client**: Axios
- **Charts**: Chart.js + Recharts
- **Build Tool**: Vite
- **Routing**: React Router v6

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT (jsonwebtoken)
- **Password**: bcryptjs
- **Security**: Helmet, CORS, Rate limiting
- **Real-time**: Socket.io
- **File Upload**: Multer
- **Email**: Nodemailer
- **Cache**: Redis (optional)
- **Payments**: Stripe (optional)

### Database
- **Primary**: MongoDB
- **Collections**: Users, Trades, Deposits, Withdrawals, Transfers, Notifications, etc.

---

## 📁 Project Structure

```
tradex-platform/
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── TradePage.jsx
│   │   │   ├── MarketsPage.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   ├── HistoryPage.jsx
│   │   │   └── AdminDashboard.jsx
│   │   ├── components/
│   │   │   ├── Navigation.jsx
│   │   │   ├── Chart.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── TradeForm.jsx
│   │   │   └── NotificationCenter.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── auth.js
│   │   │   └── trade.js
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   ├── useBalance.js
│   │   │   └── useTrades.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Trade.js
│   │   ├── Deposit.js
│   │   ├── Withdrawal.js
│   │   ├── Transfer.js
│   │   ├── Wallet.js
│   │   └── Notification.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── user.js
│   │   ├── trades.js
│   │   ├── deposits.js
│   │   ├── withdrawals.js
│   │   ├── transfers.js
│   │   ├── markets.js
│   │   └── admin.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── validation.js
│   │   ├── errorHandler.js
│   │   └── rateLimit.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── tradeController.js
│   │   ├── depositController.js
│   │   └── adminController.js
│   ├── services/
│   │   ├── binanceService.js
│   │   ├── emailService.js
│   │   ├── paymentService.js
│   │   └── tradeService.js
│   ├── config/
│   │   ├── database.js
│   │   ├── jwt.js
│   │   └── constants.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
├── .gitignore
└── README.md
```

---

## 📋 Prerequisites

Before starting, ensure you have installed:

1. **Node.js** (v16 or higher)
   - Download from https://nodejs.org/

2. **MongoDB** (Local or Cloud)
   - Local: https://www.mongodb.com/try/download/community
   - Cloud: https://www.mongodb.com/cloud/atlas (Free tier available)

3. **Git**
   - Download from https://git-scm.com/

4. **Code Editor**
   - VSCode recommended: https://code.visualstudio.com/

### Verify Installation
```bash
node --version     # Should show v16+
npm --version      # Should show 8+
mongod --version   # Should show version
git --version      # Should show version
```

---

## 🔧 Installation & Setup

### Step 1: Clone or Extract Project

```bash
# If cloning from Git
git clone <repository-url>
cd tradex-platform

# OR extract provided files
cd tradex-platform
```

### Step 2: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Configure .env (see Configuration section)

# Start MongoDB (if local)
# macOS/Linux
mongod

# Windows (in separate terminal)
mongod

# Start backend server
npm run dev
# Server will run on http://localhost:5000
```

### Step 3: Frontend Setup

```bash
# In new terminal, navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
# App will run on http://localhost:3000
```

---

## ⚙️ Configuration

### Backend .env Configuration

Create a `.env` file in the backend directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/tradex
# OR for MongoDB Atlas:
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/tradex?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=30d

# Email Configuration (Nodemailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=noreply@tradex.com

# Binance API (Optional - for real market data)
BINANCE_API_KEY=your-binance-api-key
BINANCE_API_SECRET=your-binance-api-secret

# Stripe Configuration (Optional - for payments)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLIC_KEY=pk_test_...

# AWS S3 (Optional - for file uploads)
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_S3_BUCKET=tradex-bucket
AWS_REGION=us-east-1

# Redis Configuration (Optional - for caching)
REDIS_URL=redis://localhost:6379

# Admin Configuration
ADMIN_EMAIL=admin@tradex.com
ADMIN_PASSWORD=SecureAdminPassword123!
```

### Frontend Configuration

Create `src/config/api.js`:

```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
  },
  TRADES: {
    PLACE: `${API_BASE_URL}/trades/place`,
    CLOSE: `${API_BASE_URL}/trades/:id/close`,
    LIST: `${API_BASE_URL}/trades`,
  },
  // ... more endpoints
};

export default API_BASE_URL;
```

---

## 🚀 Running the Application

### Development Mode

**Terminal 1 - MongoDB** (if using local)
```bash
mongod
```

**Terminal 2 - Backend**
```bash
cd backend
npm run dev
# Output: Server running on http://localhost:5000
```

**Terminal 3 - Frontend**
```bash
cd frontend
npm run dev
# Output: App running on http://localhost:3000
```

### Production Build

```bash
# Frontend
cd frontend
npm run build
# Output: dist/ folder created

# Backend
cd backend
NODE_ENV=production npm start
```

---

## 📚 API Documentation

### Authentication Endpoints

#### Register
```
POST /api/auth/register
Body: {
  username: string,
  email: string,
  password: string
}
Response: { user, token }
```

#### Login
```
POST /api/auth/login
Body: {
  email: string,
  password: string
}
Response: { user, token }
```

### Trading Endpoints

#### Place Trade
```
POST /api/trades/place
Headers: Authorization: Bearer <token>
Body: {
  pair: string,
  type: 'BUY' | 'SELL',
  orderType: 'MARKET' | 'LIMIT',
  amount: number,
  price: number,
  stopLoss: number,
  takeProfit: number,
  leverage: number
}
Response: { success: true, trade }
```

#### Close Trade
```
POST /api/trades/:tradeId/close
Headers: Authorization: Bearer <token>
Body: { closingPrice: number }
Response: { success: true, profit: number }
```

#### Get Trades
```
GET /api/trades
Headers: Authorization: Bearer <token>
Response: [Trade]
```

### Deposit/Withdrawal Endpoints

#### Create Deposit
```
POST /api/deposits/create
Headers: Authorization: Bearer <token>
Body: {
  method: 'CRYPTO' | 'BANK_TRANSFER',
  crypto: string,
  amount: number,
  transactionId: string
}
Response: { success: true, deposit }
```

#### Create Withdrawal
```
POST /api/withdrawals/create
Headers: Authorization: Bearer <token>
Body: {
  method: string,
  amount: number,
  walletAddress: string
}
Response: { success: true, withdrawal }
```

---

## 💾 Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  username: String,
  email: String,
  password: String (hashed),
  fullName: String,
  phone: String,
  country: String,
  balance: Number,
  totalProfit: Number,
  emailVerified: Boolean,
  twoFactorEnabled: Boolean,
  kycVerified: Boolean,
  referralCode: String,
  referredBy: String,
  createdAt: Date
}
```

### Trade Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref User),
  pair: String,
  type: 'BUY' | 'SELL',
  orderType: 'MARKET' | 'LIMIT',
  amount: Number,
  price: Number,
  stopLoss: Number,
  takeProfit: Number,
  leverage: Number,
  status: 'OPEN' | 'CLOSED' | 'PENDING',
  profit: Number,
  openedAt: Date,
  closedAt: Date
}
```

### Deposit Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref User),
  method: 'CRYPTO' | 'BANK_TRANSFER',
  crypto: String,
  amount: Number,
  transactionId: String,
  status: 'PENDING' | 'CONFIRMED' | 'REJECTED',
  createdAt: Date
}
```

---

## 🌐 Deployment

### Deploy Backend to Heroku

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create tradex-api

# Set environment variables
heroku config:set MONGODB_URI=<your-mongodb-atlas-url>
heroku config:set JWT_SECRET=<your-secret-key>

# Deploy
git push heroku main
```

### Deploy Frontend to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd frontend
vercel

# Set environment variables in Vercel dashboard
VITE_API_URL=https://tradex-api.herokuapp.com/api
```

### Deploy with Docker

Create `Dockerfile` in backend:
```dockerfile
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t tradex-api .
docker run -p 5000:5000 tradex-api
```

---

## 🐛 Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED
```
**Solution:**
- Ensure MongoDB is running: `mongod`
- Check MONGODB_URI in .env is correct
- If using Atlas, whitelist your IP address

### CORS Error
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution:**
- Verify CLIENT_URL in backend .env matches frontend URL
- Check CORS configuration in Express server

### Port Already in Use
```
Error: listen EADDRINUSE :::5000
```
**Solution:**
```bash
# Kill process using port
# macOS/Linux
lsof -ti:5000 | xargs kill -9

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Module Not Found
```
Error: Cannot find module 'express'
```
**Solution:**
```bash
# Reinstall dependencies
npm install

# Clear npm cache
npm cache clean --force
```

### JWT Validation Error
```
Error: jwt malformed
```
**Solution:**
- Ensure token is sent with "Bearer " prefix
- Verify JWT_SECRET is consistent

---

## 📊 Key Features Implementation

### Real-time Price Updates
```javascript
// Use Socket.io for real-time updates
const socket = io('http://localhost:5000');

socket.on('priceUpdate', (data) => {
  // Update UI with new price
});
```

### Trading Orders
```javascript
// Place a buy order
const placeTrade = async (tradeData) => {
  const response = await axios.post('/api/trades/place', tradeData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};
```

### Auto-liquidation
```javascript
// Check if stop-loss or take-profit hit
const checkLiquidation = (trade, currentPrice) => {
  if (trade.type === 'BUY') {
    if (currentPrice <= trade.stopLoss || currentPrice >= trade.takeProfit) {
      closeTrade(trade._id, currentPrice);
    }
  }
};
```

---

## 🔐 Security Checklist

- ✅ Use HTTPS in production
- ✅ Hash passwords with bcryptjs
- ✅ Validate all input data
- ✅ Use JWT with secure tokens
- ✅ Implement rate limiting
- ✅ Add 2FA authentication
- ✅ Use environment variables for secrets
- ✅ Implement CSRF protection
- ✅ Enable CORS properly
- ✅ Regular security audits

---

## 📞 Support & Resources

### Official Documentation
- Express.js: https://expressjs.com/
- React: https://react.dev/
- MongoDB: https://docs.mongodb.com/
- TailwindCSS: https://tailwindcss.com/

### Useful Packages
- Binance API: npm install binance-api-node
- Chart.js: npm install chart.js
- Socket.io: npm install socket.io

---

## 📝 License

This project is proprietary and for educational purposes only.

---

**🎉 Congratulations! Your TRADEX platform is ready to launch!**

For production deployment, ensure all security measures are in place and thorough testing has been completed.

---

**Last Updated**: May 29, 2026
**Version**: 1.0.0
**Status**: Production Ready
