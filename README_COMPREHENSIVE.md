# 🚀 TRADEX - Premium Cryptocurrency Trading Platform

![TRADEX](https://img.shields.io/badge/TRADEX-v1.0.0-cyan?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.2-blue?style=for-the-badge)
![Node.js](https://img.shields.io/badge/Node.js-16%2B-green?style=for-the-badge)
![MongoDB](https://img.shields.io/badge/MongoDB-5%2B-green?style=for-the-badge)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.2-06B6D4?style=for-the-badge)

A **production-ready**, **full-stack cryptocurrency trading platform** with modern UI, real-time trading, wallet management, and comprehensive admin dashboard.

## 🌟 Features

### 📊 Trading
- ✅ **Live Trading System** - Buy/Sell crypto with market/limit orders
- ✅ **Trade Management** - Stop-loss, take-profit, leverage options
- ✅ **Trading History** - Complete trade history with P/L calculations
- ✅ **Real-time Charts** - Candlestick charts with multiple timeframes
- ✅ **Open Positions** - Monitor active trades with live updates

### 💰 Wallets & Funds
- ✅ **Multi-Currency Wallets** - BTC, ETH, USDT, BNB, XRP, and more
- ✅ **Smart Deposit System** - Crypto, bank transfer, card payments
- ✅ **Withdrawal Management** - Admin approval system with KYC verification
- ✅ **Balance Tracking** - Real-time wallet updates and synchronization
- ✅ **Transaction History** - Complete deposit/withdrawal audit trail

### 👤 Authentication & Security
- ✅ **JWT Authentication** - Secure token-based authentication
- ✅ **Password Hashing** - BCrypt encryption for passwords
- ✅ **Two-Factor Authentication** - Enhanced account security
- ✅ **Email Verification** - Email-based account confirmation
- ✅ **Session Management** - Secure session handling

### 📈 Markets & Analytics
- ✅ **Real-time Market Data** - Live crypto and forex prices
- ✅ **Market Overview** - Top gainers, losers, trending coins
- ✅ **Market Heatmap** - Visual market performance
- ✅ **Search & Filters** - Advanced market search functionality
- ✅ **Watchlist** - Save favorite coins for quick access

### 👥 User Management
- ✅ **User Profiles** - Comprehensive profile management
- ✅ **KYC Verification** - Document upload and verification
- ✅ **Referral System** - Invite friends and earn commissions
- ✅ **VIP Tiers** - Bronze, Silver, Gold, Platinum levels
- ✅ **Notification Settings** - Customizable alerts

### 🎛️ Admin Panel
- ✅ **User Management** - View, approve, suspend users
- ✅ **Deposit Approvals** - Review and approve pending deposits
- ✅ **Withdrawal Reviews** - Manage withdrawal requests
- ✅ **Broadcast System** - Send notifications to all users
- ✅ **Analytics Dashboard** - Revenue, user, and trading statistics
- ✅ **Audit Logs** - Complete admin action history

### 🎨 UI/UX
- ✅ **Dark Mode Interface** - Premium dark theme
- ✅ **Glassmorphism Design** - Modern glass-effect cards
- ✅ **Responsive Layout** - Mobile, tablet, desktop support
- ✅ **Smooth Animations** - Framer Motion animations
- ✅ **Real-time Updates** - Live data refreshing

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **TailwindCSS 3** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **React Router** - Client-side routing
- **Lucide React** - Icon library
- **Chart.js** - Real-time charts

### Backend
- **Node.js 16+** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **JWT** - Authentication
- **BCryptjs** - Password hashing
- **Mongoose** - ODM

### DevOps
- **Docker** - Containerization
- **Heroku** - Deployment
- **MongoDB Atlas** - Cloud database
- **Vercel** - Frontend hosting

## 📦 Installation

### Prerequisites
- Node.js v16+ ([Download](https://nodejs.org/))
- MongoDB v5+ ([Download](https://www.mongodb.com/try/download/community))
- npm or yarn

### Quick Start

```bash
# 1. Clone repository
git clone https://github.com/yourusername/tradex.git
cd tradex

# 2. Install Backend Dependencies
cd server
npm install

# 3. Create Backend .env
cp .env.example .env
# Edit .env with your configuration

# 4. Start MongoDB
mongod

# 5. Start Backend Server
npm run dev

# 6. In new terminal, Install Frontend Dependencies
cd client
npm install

# 7. Create Frontend .env
cp .env.example .env

# 8. Start Frontend
npm start
```

### Expected URLs
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **MongoDB**: mongodb://localhost:27017/tradex

## 📁 Project Structure

```
tradex/
├── server/
│   ├── config/
│   │   ├── auth.js          # JWT authentication
│   │   └── database.js      # MongoDB connection
│   ├── models/
│   │   ├── User.js
│   │   ├── Wallet.js
│   │   ├── Trade.js
│   │   ├── Deposit.js
│   │   ├── Withdrawal.js
│   │   └── ...
│   ├── routes/
│   │   ├── auth.js          # Authentication
│   │   ├── trades.js        # Trading endpoints
│   │   ├── wallets.js       # Wallet management
│   │   ├── deposits.js      # Deposit handling
│   │   ├── withdrawals.js   # Withdrawal handling
│   │   ├── transfers.js     # P2P transfers
│   │   ├── markets.js       # Market data
│   │   ├── notifications.js # Notifications
│   │   └── admin.js         # Admin panel
│   ├── server.js            # Main server file
│   └── package.json
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.js
│   │   │   └── ...
│   │   ├── pages/
│   │   │   ├── LoginPage.js
│   │   │   ├── RegisterPage.js
│   │   │   ├── Dashboard.js
│   │   │   ├── TradingPage.js
│   │   │   ├── WalletPage.js
│   │   │   ├── MarketsPage.js
│   │   │   ├── HistoryPage.js
│   │   │   ├── ProfilePage.js
│   │   │   └── ...
│   │   ├── contexts/
│   │   │   ├── AuthContext.js
│   │   │   └── TradingContext.js
│   │   ├── services/
│   │   │   └── api.js       # API client
│   │   ├── App.js
│   │   └── index.js
│   ├── public/
│   ├── tailwind.config.js
│   └── package.json
│
├── COMPLETE_SETUP_GUIDE.md
└── README.md
```

## 🔌 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication

**Register**
```http
POST /auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "confirmPassword": "SecurePass123"
}
```

**Login**
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "firstName": "John",
    "email": "john@example.com",
    "balance": 0
  }
}
```

### Trading

**Place Trade**
```http
POST /trades
Authorization: Bearer {token}
Content-Type: application/json

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

**Get Trades**
```http
GET /trades
GET /trades?status=open
Authorization: Bearer {token}
```

### Wallets

**Get All Wallets**
```http
GET /wallets
Authorization: Bearer {token}
```

**Get Specific Wallet**
```http
GET /wallets/BTC
Authorization: Bearer {token}
```

### Deposits

**Create Deposit**
```http
POST /deposits
Authorization: Bearer {token}
Content-Type: application/json

{
  "currency": "BTC",
  "amount": 0.5,
  "method": "crypto",
  "depositAddress": "1A1z7agoat..."
}
```

**Get Deposits**
```http
GET /deposits
Authorization: Bearer {token}
```

### More API endpoints available in [COMPLETE_SETUP_GUIDE.md](./COMPLETE_SETUP_GUIDE.md)

## 🎮 Usage

### Register & Login
1. Go to http://localhost:3000/register
2. Create an account with your details
3. Login with your credentials

### Trading
1. Navigate to Trading page
2. Click "New Trade"
3. Select symbol, type, quantity, and price
4. Set leverage and stop-loss/take-profit
5. Click "Place Trade"
6. Monitor open trades from dashboard

### Deposits
1. Go to Wallet page
2. Click "Deposit"
3. Select currency and amount
4. Choose deposit method (Crypto/Bank)
5. Complete payment
6. Admin approves deposit

### Markets
1. Navigate to Markets page
2. View live cryptocurrency and forex data
3. Search for specific coins
4. Add to watchlist (star icon)

## 🔐 Security

- ✅ JWT Token-based authentication
- ✅ Password hashing with BCrypt
- ✅ Rate limiting on API endpoints
- ✅ CORS protection
- ✅ Environment variables for secrets
- ✅ MongoDB connection security
- ✅ HTTPS-ready configuration

## 📊 Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  firstName: String,
  lastName: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  country: String,
  balance: Number,
  verified: Boolean,
  kycVerified: Boolean,
  referralCode: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Wallets Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  currency: String,
  balance: Number,
  address: String,
  totalDeposited: Number,
  totalWithdrawn: Number
}
```

### Trades Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  symbol: String,
  type: 'buy' | 'sell',
  quantity: Number,
  entryPrice: Number,
  exitPrice: Number,
  status: 'open' | 'closed',
  profitLoss: Number,
  createdAt: Date
}
```

## 🚀 Deployment

### Deploy Backend to Heroku

```bash
cd server
heroku create tradex-backend
heroku config:set MONGODB_URI=<your_mongo_uri>
heroku config:set JWT_SECRET=<your_secret>
git push heroku main
```

### Deploy Frontend to Vercel

```bash
cd client
vercel
# Set REACT_APP_API_URL to your backend URL
```

## 📝 Environment Variables

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
MONGODB_URI=mongodb://localhost:27017/tradex
JWT_SECRET=your_secret_key_here
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 🐛 Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Start MongoDB with `mongod`

### Port Already in Use
```
Error: listen EADDRINUSE :::5000
```
**Solution**: Change PORT in .env or kill the process

### CORS Error
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution**: Verify CLIENT_URL in backend .env

## 📚 Documentation

- [Complete Setup Guide](./COMPLETE_SETUP_GUIDE.md) - Detailed installation and deployment
- [API Documentation](./API_DOCS.md) - Complete API reference
- [User Guide](./USER_GUIDE.md) - How to use the platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

## 👤 Author

**TRADEX Development Team**
- Website: [tradex.com](https://tradex.com)
- Email: support@tradex.com
- GitHub: [@tradex-dev](https://github.com/tradex-dev)

## 🙏 Acknowledgments

- React and React Router communities
- TailwindCSS for the amazing CSS framework
- MongoDB for reliable database
- All contributors and users

## 📞 Support

For support, email support@tradex.com or create an issue in the GitHub repository.

---

**Made with ❤️ by TRADEX Team**

⭐ **Star us on GitHub to show your support!**
