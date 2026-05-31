# ⚡ TRADEX Quick Start Guide

Get your TRADEX trading platform running in **5 minutes**!

## 🚀 Quick Start (Windows/Mac/Linux)

### Step 1: Install Prerequisites (5 min)

Download and install:
- **Node.js 16+**: https://nodejs.org/
- **MongoDB**: https://www.mongodb.com/try/download/community

Verify installation:
```bash
node --version
npm --version
mongod --version
```

### Step 2: Start MongoDB (1 min)

**Windows**: MongoDB starts automatically after installation
**Mac/Linux**:
```bash
mongod
```

### Step 3: Start Backend (2 min)

```bash
cd server
npm install
npm run dev
```

Wait for:
```
✅ Server running on port 5000
✅ MongoDB connected
```

### Step 4: Start Frontend (2 min)

**In a NEW terminal:**
```bash
cd client
npm install
npm start
```

Browser will open at: **http://localhost:3000**

## ✅ That's It! You're Running TRADEX

### 🔑 Test Login

**Create New Account:**
- Go to Register page
- Fill in your details
- Create account

**Or Use Demo:**
- Email: `demo@tradex.com`
- Password: `demo123`

## 🎯 Next Steps

1. **Explore Dashboard** - View portfolio overview
2. **Check Markets** - Browse live crypto prices
3. **Make a Trade** - Buy/Sell simulation
4. **Test Deposits** - Try depositing funds
5. **View History** - Check transaction history

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| MongoDB not starting | Install MongoDB Community from official website |
| Port 5000 in use | Change PORT in `server/.env` |
| Port 3000 in use | Change in `client/.env` or use different port |
| `npm install` fails | Delete `node_modules` and `package-lock.json`, try again |

## 📁 Project Structure

```
tradex/
├── server/       ← Backend (Node.js + Express)
├── client/       ← Frontend (React)
└── README.md
```

## 🔗 Useful Links

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **API Health Check**: http://localhost:5000/api/health
- **MongoDB**: mongodb://localhost:27017/tradex

## 📚 Full Documentation

Read **COMPLETE_SETUP_GUIDE.md** for:
- ✅ Detailed installation steps
- ✅ API documentation
- ✅ Deployment guides
- ✅ Troubleshooting
- ✅ Security practices

## 🎉 Congratulations!

You're now running TRADEX - a production-ready crypto trading platform!

**Happy Trading! 🚀**
