# 🌍 TRADEX - SHARE WITH OTHERS VIA NGROK

**Quick Setup**: 3 minutes  
**Share Worldwide**: Yes  
**No Credit Card**: Yes (free tier available)  
**Live Access**: Immediate

---

## 🚀 QUICK START (3 STEPS)

### Step 1: Download ngrok
```bash
# Visit: https://ngrok.com/download
# Extract to: C:\ngrok
# OR use: choco install ngrok
```

### Step 2: Create free account
```bash
# Visit: https://ngrok.com/signup
# Email signup is free
# Get your auth token
```

### Step 3: Setup and share
```bash
# One-time setup
ngrok config add-authtoken YOUR_TOKEN_HERE

# Start sharing backend (Terminal 1)
ngrok http 5000 --region us

# Start sharing test page (Terminal 2)
ngrok http 8080 --region us

# Share the URLs shown in the terminals!
```

**Done! Others can now access your platform!** ✅

---

## 📋 DETAILED GUIDE

### 1. Download ngrok

**Option A: Direct Download**
```
1. Visit: https://ngrok.com/download
2. Download for Windows
3. Extract anywhere (e.g., C:\ngrok)
4. Add to PATH (optional, run from folder otherwise)
```

**Option B: Chocolatey**
```bash
choco install ngrok
```

**Option C: From this project**
If you have ngrok.zip in the project:
```bash
# Extract ngrok.zip to C:\ngrok
# Add C:\ngrok to PATH
```

---

### 2. Create ngrok Account

**Free tier includes:**
- ✅ Public URLs
- ✅ Up to 4 concurrent tunnels
- ✅ No credit card
- ✅ Unlimited bandwidth

**Steps:**
```
1. Go to: https://ngrok.com/signup
2. Use your email
3. Click email verification link
4. Login at: https://dashboard.ngrok.com
5. Copy your authtoken from: https://dashboard.ngrok.com/get-started/your-authtoken
```

---

### 3. Configure ngrok Locally

**Run once to setup:**
```bash
ngrok config add-authtoken YOUR_AUTHTOKEN_HERE
```

This saves to: `%USERPROFILE%\.ngrok2\ngrok.yml`

**Verify it worked:**
```bash
ngrok version
# Should show version number
```

---

### 4. Start Tunnels

**Terminal 1 - Backend API**
```bash
cd C:\Users\Hp\OneDrive\Desktop\code
ngrok http 5000 --region us
```

**Output will show:**
```
ngrok                                       (Ctrl+C to quit)

Session Status                online
Session Name                  shareable-xxxx-xxxx
Version                       3.x.x
Web Interface                 http://127.0.0.1:4040
Forwarding                    https://1234-5678-abcd.ngrok.io -> http://localhost:5000
Connections                   0
```

**Copy the URL:** `https://1234-5678-abcd.ngrok.io`

---

**Terminal 2 - Test Page**
```bash
ngrok http 8080 --region us
```

**Output will show:**
```
Forwarding                    https://5678-1234-dcba.ngrok.io -> http://localhost:8080
```

**Copy this URL too:** `https://5678-1234-dcba.ngrok.io`

---

### 5. Share the URLs

**Send to others:**
```
Backend API:
https://1234-5678-abcd.ngrok.io

Test Page:
https://5678-1234-dcba.ngrok.io

Frontend (when ready):
https://xxxx-yyyy-zzzz.ngrok.io
```

**That's it! They can access from anywhere!** 🌍

---

## 🎯 WHAT OTHERS CAN DO

### Test the API
```bash
# Check if online
curl https://1234-5678-abcd.ngrok.io/api/health

# Register
curl -X POST https://1234-5678-abcd.ngrok.io/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username":"john_doe",
    "email":"john@example.com",
    "password":"SecurePass123!"
  }'

# Login
curl -X POST https://1234-5678-abcd.ngrok.io/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"john@example.com",
    "password":"SecurePass123!"
  }'

# Get markets
curl https://1234-5678-abcd.ngrok.io/api/markets

# Get top gainers
curl https://1234-5678-abcd.ngrok.io/api/markets/top-gainers
```

### View in Browser
```
Just open the URLs:
https://1234-5678-abcd.ngrok.io/api (Backend)
https://5678-1234-dcba.ngrok.io (Test Page)
```

---

## 📊 NGROK DASHBOARD

**Monitor your tunnels:**
```
Visit: http://127.0.0.1:4040 (on your machine)
Shows:
- Real-time requests
- Response codes
- Headers
- Bodies
- Performance stats
```

---

## 🔒 SECURITY TIPS

### Do
- ✅ Use HTTPS (ngrok provides)
- ✅ Don't share URLs publicly
- ✅ Share only with intended users
- ✅ Use strong passwords
- ✅ Keep auth tokens private

### Don't
- ❌ Commit URLs to version control
- ❌ Share credentials in URLs
- ❌ Leave tunnels running 24/7
- ❌ Use production data
- ❌ Expose sensitive information

---

## 📱 EXAMPLE USE CASES

### For Team Testing
```
Scenario: QA team in different location
Solution: 
1. Share ngrok URLs
2. They test platform
3. Report issues
4. You fix in real-time
```

### For Client Demo
```
Scenario: Show client your work
Solution:
1. Start ngrok tunnels
2. Open test page
3. Share URL in Zoom/Meet
4. Give live demo
```

### For Developer Collaboration
```
Scenario: Another dev wants to test
Solution:
1. Share backend URL
2. They build client against it
3. Can test integration
4. Immediate feedback
```

### For Mobile Testing
```
Scenario: Test on mobile device
Solution:
1. Mobile on same WiFi
2. Share your IP: http://192.168.1.x:8080
3. Or use ngrok URL
4. Works on 4G/5G too
```

---

## 🛠️ TROUBLESHOOTING

### "ngrok: command not found"
```bash
# Solution 1: Add to PATH
# Solution 2: Use full path
C:\ngrok\ngrok http 5000

# Solution 3: Run our script
setup-ngrok.bat
```

### "Failed to connect to backend"
```bash
# Check if server is running
http://localhost:5000/api/health

# If not running:
# Terminal at: c:\Users\Hp\OneDrive\Desktop\code\server
# Run: node server.js
```

### "Too many connections"
```bash
# Free tier limit: 4 tunnels
# Solution: Close unused tunnels (Ctrl+C)
# Or upgrade: https://ngrok.com/pricing
```

### "Connection refused"
```bash
# Make sure backend is running
# Check port with:
netstat -ano | findstr :5000
```

---

## ⏱️ SESSION DURATION

**Free tier:** URLs last as long as tunnel is open
**Lifetime:** Close ngrok, lose the URL
**Solution:** Restart ngrok to get new URL

---

## 💡 PRO TIPS

### 1. Name your sessions
```bash
ngrok http 5000 --region us --authtoken TOKEN
# Shows in web interface
```

### 2. Monitor traffic
```bash
# While tunnel running, visit:
http://127.0.0.1:4040
# See all requests in real-time
```

### 3. Custom domains (Paid)
```bash
# Enterprise feature
# Get persistent URLs
```

### 4. TCP tunnels (for databases)
```bash
# If needed later:
ngrok tcp 27017  # For MongoDB
```

---

## 📋 QUICK REFERENCE

| Task | Command |
|------|---------|
| Setup auth | `ngrok config add-authtoken TOKEN` |
| Share port 5000 | `ngrok http 5000` |
| Share port 8080 | `ngrok http 8080` |
| Share port 3000 | `ngrok http 3000` |
| Monitor traffic | Visit `http://127.0.0.1:4040` |
| Check status | `ngrok --version` |
| Stop tunnel | `Ctrl+C` |
| Help | `ngrok --help` |

---

## 🎯 SHARE CHECKLIST

- [ ] Download ngrok
- [ ] Create account
- [ ] Get auth token
- [ ] Run: `ngrok config add-authtoken TOKEN`
- [ ] Start backend tunnel: `ngrok http 5000`
- [ ] Start test page tunnel: `ngrok http 8080`
- [ ] Copy both URLs
- [ ] Send to others
- [ ] They access via URLs
- [ ] ✅ Done!

---

## 🔗 USEFUL LINKS

- ngrok.com: https://ngrok.com
- Pricing: https://ngrok.com/pricing
- Docs: https://ngrok.com/docs
- Dashboard: https://dashboard.ngrok.com
- Support: https://ngrok.com/contact-sales

---

## 📞 NEED HELP?

**Issues:**
1. Check ngrok docs: https://ngrok.com/docs
2. Check if server running: `http://localhost:5000/api/health`
3. Check ngrok status: `http://127.0.0.1:4040`
4. Run: `setup-ngrok.bat` for interactive setup

**More options:**
- See: [NETWORK_ACCESS_GUIDE.md](NETWORK_ACCESS_GUIDE.md)
- See: [CURRENT_STATUS.md](CURRENT_STATUS.md)
- See: [QUICK_START.md](QUICK_START.md)

---

## ✅ YOUR PLATFORM IS READY TO SHARE!

```
Backend: Running ✅
Test Page: Running ✅
ngrok: Ready to setup ✅
Documentation: Complete ✅

Just follow the 3-step quick start above!
```

**Happy Sharing! 🚀**
