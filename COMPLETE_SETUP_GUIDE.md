# 🚀 TRADEX - Complete Setup & Deployment Guide

Welcome to **TRADEX**, a premium full-stack cryptocurrency trading platform built with **React**, **Node.js/Express**, and **MongoDB**.

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [System Requirements](#system-requirements)
3. [Backend Setup](#backend-setup)
4. [Frontend Setup](#frontend-setup)
5. [Database Setup](#database-setup)
6. [Running the Application](#running-the-application)
7. [API Documentation](#api-documentation)
8. [Deployment Guide](#deployment-guide)
9. [Troubleshooting](#troubleshooting)

---

## 🎯 Project Overview

TRADEX is a comprehensive cryptocurrency trading platform featuring:

✅ **User Authentication** - Register, login, JWT tokens
✅ **Trading System** - Buy/Sell trades with real-time execution
✅ **Wallet Management** - Multi-currency wallets (BTC, ETH, USDT, etc)
✅ **Deposits & Withdrawals** - Secure fund transfers with admin approval
✅ **Real-time Markets** - Live crypto and forex data
✅ **User Dashboard** - Portfolio overview and statistics
✅ **Admin Panel** - Manage users, approvals, and broadcasts
✅ **Mobile Responsive** - Works seamlessly on all devices
✅ **Dark Mode UI** - Modern glassmorphism design

---

## 💻 System Requirements

- **Node.js** v16+ ([Download](https://nodejs.org/))
- **MongoDB** v5+ ([Download](https://www.mongodb.com/try/download/community))
- **npm** or **yarn** package manager
- **Git** for version control

### Recommended

- 4GB+ RAM
- 1GB+ disk space
- Modern web browser (Chrome, Firefox, Edge)

---

## 🔧 Backend Setup

### Step 1: Install Node.js

```bash
# Verify Node.js installation
node --version    # v16.0.0+
npm --version     # 8.0.0+
```

### Step 2: Navigate to Server Directory

```bash
cd server
```

### Step 3: Install Dependencies

```bash
npm install
```

This installs all required packages:
- express - Web framework
- mongoose - MongoDB ORM
- jsonwebtoken - JWT authentication
- bcryptjs - Password hashing
- cors - Cross-origin requests
- dotenv - Environment variables
- helmet - Security middleware
- express-rate-limit - Rate limiting

### Step 4: Create Environment File

```bash
# Copy example to .env
cp .env.example .env
```

**Edit `.env` file:**

```env
# Server Configuration
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000

# Database
MONGODB_URI=mongodb://localhost:27017/tradex

# JWT
JWT_SECRET=tradex_super_secret_key_change_in_production_2025

# Optional: External APIs
BINANCE_API_KEY=your_key_here
BINANCE_API_SECRET=your_secret_here
```

### Step 5: Start MongoDB

**Windows:**
```bash
# If installed via installer, MongoDB starts automatically
# Or start manually:
mongod
```

**Mac:**
```bash
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongod
```

### Step 6: Run Backend Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

**Expected Output:**
```
╔════════════════════════════════════════╗
║     🚀 TRADEX BACKEND RUNNING 🚀      ║
╚════════════════════════════════════════╝
  
  ✅ Server running on port 5000
  🔧 Environment: development
  🌐 URL: http://localhost:5000
```

---

## ⚛️ Frontend Setup

### Step 1: Navigate to Client Directory

```bash
cd client
```

### Step 2: Install Dependencies

```bash
npm install
```

**Key Dependencies:**
- react - UI framework
- react-router-dom - Routing
- tailwindcss - CSS framework
- lucide-react - Icons
- framer-motion - Animations

### Step 3: Create Environment File

```bash
cp .env.example .env
```

**Edit `.env`:**
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### Step 4: Start Frontend Development Server

```bash
npm start
```

**Expected Output:**
```
Compiled successfully!

You can now view tradex in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.1.x:3000
```

The app will automatically open in your browser at `http://localhost:3000`

---

## 🗄️ Database Setup

### MongoDB Installation

#### Windows
1. Download installer from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Run the installer
3. MongoDB will start automatically as a service

#### Mac
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

#### Linux (Ubuntu)
```bash
sudo apt-get install -y mongodb
sudo systemctl start mongodb
```

### Verify MongoDB Connection

```bash
# Open MongoDB shell
mongosh

# Check databases
show databases

# Switch to TRADEX database
use tradex

# View collections
show collections
```

### Initialize Database with Sample Data

```bash
# From server directory
npm run seed
```

---

## 🎮 Running the Application

### Terminal 1 - Start Backend

```bash
cd server
npm run dev
```

Wait for: `✅ Server running on port 5000`

### Terminal 2 - Start Frontend

```bash
cd client
npm start
```

Wait for browser to open at `http://localhost:3000`

### Access the Application

1. **Register New Account:**
   - Go to http://localhost:3000/register
   - Fill in your details
   - Create account

2. **Login:**
   - Go to http://localhost:3000/login
   - Use your credentials

3. **Demo Credentials:**
   ```
   Email: demo@tradex.com
   Password: demo123
   ```

---

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

**POST /auth/register** - Create new account
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "confirmPassword": "SecurePass123"
}
```

**POST /auth/login** - Login user
```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

Response:
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "balance": 0
  }
}
```

### Trading Endpoints

**POST /trades** - Place a trade
```json
{
  "symbol": "BTC/USD",
  "type": "buy",
  "quantity": 0.5,
  "entryPrice": 45000,
  "leverage": 1,
  "stopLoss": 44000,
  "takeProfit": 50000
}
```

**GET /trades** - Get user trades
**GET /trades?status=open** - Get open trades

### Wallet Endpoints

**GET /wallets** - Get all wallets
**GET /wallets/BTC** - Get specific wallet
**POST /wallets** - Create new wallet

### Deposit/Withdrawal

**POST /deposits** - Create deposit
**GET /deposits** - Get deposits

**POST /withdrawals** - Create withdrawal
**GET /withdrawals** - Get withdrawals

### Markets

**GET /markets** - Get all market data
**GET /markets/BTC** - Get specific market

---

## 🌐 Deployment Guide

### Deployment on Heroku

#### Backend Deployment

1. **Install Heroku CLI**
   ```bash
   # Download from https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **Login to Heroku**
   ```bash
   heroku login
   ```

3. **Create Heroku App**
   ```bash
   cd server
   heroku create tradex-backend
   ```

4. **Add MongoDB Atlas URI**
   ```bash
   heroku config:set MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/tradex
   heroku config:set JWT_SECRET=your_secret_key
   ```

5. **Deploy**
   ```bash
   git push heroku main
   ```

#### Frontend Deployment

1. **Build Production**
   ```bash
   cd client
   npm run build
   ```

2. **Deploy to Vercel**
   ```bash
   npm install -g vercel
   vercel
   ```

3. **Set Environment Variables in Vercel:**
   ```
   REACT_APP_API_URL=https://tradex-backend.herokuapp.com/api
   ```

### Docker Deployment

**Dockerfile (Backend):**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["node", "server.js"]
```

**Build and Run:**
```bash
docker build -t tradex-backend .
docker run -p 5000:5000 tradex-backend
```

---

## 🐛 Troubleshooting

### Issue: MongoDB Connection Failed

```
Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Solution:**
```bash
# Start MongoDB
mongod

# Or check if already running
# Check running services (Windows)
# Mac: brew services list
```

### Issue: Port Already in Use

```
Error: listen EADDRINUSE :::5000
```

**Solution:**
```bash
# Kill process on port 5000
# Windows
netstat -ano | findstr :5000
taskkill /PID {PID} /F

# Mac/Linux
lsof -i :5000
kill -9 {PID}

# Or change port in .env
PORT=5001
```

### Issue: CORS Error

```
Access to XMLHttpRequest blocked by CORS policy
```

**Solution:** Verify in `.env`:
```env
CLIENT_URL=http://localhost:3000
```

### Issue: npm install fails

```bash
# Clear cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Issue: React won't start

```bash
# Check if port 3000 is in use
# Kill the process and restart
npm start
```

---

## 📁 Project Structure

```
tradex/
├── server/
│   ├── config/           # Configuration files
│   ├── models/           # MongoDB schemas
│   ├── routes/           # API endpoints
│   ├── server.js         # Main server file
│   ├── package.json
│   └── .env
│
├── client/
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── contexts/     # React Context
│   │   ├── services/     # API services
│   │   ├── App.js        # Main app
│   │   └── index.js
│   ├── public/
│   ├── package.json
│   └── tailwind.config.js
│
└── README.md
```

---

## 🔐 Security Best Practices

1. **Environment Variables**
   - Never commit `.env` to git
   - Use strong JWT_SECRET in production
   - Store API keys securely

2. **Database**
   - Use MongoDB Atlas for production
   - Enable authentication
   - Regular backups

3. **Frontend**
   - Enable HTTPS in production
   - Use secure cookies
   - Validate user input

4. **Backend**
   - Rate limiting enabled
   - CORS properly configured
   - Input validation on all endpoints

---

## 📞 Support

For issues or questions:

1. **Check Logs** - Review error messages in terminal
2. **GitHub Issues** - Report bugs on GitHub
3. **Documentation** - Review API docs above
4. **Email** - Contact support@tradex.com

---

## 📄 License

MIT License - See LICENSE file for details

---

## 🎉 You're All Set!

Your TRADEX application is now running!

**Next Steps:**
- ✅ Register an account
- ✅ Explore the dashboard
- ✅ Place your first trade
- ✅ Deposit funds
- ✅ Check out markets

**Happy Trading! 🚀**
