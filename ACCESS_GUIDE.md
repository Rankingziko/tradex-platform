# 🔒 Admin Panel Access Guide

## Your Admin Credentials
- **Email**: ebiyorzikorebai247@gmail.com
- **Password**: zikorebai
- **Username**: admin (alternative)

---

## 🖥️ Access from Different Devices

### 1. **From This Computer (Local)**
```
http://localhost:5000
https://localhost:5000
```

### 2. **From Another Device on Same Network**
First, find your computer's IP address:

**On Windows:**
```powershell
ipconfig
```
Look for "IPv4 Address" (usually starts with 192.168.x.x)

Then on your phone/tablet/other computer:
```
https://<YOUR_IP>:5000
```

**Example:**
If your IP is 192.168.1.100:
```
https://192.168.1.100:5000
```

### 3. **Important Security Notes**
✅ App now runs with HTTPS (encrypted)
✅ Secure session cookies enabled
✅ Security headers added to prevent attacks
✅ Login protected from brute force

⚠️ **Browser Warning**: You may see a security warning about the certificate being self-signed. This is normal for local development. Click "Advanced" and "Proceed anyway" or "Accept the risk".

---

## 📱 Multi-Device Login Flow

1. **Find your IP**: `ipconfig` → copy IPv4 Address
2. **On your device**: Open browser → `https://<YOUR_IP>:5000`
3. **Login**: Use email (ebiyorzikorebai247@gmail.com) and password (zikorebai)
4. **Access admin panel**: `/admin` for deposit management

---

## 🔧 To Access from Internet (External)

You would need to:
1. Set up port forwarding on your router (5000 → 5000)
2. Get your public IP address from your ISP
3. Use a dynamic DNS service (if IP changes)
4. Add firewall rules for security

For now, the app is accessible only to devices on your local network. 🔐
