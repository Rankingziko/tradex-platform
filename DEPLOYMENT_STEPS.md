# 🚀 TRADEX PLATFORM - COMPLETE DEPLOYMENT INSTRUCTIONS

**Date Created:** May 31, 2026  
**Status:** ✅ ALL FILES PREPARED AND READY TO DEPLOY  
**Estimated Time to Live:** 30 minutes

---

## 📋 PRE-DEPLOYMENT CHECKLIST

✅ **Backend Server**
- Location: `server/` directory
- Status: Tested locally and working (health endpoint returns 200 OK)
- Database: File-based (no MongoDB needed)
- Port: 5000

✅ **Frontend**
- Platform: Netlify
- URL: https://cosmic-douhua-2c1133.netlify.app
- Status: Currently live (needs API URL update after backend deployment)

✅ **GitHub Repository**
- URL: https://github.com/Rankingziko/tradex-platform
- Branch: main
- Files: All deployment configurations committed

✅ **Docker Configuration**
- Dockerfile: ✅ Created and tested
- docker-compose.yml: ✅ Complete
- .dockerignore: ✅ Optimized

✅ **Environment Variables**
- All 15 variables documented and ready
- See section "Environment Variables" below

---

## 🎯 STEP 1: DEPLOY BACKEND ON RENDER (5 minutes)

### Option A: Using Render Dashboard (RECOMMENDED)

1. **Go to Render Dashboard**
   - URL: https://dashboard.render.com/web/new
   - Ensure you're logged in with your Render account

2. **Select Repository Source**
   - Choose: "Public Git Repository" tab
   - Enter: `https://github.com/Rankingziko/tradex-platform`
   - Click: **"Connect"**

3. **Configure Service**
   - **Service Name:** `tradex-api`
   - **Root Directory:** `server`
   - **Branch:** `main`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free

4. **Add Environment Variables**
   
   Click "Add Environment Variable" for each:
   
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

5. **Deploy**
   - Click: **"Deploy Web Service"**
   - Wait: 2-5 minutes for build and deployment

6. **Get Your Backend URL**
   - Example: `https://tradex-api-xxxxx.onrender.com`
   - **⚠️ SAVE THIS URL** - You'll need it in the next step!

### Option B: Using Render CLI (Advanced)

```bash
# Install Render CLI
npm install -g @render-apps/render-cli

# Authenticate
render login

# Deploy
render deploy --repo Rankingziko/tradex-platform
```

---

## 🔄 STEP 2: UPDATE FRONTEND API URL (3 minutes)

Once your backend is deployed and you have the URL (e.g., `https://tradex-api-xxxxx.onrender.com`):

1. **Go to Netlify Dashboard**
   - URL: https://app.netlify.com
   - Select: `cosmic-douhua-2c1133`

2. **Update Environment Variables**
   - Navigate to: **Site settings** → **Build & deploy** → **Environment**
   - Find: `REACT_APP_API_URL`
   - Update FROM: `https://tradex-api.glitch.me`
   - Update TO: `https://tradex-api-xxxxx.onrender.com` (use YOUR URL)
   - Click: **"Save"**

3. **Trigger Rebuild**
   - Go to: **Deployments** tab
   - Find latest deployment
   - Click: **"Trigger deploy"** → **"Clear cache and redeploy"**
   - Wait: 1-2 minutes for frontend to rebuild

---

## ✅ STEP 3: TEST END-TO-END (5 minutes)

1. **Open Frontend**
   - URL: https://cosmic-douhua-2c1133.netlify.app

2. **Open DevTools**
   - Press: `F12` to open Developer Tools
   - Go to: **Network** tab

3. **Test Sign Up**
   - Click: "Sign Up"
   - Fill in test account:
     - Email: `test@example.com`
     - Password: `Test123!@#`
     - Confirm Password: `Test123!@#`
   - Click: "Sign Up"
   - Monitor Network tab - verify calls go to your **new Render URL** ✅

4. **Test Login**
   - Click: "Log In"
   - Email: `test@example.com`
   - Password: `Test123!@#`
   - Click: "Log In"
   - Verify: Dashboard loads successfully

5. **Test Features**
   - Navigate: Deposit section
   - Navigate: Trading/Market section
   - Verify: All API calls succeed (Network tab shows green 200s)

---

## 🔐 ENVIRONMENT VARIABLES REFERENCE

| Variable | Value | Purpose |
|----------|-------|---------|
| `PORT` | `5000` | Server port |
| `NODE_ENV` | `production` | Environment mode |
| `CLIENT_URL` | Frontend URL | CORS configuration |
| `USE_FILE_DB` | `true` | Enable file-based database |
| `JWT_SECRET` | Secret key | JWT token signing |
| `EMAIL_HOST` | `smtp.gmail.com` | Email server |
| `EMAIL_PORT` | `587` | Email port |
| `EMAIL_USER` | Your email | Email username |
| `EMAIL_PASS` | App password | Email password |
| `BINANCE_API_KEY` | Your key | Binance integration |
| `BINANCE_API_SECRET` | Your secret | Binance integration |
| `MAX_FILE_SIZE` | `5000000` | Max upload size (5MB) |
| `UPLOAD_PATH` | `./uploads` | Upload directory |
| `RATE_LIMIT_WINDOW_MS` | `900000` | Rate limit window (15 min) |
| `RATE_LIMIT_MAX_REQUESTS` | `100` | Max requests per window |

---

## 🎉 SUCCESS INDICATORS

✅ **Deployment Complete When:**
- [ ] Backend service shows "Live" on Render dashboard
- [ ] Frontend successfully loads at https://cosmic-douhua-2c1133.netlify.app
- [ ] Sign Up flow completes without 404 errors
- [ ] Network tab shows API calls to your Render URL (not localhost)
- [ ] Dashboard displays trading data

---

## 🐛 TROUBLESHOOTING

### Backend won't build
- Check: All files in `server/` directory
- Check: `package.json` has correct dependencies
- Check: No syntax errors in code
- Solution: View build logs in Render dashboard

### API calls still going to localhost
- Check: Frontend deployed on Netlify (check Deployments tab)
- Check: `REACT_APP_API_URL` environment variable is set correctly
- Check: Cleared browser cache (Ctrl+Shift+Delete)
- Solution: Trigger redeploy from Netlify

### CORS errors
- Check: `CLIENT_URL` environment variable on Render
- Should be: `https://cosmic-douhua-2c1133.netlify.app`
- Solution: Update env var and redeploy backend

### Sign Up fails
- Check: Backend health: `https://tradex-api-xxxxx.onrender.com/api/health`
- Should return: `{"status":"OK","timestamp":"...","uptime":...}`
- Check: All environment variables are set on Render

---

## 📚 DOCUMENTATION REFERENCES

For more detailed information, see:

- **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** - Complete 4-platform walkthrough
- **[DEPLOYMENT_READY.md](DEPLOYMENT_READY.md)** - Executive summary
- **[FRONTEND_UPDATE.md](FRONTEND_UPDATE.md)** - Frontend configuration
- **[API_REFERENCE.md](API_REFERENCE.md)** - All API endpoints
- **[API.md](API.md)** - Detailed API documentation

---

## ⏱️ TIMELINE

| Task | Time | Status |
|------|------|--------|
| Deploy backend on Render | 5 min | ⏳ Your turn |
| Update frontend API URL | 3 min | ⏳ Next |
| End-to-end testing | 5 min | ⏳ After deployment |
| **TOTAL** | **~30 min** | **🚀 Ready!** |

---

## 🎊 YOU'RE DONE!

Once all steps are complete, your TRADEX platform will be **LIVE AND PRODUCTION-READY!**

- **Frontend:** https://cosmic-douhua-2c1133.netlify.app
- **Backend:** https://tradex-api-[YOUR_ID].onrender.com
- **API Docs:** See API_REFERENCE.md

**Next steps after going live:**
1. Create admin accounts
2. Configure payment methods (Stripe, Binance)
3. Set up email notifications
4. Launch to first users

---

*Generated: May 31, 2026*  
*All deployment files prepared and ready*  
*Question? See DEPLOYMENT_GUIDE.md*
