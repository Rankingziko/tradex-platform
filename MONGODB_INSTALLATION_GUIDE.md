# 🗄️ MONGODB INSTALLATION GUIDE - QUICK SETUP

**Goal**: Install MongoDB so you can fully test the deposit feature  
**Time**: 5 minutes  
**Cost**: FREE (Community Edition)

---

## 🚀 OPTION 1: Windows Installer (Easiest) ⭐ RECOMMENDED

### **Step 1: Download MongoDB**
1. Go to: https://www.mongodb.com/try/download/community
2. Select:
   - **OS**: Windows (x64)
   - **Version**: Latest stable (7.0+)
   - **Package**: MSI
3. Click **Download**

### **Step 2: Install MongoDB**
1. Open the downloaded `.msi` file
2. Click **Next** through installer
3. Accept license agreement
4. Choose **Complete** installation
5. Check box: "Install MongoDB as a Service"
6. Click **Install**
7. Wait for installation (2-3 minutes)
8. Click **Finish**

### **Step 3: Verify Installation**
```powershell
mongod --version
# Should show version number like: db version v7.0.0
```

### **Step 4: Start MongoDB Service**

**Option A: Service Already Running (if auto-start enabled)**
```powershell
# Check if running:
Get-Service MongoDB
# Should show "Running"
```

**Option B: Start Service Manually**
```powershell
# Start the service:
Start-Service MongoDB

# Verify it's running:
Get-Service MongoDB | Select-Object Status
# Should show: Status : Running
```

---

## 🐳 OPTION 2: Docker (If Docker Desktop is Installed)

```powershell
# Start MongoDB container
docker run -d `
  --name mongodb `
  -p 27017:27017 `
  -e MONGO_INITDB_ROOT_USERNAME=admin `
  -e MONGO_INITDB_ROOT_PASSWORD=password `
  mongo:latest

# Verify it's running:
docker ps | grep mongodb
```

---

## ☁️ OPTION 3: MongoDB Atlas (Cloud - No Installation)

### **Step 1: Create Account**
1. Go to: https://www.mongodb.com/cloud/atlas
2. Click **Sign Up** (free tier available)
3. Create account with email

### **Step 2: Create Free Cluster**
1. Click **Create a Deployment**
2. Select **Free** tier (M0)
3. Choose region closest to you
4. Click **Create**
5. Wait 2-3 minutes for cluster creation

### **Step 3: Get Connection String**
1. Click **Connect**
2. Choose **Drivers**
3. Copy connection string (looks like):
```
mongodb+srv://username:password@cluster.mongodb.net/database
```

### **Step 4: Update Backend .env File**
Edit: `c:\Users\Hp\OneDrive\Desktop\code\.env`
```env
# Change from:
MONGODB_URI=mongodb://localhost:27017/tradex

# To:
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/tradex
```

### **Step 5: Restart Backend**
```powershell
cd c:\Users\Hp\OneDrive\Desktop\code\server
node server.js
```

---

## ✅ VERIFY MONGODB IS RUNNING

### **Test Connection:**
```powershell
mongo
# Should show: MongoDB shell version v7.0.0
# And: connecting to: mongodb://localhost:27017/test

# Try a command:
db.version()
# Should show version

# Exit:
exit()
```

### **Or using mongosh (newer client):**
```powershell
mongosh
# Similar output as above
```

---

## 🔧 TROUBLESHOOTING

### **"mongod: command not found"**
- MongoDB not in PATH
- **Solution**: Restart PowerShell or add to PATH
- Or use full path: `C:\Program Files\MongoDB\Server\7.0\bin\mongod`

### **"Port 27017 already in use"**
```powershell
# Find process using port:
netstat -ano | findstr :27017

# Kill the process (if needed):
taskkill /PID <PID> /F
```

### **Service won't start**
```powershell
# Check service status:
Get-Service MongoDB

# If stopped, restart:
Restart-Service MongoDB

# Check logs:
Get-EventLog -LogName Application -Source MongoDB
```

### **"Connection refused"**
- MongoDB service not running
- **Solution**: `Start-Service MongoDB` or restart `mongod`

---

## 📊 VERIFY MONGODB WORKING

Once MongoDB is running, test your backend:

```powershell
# Terminal 1: Start MongoDB (if not already running as service)
mongod

# Terminal 2: Start Backend
cd c:\Users\Hp\OneDrive\Desktop\code\server
node server.js

# Terminal 3: Test health check
curl http://localhost:5000/api/health

# Should return:
# {"status":"OK","timestamp":"...","uptime":...}
```

---

## 🎯 NEXT STEPS AFTER MONGODB RUNNING

1. **Restart Backend**
   ```powershell
   cd c:\Users\Hp\OneDrive\Desktop\code\server
   node server.js
   ```

2. **Open Frontend**
   ```
   http://localhost:3000
   ```

3. **Login with Demo Credentials**
   - Email: `demo@tradex.com`
   - Password: `demo123`

4. **Navigate to Wallets**
   - Click "Wallets" in sidebar

5. **Test Deposit Feature**
   - Click [+ Deposit] button
   - Fill form (USDT, 100, Crypto Wallet)
   - Click Submit
   - See deposit appear with "pending" status
   - Approve in admin panel
   - See funds added to wallet

---

## 💡 WHICH OPTION TO CHOOSE?

| Option | Pros | Cons | Time |
|--------|------|------|------|
| **Windows Installer** | Simple, integrated, fast | Installs service | 5 min |
| **Docker** | Container, portable | Requires Docker | 2 min |
| **MongoDB Atlas** | No installation, cloud-based, scalable | Internet required, slower | 10 min |

### **Recommendation:**
👉 **Use Windows Installer** - Simplest for your situation

---

## 📝 QUICK COMMANDS

```powershell
# Start MongoDB (as service)
Start-Service MongoDB

# Stop MongoDB
Stop-Service MongoDB

# Check if running
Get-Service MongoDB | Select-Object Status

# Start MongoDB manually (if not as service)
mongod

# Connect to MongoDB
mongosh
# or
mongo

# View databases
show dbs

# View collections
show collections

# View data
db.users.find()

# Exit
exit()
```

---

## 🎉 YOU'RE READY!

Once MongoDB is installed and running:

1. ✅ Backend will connect to database
2. ✅ Users can register and login
3. ✅ Deposits will be stored in database
4. ✅ All features will work perfectly
5. ✅ Your TRADEX platform is production-ready!

---

## 📞 STILL STUCK?

**MongoDB Documentation:**
- https://docs.mongodb.com/manual/installation/
- https://docs.mongodb.com/manual/tutorial/getting-started/

**Quick Troubleshooting:**
1. Is service running? `Get-Service MongoDB`
2. Is port 27017 listening? `netstat -ano | findstr :27017`
3. Check MongoDB logs in Event Viewer
4. Try restarting the service

---

# ✨ MongoDB Installation = Unlocks Full TRADEX Platform ✨

Once installed, test the complete deposit feature as described in:  
`DEPOSIT_FEATURE_COMPLETE_WALKTHROUGH.md`
