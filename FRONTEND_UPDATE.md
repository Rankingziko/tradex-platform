# Frontend Configuration Update Guide

## Current Status

- **Frontend**: Deployed on Netlify  
  - URL: https://cosmic-douhua-2c1133.netlify.app  
  - Build directory: `frontend`  
  - Current API URL: `https://tradex-api.glitch.me` (DEPRECATED - Glitch is shutting down)

## ⚠️ Action Required: Update Backend API URL

After you deploy the backend to Railway/Render, you **MUST** update the frontend environment variable to point to the new backend URL.

### Step 1: Get Your Backend URL

After successful deployment on Railway/Render, you'll receive a URL like one of these:

**Railway**:
- `https://tradex-api-randomcode.railway.app`

**Render**:
- `https://tradex-api-randomcode.onrender.com`

### Step 2: Update on Netlify

1. Go to **Netlify Dashboard**
2. Select your site: `cosmic-douhua-2c1133`
3. Navigate to **Site settings** → **Build & deploy** → **Environment**
4. Look for the variable `REACT_APP_API_URL`
5. Click "Edit"
6. Change the value from `https://tradex-api.glitch.me` to your new backend URL
7. Click "Save"

### Step 3: Trigger Redeploy

1. Go to **Deployments** tab
2. Click **Trigger Deploy** → **Clear cache and redeploy**
3. Wait for the build to complete (usually 1-2 minutes)
4. Once complete, your frontend will be using the new backend URL

## 🔍 Verify the Update

1. Visit https://cosmic-douhua-2c1133.netlify.app
2. Open Developer Console (F12)
3. Go to the **Network** tab
4. Try logging in
5. Look for API requests going to your new backend URL (not localhost or Glitch)
6. Should see successful responses from your new backend

## 📋 Environment Variable Reference

The frontend uses this environment variable (defined in netlify.toml):

```toml
[build.environment]
  REACT_APP_API_URL = "YOUR_BACKEND_URL"
  NODE_ENV = "production"
```

This is automatically injected into the frontend code and used by the Axios client.

## 🆘 Common Issues

**Issue**: Frontend still trying to connect to `localhost:5000` or old Glitch URL

**Solution**:
- Clear browser cache (Ctrl+Shift+Delete)
- Hard refresh page (Ctrl+F5)
- Wait 5 minutes for Netlify CDN to clear
- Check that environment variable was saved in Netlify

**Issue**: API requests failing with CORS errors

**Solution**:
- Ensure `CLIENT_URL` is set correctly on the backend (should match frontend URL)
- Verify backend is running and accessible
- Check that backend CORS middleware includes your frontend URL

**Issue**: Backend URL looks correct but not connecting

**Solution**:
- Test backend URL directly: `https://your-backend-url/api/health`
- Should return `{"status":"OK"...}`
- If not, backend may still be deploying or errored

## 📝 Quick Checklist

- [ ] Backend deployed to Railway/Render
- [ ] Backend URL obtained
- [ ] Environment variable updated in Netlify
- [ ] Netlify redeployed with new cache
- [ ] Frontend loads without errors
- [ ] Can see API calls in Network tab going to correct URL
- [ ] Login functionality works with new backend
- [ ] Trading features work end-to-end
