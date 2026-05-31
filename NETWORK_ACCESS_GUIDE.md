# TRADEX - Network Access Guide

## 🌐 Making TRADEX Accessible to Others

### Option 1: Local Network Access (Recommended - Easy)

Your TRADEX application can be accessed by others on your local network using your computer's IP address.

#### Steps:

**1. Find Your IP Address**
```bash
ipconfig
```
Look for "IPv4 Address" (usually starts with 192.168 or 10.0)
Example: `192.168.1.100`

**2. Configure Backend for Network Access**
Edit `server/.env`:
```env
HOST=0.0.0.0
PORT=5000
CLIENT_URL=http://YOUR_IP_ADDRESS:3000
```

**3. Configure Frontend for Network Access**
Edit `client/.env`:
```env
REACT_APP_API_URL=http://YOUR_IP_ADDRESS:5000/api
```

**4. Others Can Access**
```
Frontend: http://YOUR_IP_ADDRESS:3000
Backend:  http://YOUR_IP_ADDRESS:5000/api
```

Example with IP 192.168.1.100:
- Frontend: http://192.168.1.100:3000
- Backend: http://192.168.1.100:5000/api

---

### Option 2: Internet Access (Using Ngrok)

Make TRADEX accessible from anywhere on the internet.

#### Requirements:
- ngrok account (free): https://ngrok.com/
- ngrok installed

#### Steps:

**1. Install ngrok**
```bash
# Download from https://ngrok.com/download
# Or via chocolatey (Windows):
choco install ngrok
```

**2. Authenticate ngrok**
```bash
ngrok config add-authtoken YOUR_AUTH_TOKEN
```

**3. Expose Backend**
```bash
ngrok http 5000
```
You'll get a URL like: `https://abc123.ngrok.io`

**4. Expose Frontend**
In another terminal:
```bash
ngrok http 3000 -subdomain=tradex-frontend
```
You'll get a URL like: `https://tradex-frontend.ngrok.io`

**5. Update Configuration**
- Backend `.env`: `CLIENT_URL=https://tradex-frontend.ngrok.io`
- Frontend `.env`: `REACT_APP_API_URL=https://abc123.ngrok.io/api`

**6. Share Links**
- Frontend: `https://tradex-frontend.ngrok.io`
- Backend: `https://abc123.ngrok.io/api`

---

### Option 3: Docker & Cloud Deployment

Deploy to cloud platforms for permanent public access.

#### Platforms:
- **Heroku** - Free tier available (requires free account)
- **Vercel** - Free React hosting
- **AWS** - EC2 instances
- **DigitalOcean** - Affordable VPS
- **Google Cloud** - Free tier available

See `COMPLETE_SETUP_GUIDE.md` for detailed deployment instructions.

---

## 📡 Testing Network Access

### Test Local Network Access

**From Another Computer on Your Network:**

1. Find your IP: Run `ipconfig` on your computer
2. On another device: Open browser
3. Go to: `http://YOUR_IP:3000`

### Test with ngrok

1. Start ngrok: `ngrok http 3000`
2. Copy the ngrok URL
3. Share with others
4. They access via the ngrok URL

---

## 🔧 Firewall Configuration (If Needed)

If others can't access from your network:

**Windows Firewall:**
1. Open Windows Defender Firewall
2. Click "Allow an app through firewall"
3. Click "Allow another app"
4. Find `node.exe` in `Program Files\nodejs\`
5. Click "Add"
6. Allow both Public and Private

**macOS:**
System Settings → Network → Firewall → Firewall Options

**Linux:**
```bash
sudo ufw allow 3000/tcp
sudo ufw allow 5000/tcp
```

---

## ✅ Verify Network Access Works

### From Same Network:
```bash
# Replace with your IP
curl http://192.168.1.100:5000/api/markets
curl http://192.168.1.100:3000
```

### From Different Network (with ngrok):
```bash
curl https://abc123.ngrok.io/api/markets
```

Expected response: JSON data or HTML page

---

## 📝 Quick Access Links

After running TRADEX:

**Local Access:**
- Frontend: http://localhost:3000
- Backend: http://localhost:5000/api

**Network Access (replace IP):**
- Frontend: http://192.168.1.100:3000
- Backend: http://192.168.1.100:5000/api

**Internet Access (with ngrok):**
- Frontend: https://your-url.ngrok.io
- Backend: https://your-backend.ngrok.io/api

---

## 🔐 Security Notes

### For Local Network:
- ✅ Safe within your network
- ✅ No firewall restrictions needed usually
- ⚠️ Anyone on your network can access

### For Internet (ngrok):
- ✅ Encrypted HTTPS connection
- ✅ Free public access
- ⚠️ Anyone with the URL can access
- 💡 Consider adding authentication

### For Production:
- ✅ Use HTTPS only
- ✅ Enable rate limiting
- ✅ Add authentication
- ✅ Use strong JWT secrets
- ✅ Enable CORS properly

---

## 🆘 Troubleshooting

**Problem: Others can't connect**
- Check firewall is allowing ports 3000 and 5000
- Make sure servers are running
- Use correct IP address
- Try accessing from localhost first

**Problem: ngrok URL not working**
- Check ngrok auth token is set
- Restart ngrok with fresh URL
- Check firewall allows outbound connections

**Problem: API errors on network access**
- Update `.env` files with correct IP/URLs
- Restart backend and frontend
- Check CORS is enabled

---

## 📚 More Information

- Full setup guide: See `COMPLETE_SETUP_GUIDE.md`
- Deployment guide: See `COMPLETE_SETUP_GUIDE.md`
- Troubleshooting: See `COMPLETE_SETUP_GUIDE.md`

---

**Your TRADEX application is ready to share! 🚀**
