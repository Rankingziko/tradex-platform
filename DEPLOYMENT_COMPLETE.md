# 🚀 TRADEX Backend Deployment - Complete Guide

## ✅ STATUS: READY TO DEPLOY

Your backend is **fully prepared** and all configuration files are committed to GitHub.

---

## 📋 QUICK DEPLOYMENT OPTIONS

Choose ONE of the following deployment methods. Each takes 5-15 minutes.

---

## ✨ **OPTION 1: RENDER (RECOMMENDED)**

**Why:** Easiest, auto-detects configuration, excellent free tier

**Time:** 5-10 minutes

### Steps:

1. Go to: https://dashboard.render.com/new/web-service
2. Click **"Connect GitHub"** (authorize if needed)
3. Search for and select: **`Rankingziko/tradex-platform`**
4. Configure:
   - **Name:** `tradex-api`
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `node index.js`
   - **Instance Type:** Free
5. Click **"Create Environment Variables"** and add these 15:
   ```
   PORT=5000
   NODE_ENV=production
   CLIENT_URL=https://cosmic-douhua-2c1133.netlify.app
   USE_FILE_DB=true
   JWT_SECRET=tradex_super_secret_key_change_in_production_2025
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   BINANCE_API_KEY=your_binance_api_key
   BINANCE_API_SECRET=your_binance_api_secret
   MAX_FILE_SIZE=5000000
   UPLOAD_PATH=./uploads
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   ```
6. Click **"Deploy"**
7. Wait 2-5 minutes for build and deployment
8. Your URL will be: `https://tradex-api-xxxx.onrender.com`

---

## 🚂 **OPTION 2: RAILWAY.APP (FREE TIER)**

**Why:** Genuinely free, no credit card required, clean UI

**Time:** 5-10 minutes

### Steps:

1. Go to: https://railway.app/new
2. Click **"Deploy with GitHub"**
3. Authorize GitHub and select **`tradex-platform`**
4. Railway auto-detects from `render.yaml`
5. Add environment variables (same 15 as Option 1)
6. Click **"Deploy"**
7. Your URL will appear in the dashboard

---

## 🔧 **OPTION 3: HEROKU (VIA CLI)**

**Why:** Command-line based, no complex UI

**Time:** 10-15 minutes

### Prerequisites:
```bash
# Check if Heroku CLI is installed
heroku --version

# If not installed:
npm install -g heroku
```

### Steps:

```bash
# 1. Login to Heroku (opens browser)
heroku login

# 2. Create new app
heroku create tradex-api

# 3. Push code (builds and deploys automatically)
git push heroku main

# 4. Set environment variables
heroku config:set PORT=5000
heroku config:set NODE_ENV=production
heroku config:set CLIENT_URL=https://cosmic-douhua-2c1133.netlify.app
heroku config:set USE_FILE_DB=true
heroku config:set JWT_SECRET=tradex_super_secret_key_change_in_production_2025
heroku config:set EMAIL_HOST=smtp.gmail.com
heroku config:set EMAIL_PORT=587
heroku config:set EMAIL_USER=your-email@gmail.com
heroku config:set EMAIL_PASS=your-app-password
heroku config:set BINANCE_API_KEY=your_binance_api_key
heroku config:set BINANCE_API_SECRET=your_binance_api_secret
heroku config:set MAX_FILE_SIZE=5000000
heroku config:set UPLOAD_PATH=./uploads
heroku config:set RATE_LIMIT_WINDOW_MS=900000
heroku config:set RATE_LIMIT_MAX_REQUESTS=100

# 5. Watch logs
heroku logs --tail
```

**Your URL:** `https://tradex-api.herokuapp.com`

---

## 🪜 **OPTION 4: FLY.IO (MODERN)**

**Why:** Modern platform, good free tier, reliable

**Time:** 10-15 minutes

### Prerequisites:

```bash
# Install Fly CLI
curl -L https://fly.io/install.sh | sh

# Or via npm:
npm install -g @fly/cli
```

### Steps:

```bash
# 1. Authenticate
fly auth signup

# 2. Launch app (in project root)
fly launch

# 3. When prompted:
#    - App name: tradex-api
#    - Select region: closest to you
#    - Deploy now: yes

# 4. Set secrets (environment variables)
fly secrets set PORT=5000
fly secrets set NODE_ENV=production
fly secrets set CLIENT_URL=https://cosmic-douhua-2c1133.netlify.app
fly secrets set USE_FILE_DB=true
fly secrets set JWT_SECRET=tradex_super_secret_key_change_in_production_2025
# ... (add all 15 variables)

# 5. Deploy
fly deploy

# 6. Monitor
fly logs
```

**Your URL:** `https://tradex-api.fly.dev`

---

## ☁️ **OPTION 5: DIGITALOCEAN APP PLATFORM**

**Why:** $5/month tier, scalable, professional

**Time:** 15-20 minutes

### Steps:

1. Go to: https://cloud.digitalocean.com/apps
2. Click **"Create App"**
3. Select **"GitHub"** repository source
4. Authorize GitHub and select **`tradex-platform`**
5. Configure:
   - **Name:** `tradex-api`
   - **Source directory:** `server`
   - **Build command:** `npm install`
   - **Run command:** `npm start`
6. Add 15 environment variables (same as Option 1)
7. Select **"Basic" ($5/month)** plan
8. Review and **"Launch App"**

---

## 📍 AFTER DEPLOYMENT

Once you have your backend URL (from any option above):

### 1. Get Your Backend URL
- From Render/Railway/Heroku dashboard
- Format: `https://your-backend-url.com`

### 2. Test Backend Health
```bash
curl https://your-backend-url.com/api/health
```

Should return:
```json
{
  "status": "OK",
  "timestamp": "2026-06-01T13:00:00.000Z",
  "uptime": 123456789
}
```

### 3. Update Frontend
1. Go to: https://app.netlify.com
2. Select site: **cosmic-douhua-2c1133**
3. Go to: **Site settings** → **Build & deploy** → **Environment**
4. Add/Update variable:
   ```
   REACT_APP_API_URL = https://your-backend-url.com
   ```
5. Go to: **Deploys** → Click **"Trigger deploy"** → **Deploy site**
6. Wait for build to complete

### 4. Test End-to-End
1. Open: https://cosmic-douhua-2c1133.netlify.app
2. Open DevTools (F12) → Network tab
3. Try Sign Up with test account:
   - Email: `test@example.com`
   - Password: `Test123!`
4. Verify API calls go to your NEW backend (not localhost)
5. Complete flow: Sign Up → Log In → Dashboard

---

## 🔍 TROUBLESHOOTING

### Issue: "Cannot find module" during deployment
**Solution:** Make sure you selected the correct **Root Directory** (`server`)

### Issue: 504 Gateway Timeout
**Solution:** Wait 5 minutes, backend is still building. Refresh page.

### Issue: CORS errors in browser console
**Solution:** Your REACT_APP_API_URL is incorrect. Update Netlify with correct backend URL and redeploy.

### Issue: "Cannot POST /api/signup"
**Solution:** Backend didn't start correctly. Check:
1. All 15 environment variables are set
2. PORT is set to 5000
3. NODE_ENV is set to production
4. Check deployment logs for errors

---

## 📚 IMPORTANT FILES

- **API_REFERENCE.md** - Full API endpoint documentation
- **server/index.js** - Backend source code
- **server/package.json** - Dependencies
- **render.yaml** - Render configuration (auto-detected)
- **vercel.json** - Vercel configuration
- **docker-compose.yml** - Local testing with Docker

---

## 🎯 DEPLOYMENT CHECKLIST

- [ ] Choose ONE deployment platform above
- [ ] Complete deployment steps for that platform
- [ ] Copy backend URL
- [ ] Test `/api/health` endpoint
- [ ] Update Netlify REACT_APP_API_URL
- [ ] Trigger Netlify redeploy
- [ ] Test Sign Up → Log In → Dashboard flow
- [ ] Verify API calls in Network tab go to NEW URL (not localhost)

---

## ⚡ QUICK LINKS

- **Frontend:** https://cosmic-douhua-2c1133.netlify.app
- **GitHub Repo:** https://github.com/Rankingziko/tradex-platform
- **Render Dashboard:** https://dashboard.render.com
- **Railway Dashboard:** https://railway.app
- **Heroku Dashboard:** https://dashboard.heroku.com
- **Fly.io Dashboard:** https://fly.io
- **DigitalOcean Dashboard:** https://cloud.digitalocean.com
- **Netlify Site:** https://app.netlify.com

---

## 💬 SUPPORT

If deployment fails at any step:
1. Check the platform's deployment logs for error messages
2. Verify all 15 environment variables are set correctly
3. Ensure root directory is set to `server`
4. Check that build command is `npm install`
5. Check that start command is `node index.js`

---

**Your backend is ready! Choose any option above and get deployed in the next 15 minutes! 🚀**
