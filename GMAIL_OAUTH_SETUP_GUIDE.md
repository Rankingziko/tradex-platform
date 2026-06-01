# 🔐 Gmail OAuth Setup Guide for TRADEX

This guide explains how to set up Google OAuth 2.0 authentication so users can sign in with their Gmail accounts.

## Current Status

✅ **Backend**: OAuth infrastructure fully implemented
✅ **Frontend**: Gmail Sign-In button added to login page
✅ **Database**: Optimized with caching to eliminate timeout errors
✅ **Demo Login**: Working perfectly (demo@tradex.com / demo123)
⏳ **Next Step**: Configure Google OAuth credentials

---

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **"Select a Project"** at the top
3. Click **"NEW PROJECT"**
4. Enter project name: `TRADEX`
5. Click **CREATE**
6. Wait for project creation (may take a few seconds)
7. Select the new project from the dropdown

---

## Step 2: Enable Google+ API

1. In the Cloud Console, search for **"Google+ API"**
2. Click on **"Google+ API"** from the results
3. Click **"ENABLE"**
4. Wait for enablement to complete

---

## Step 3: Create OAuth 2.0 Credentials

1. In the Cloud Console, go to **"Credentials"** (left sidebar)
2. Click **"CREATE CREDENTIALS"** → **"OAuth client ID"**
3. If prompted, click **"CONFIGURE CONSENT SCREEN"** first:
   - Select **"External"** user type
   - Click **"CREATE"**
   - Fill in:
     - **App name**: `TRADEX`
     - **User support email**: Your email
     - **Developer contact**: Your email
   - Click **"SAVE AND CONTINUE"**
   - Skip scopes (click **"SAVE AND CONTINUE"**)
   - Click **"SAVE AND CONTINUE"** again
   - Click **"BACK TO DASHBOARD"**

4. Now create OAuth client ID:
   - Click **"CREATE CREDENTIALS"** → **"OAuth client ID"**
   - Select **"Web application"**
   - Name: `TRADEX Web`
   - Under **"Authorized redirect URIs"**, add BOTH:
     - `http://localhost:5000/api/auth/google/callback` (for local testing)
     - `https://elusive-poison-generic.ngrok-free.dev/api/auth/google/callback` (for public testing)
   - Click **"CREATE"**
   - A popup will show your credentials - **COPY THESE**

---

## Step 4: Configure Environment Variables

1. Open `server/.env` in the workspace
2. Find these lines:
   ```
   GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
   ```

3. Replace with your credentials from Google Cloud:
   - `GOOGLE_CLIENT_ID`: Paste the Client ID from Google
   - `GOOGLE_CLIENT_SECRET`: Paste the Client Secret from Google
   - `GOOGLE_CALLBACK_URL`: Keep as is for local testing (or update to ngrok URL below)

4. Save the file

---

## Step 5: Update Callback URL (Optional - for ngrok testing)

If you want to test Gmail login via the ngrok public URL:

1. Go back to Google Cloud Console → **Credentials**
2. Click on your OAuth 2.0 client ID
3. Under "Authorized redirect URIs", add the current ngrok URL:
   - `https://elusive-poison-generic.ngrok-free.dev/api/auth/google/callback`
   - ⚠️ **Note**: ngrok URLs change. When ngrok URL expires, update both:
     - Google Cloud credentials
     - `GOOGLE_CALLBACK_URL` in `server/.env`

---

## Step 6: Restart Backend Server

After updating `.env`, restart the backend:

```bash
cd server
npm start
```

Watch for this output confirming OAuth is ready:
```
✅ Server running on port 5000
✅ OAuth 2.0 configured and ready
```

---

## Step 7: Test Gmail Login

1. Open https://elusive-poison-generic.ngrok-free.dev/login
2. Click **"Sign in with Gmail"** button
3. Sign in with your Gmail account
4. Accept the permission prompt
5. You should be redirected to the dashboard
6. A new user should be created with:
   - Email: Your Gmail address
   - Default wallets: BTC, ETH, USDT, BNB, XRP, USD (auto-created)
   - Account balance: $5000 (initial credit)

---

## Troubleshooting

### Error: "Redirect URI mismatch"
- **Cause**: Callback URL in Google Cloud doesn't match backend
- **Fix**: Make sure the exact URL is in Google Cloud credentials

### Error: "Invalid client_id"
- **Cause**: `GOOGLE_CLIENT_ID` is incorrect in `.env`
- **Fix**: Double-check the value matches Google Cloud

### Gmail button does nothing
- **Cause**: Backend not running or `.env` not updated
- **Fix**: Restart backend with `npm start`

### New user not created
- **Cause**: Database permissions or file system issue
- **Fix**: Check `server/data/` folder exists and is writable

---

## Security Notes

⚠️ **Important for Production**:
1. Never commit `.env` to GitHub (use `.env.example` instead)
2. Store secrets in environment variables on production server
3. Use HTTPS for all URLs (not just localhost)
4. Keep `SESSION_SECRET` and `JWT_SECRET` unique and strong
5. Regularly rotate Google OAuth credentials

---

## Current Implementation Details

### Backend OAuth Flow
1. User clicks "Sign in with Gmail"
2. Redirects to `/api/auth/google` (Passport initiates)
3. User logs in with Google
4. Google redirects to `/api/auth/google/callback`
5. Passport verifies and creates/updates user
6. Backend generates JWT token
7. Frontend stores token and redirects to dashboard

### Database Architecture
- **File-based JSON storage**: `server/data/users.json`
- **Auto-verification**: OAuth users auto-verified (no email confirmation needed)
- **Auto-wallet creation**: Each user gets 6 default wallets
- **In-memory caching**: 5-second TTL prevents database timeout errors

### User Data Structure
```json
{
  "id": "unique-user-id",
  "email": "user@gmail.com",
  "googleId": "google-unique-id",
  "name": "User Name",
  "isVerified": true,
  "wallets": [
    { "symbol": "BTC", "address": "...", "balance": 0 },
    { "symbol": "ETH", "address": "...", "balance": 0 },
    { "symbol": "USDT", "address": "...", "balance": 0 },
    { "symbol": "BNB", "address": "...", "balance": 0 },
    { "symbol": "XRP", "address": "...", "balance": 0 },
    { "symbol": "USD", "address": "USD_WALLET", "balance": 5000 }
  ],
  "createdAt": "2026-06-01T00:00:00Z",
  "lastLogin": "2026-06-01T00:00:00Z"
}
```

---

## Next Steps After OAuth Setup

1. ✅ Configure Google OAuth (this guide)
2. ✅ Test Gmail login (verify user creation)
3. ✅ Test email/password login still works
4. ✅ Test wallet auto-creation
5. ✅ Verify no database timeout errors
6. Deploy to production (update ngrok URL when expires)

---

## File Locations

- **Backend OAuth config**: `server/config/google-oauth.js`
- **Auth routes**: `server/routes/auth.js`
- **Environment variables**: `server/.env`
- **Database module**: `server/config/file-database.js`
- **Frontend login page**: `client/src/pages/LoginPage.js`

---

**Questions?** Check the detailed logs:
- Backend: Terminal where `npm start` runs
- Frontend: Browser DevTools Console (F12)
- Database: `server/data/users.json` (user creation logs)
