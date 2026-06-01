# TRADEX Platform Deployment Guide

## ✅ Current Status

- **Frontend**: ✅ Deployed to Netlify  
  - URL: https://cosmic-douhua-2c1133.netlify.app  
  - Status: Live and accessible

- **Backend**: 🔄 Ready for deployment  
  - Service: `tradex-api`  
  - Status: Tested locally and working  
  - Health endpoint: `http://localhost:5000/api/health` (returns 200 OK)

## 📋 Prerequisites

You'll need:
- GitHub account with access to the Rankingziko/tradex-platform repository
- One of: Railway.app, Render.com, Heroku, or DigitalOcean account
- (Optional) Docker for local testing

## 🚀 Deployment Options

### Option 1: Railway.app (Recommended - No Credit Card Required)

Railway is the easiest option and doesn't require credit card verification for the free tier.

#### Steps:

1. **Log in to Railway**
   - Go to https://railway.app/login
   - Click "Continue with GitHub"
   - Authenticate with your GitHub account
   - Accept the authorization

2. **Create a New Project**
   - Click "Create a new project"
   - Select "Deploy from GitHub repo"
   - Select `Rankingziko/tradex-platform`

3. **Configure the Service**
   - Root directory: `server`
   - Deployment branch: `main`

4. **Add Environment Variables**
   - Click "Add variable" and enter each:
     - `PORT`: `5000`
     - `NODE_ENV`: `production`
     - `CLIENT_URL`: (your Netlify frontend URL)
     - `USE_FILE_DB`: `true`
     - `JWT_SECRET`: `tradex_super_secret_key_change_in_production_2025`
     - `EMAIL_HOST`: `smtp.gmail.com`
     - `EMAIL_PORT`: `587`
     - `EMAIL_USER`: (your Gmail)
     - `EMAIL_PASS`: (your app-specific password)
     - `BINANCE_API_KEY`: (your Binance key)
     - `BINANCE_API_SECRET`: (your Binance secret)
     - `MAX_FILE_SIZE`: `5000000`
     - `UPLOAD_PATH`: `./uploads`
     - `RATE_LIMIT_WINDOW_MS`: `900000`
     - `RATE_LIMIT_MAX_REQUESTS`: `100`

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (2-5 minutes)
   - Railway will provide a URL like: `https://tradex-api-<random>.railway.app`

6. **Update Frontend**
   - Go to Netlify dashboard
   - Find your site settings
   - Update environment variable: `REACT_APP_API_URL=https://tradex-api-<random>.railway.app`
   - Trigger a redeploy

### Option 2: Render.com (Free Tier Available)

**Note**: Render requires credit card verification (no charge for free tier).

#### Steps:

1. Go to https://render.com
2. Sign up/Log in with GitHub
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Fill in:
   - Name: `tradex-api`
   - Root directory: `server`
   - Build command: `npm install`
   - Start command: `npm start`
6. Add environment variables from [server/.env](./server/.env)
7. Click "Deploy Web Service"

### Option 3: Heroku (Free Tier Deprecated - Paid Plans Only)

Heroku no longer offers a free tier but still available for paid deployments.

### Option 4: DigitalOcean App Platform

Requires a DigitalOcean account and credit card.

## 🐳 Docker Deployment (Local Testing)

### Build Docker Image

```bash
cd server
docker build -t tradex-api:latest .
```

### Run Docker Container

```bash
docker run -p 5000:5000 \
  -e NODE_ENV=production \
  -e JWT_SECRET=tradex_super_secret_key_change_in_production_2025 \
  -e USE_FILE_DB=true \
  tradex-api:latest
```

### Using Docker Compose

```bash
docker-compose up -d
```

This will start the backend on `http://localhost:5000`

## 📝 Environment Variables Reference

```env
# Server
PORT=5000                                    # Port to run on
NODE_ENV=production                          # Environment mode
CLIENT_URL=http://localhost:3000             # Frontend URL (for CORS)
USE_FILE_DB=true                             # Use file-based database

# Database
# MONGODB_URI=...                            # Optional: MongoDB Atlas URL

# Authentication
JWT_SECRET=tradex_super_secret_key...       # JWT signing secret

# Email (Optional)
EMAIL_HOST=smtp.gmail.com                   # Email provider
EMAIL_PORT=587                              # SMTP port
EMAIL_USER=your-email@gmail.com             # Your email
EMAIL_PASS=your-app-password                # Gmail app password

# External APIs
BINANCE_API_KEY=your_key                    # Binance API key
BINANCE_API_SECRET=your_secret              # Binance API secret

# File Upload
MAX_FILE_SIZE=5000000                       # Max file size in bytes (5MB)
UPLOAD_PATH=./uploads                       # Upload directory

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000                 # Rate limit window (15 minutes)
RATE_LIMIT_MAX_REQUESTS=100                 # Max requests per window
```

## ✅ Testing the Deployment

Once deployed, test the backend:

```bash
# Health check
curl https://your-backend-url/api/health

# Should return:
# {"status":"OK","timestamp":"...","uptime":...}
```

## 🔗 Connecting Frontend to Backend

After backend is deployed, update the frontend environment variable:

1. Go to Netlify Dashboard
2. Select your site
3. Go to Settings → Build & deploy → Environment
4. Set `REACT_APP_API_URL` to your backend URL
5. Trigger a redeploy

## 🆘 Troubleshooting

### Backend won't start
- Check environment variables are set correctly
- Verify `NODE_ENV=production`
- Check logs for specific errors

### Frontend can't connect to backend
- Verify backend URL in `REACT_APP_API_URL`
- Check CORS is configured properly
- Ensure backend is running and accessible

### Database connection errors
- If using file-based DB: Create `uploads` directory
- If using MongoDB: Ensure `MONGODB_URI` is set correctly

## 📞 Support

- Railway: https://docs.railway.app
- Render: https://render.com/docs
- API health endpoint: `GET /api/health`
- Server logs: Check deployment platform dashboard

## 🎉 Success Checklist

- [ ] Backend deployed to Railway/Render/Other
- [ ] Backend URL obtained (e.g., `https://tradex-api-xxxxx.railway.app`)
- [ ] Environment variables configured on platform
- [ ] Frontend `REACT_APP_API_URL` updated in Netlify
- [ ] Frontend redeployed
- [ ] Health endpoint responds with 200 OK
- [ ] Frontend and backend can communicate
- [ ] Login/Signup workflows tested end-to-end
- [ ] Trading features working
