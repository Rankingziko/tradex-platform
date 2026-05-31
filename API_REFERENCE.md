# Admin Deposit Workflow - API Reference Guide

## Quick Start Examples

### 1. User Registration
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "demo@tradex.com",
    "password": "demo123",
    "firstName": "Demo",
    "lastName": "User"
  }'
```

**Response (201)**:
```json
{
  "message": "User registered successfully",
  "user": {
    "_id": "45b9fd4b3e3fa73e2340b323",
    "email": "demo@tradex.com",
    "firstName": "Demo",
    "lastName": "User",
    "balance": 0,
    "createdAt": "2026-05-30T01:12:35.243Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 2. User Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "demo@tradex.com",
    "password": "demo123"
  }'
```

**Response (200)**:
```json
{
  "message": "Login successful",
  "user": {
    "_id": "45b9fd4b3e3fa73e2340b323",
    "email": "demo@tradex.com",
    "firstName": "Demo",
    "lastName": "User",
    "balance": 750
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 3. View Wallets (User)
```bash
curl -X GET http://localhost:5000/api/wallets \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response (200)**:
```json
{
  "wallets": [
    {
      "_id": "0e1f563466c2b7cd36eec26b",
      "currency": "BTC",
      "balance": 500,
      "totalDeposited": 500,
      "totalWithdrawn": 0,
      "address": "btc_address_45b9fd4b"
    },
    {
      "_id": "43aa6dbc5a9e08f4ae647815",
      "currency": "ETH",
      "balance": 250,
      "totalDeposited": 250,
      "totalWithdrawn": 0,
      "address": "eth_address_45b9fd4b"
    }
  ],
  "totalBalance": 750
}
```

---

### 4. Create Deposit (User)
```bash
curl -X POST http://localhost:5000/api/deposits \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "currency": "ETH",
    "amount": 250,
    "method": "bank_transfer",
    "bankDetails": {
      "bankName": "Wells Fargo",
      "accountNumber": "9876543210"
    }
  }'
```

**Response (201)**:
```json
{
  "message": "Deposit request created successfully",
  "deposit": {
    "_id": "2c22caa8a5b95732957dccc3",
    "userId": "45b9fd4b3e3fa73e2340b323",
    "currency": "ETH",
    "amount": 250,
    "method": "bank_transfer",
    "status": "pending",
    "transactionId": "TXN-1780105049460",
    "createdAt": "2026-05-30T01:37:29.460Z"
  }
}
```

---

### 5. Admin Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@tradex.com",
    "password": "admin123"
  }'
```

**Response (200)**:
```json
{
  "message": "Login successful",
  "user": {
    "_id": "e45773463942ed77c1c864dd",
    "email": "admin@tradex.com",
    "firstName": "Admin",
    "lastName": "User",
    "balance": 0
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 6. Get Pending Deposits (Admin)
```bash
curl -X GET http://localhost:5000/api/admin/deposits/pending \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN"
```

**Response (200)**:
```json
{
  "deposits": [
    {
      "_id": "2c22caa8a5b95732957dccc3",
      "userId": "45b9fd4b3e3fa73e2340b323",
      "currency": "ETH",
      "amount": 250,
      "method": "bank_transfer",
      "status": "pending",
      "transactionId": "TXN-1780105049460",
      "createdAt": "2026-05-30T01:37:29.460Z"
    }
  ],
  "total": 1
}
```

---

### 7. Approve Deposit (Admin)
```bash
curl -X PUT http://localhost:5000/api/admin/deposits/2c22caa8a5b95732957dccc3/approve \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Response (200)**:
```json
{
  "message": "Deposit approved successfully",
  "deposit": {
    "_id": "2c22caa8a5b95732957dccc3",
    "userId": "45b9fd4b3e3fa73e2340b323",
    "currency": "ETH",
    "amount": 250,
    "method": "bank_transfer",
    "status": "confirmed",
    "transactionId": "TXN-1780105049460",
    "createdAt": "2026-05-30T01:37:29.460Z",
    "confirmedAt": "2026-05-30T01:41:27.502Z",
    "confirmedBy": "e45773463942ed77c1c864dd"
  }
}
```

---

### 8. Reject Deposit (Admin)
```bash
curl -X PUT http://localhost:5000/api/admin/deposits/81daee1a4b464b02779cb5fb/reject \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "reason": "Insufficient documentation provided"
  }'
```

**Response (200)**:
```json
{
  "message": "Deposit rejected successfully",
  "deposit": {
    "_id": "81daee1a4b464b02779cb5fb",
    "userId": "45b9fd4b3e3fa73e2340b323",
    "currency": "BNB",
    "amount": 100,
    "method": "bank_transfer",
    "status": "cancelled",
    "transactionId": "TXN-1780105404672",
    "createdAt": "2026-05-30T01:43:24.672Z",
    "rejectionReason": "Insufficient documentation provided",
    "rejectedBy": "e45773463942ed77c1c864dd",
    "rejectedAt": "2026-05-30T01:43:25.286Z"
  }
}
```

---

### 9. Get All Deposits (Admin)
```bash
curl -X GET http://localhost:5000/api/admin/deposits \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN"
```

**Response (200)**:
```json
{
  "deposits": [
    {
      "_id": "84fbb832a868793868c880de",
      "userId": "45b9fd4b3e3fa73e2340b323",
      "currency": "BTC",
      "amount": 500,
      "status": "confirmed",
      "confirmedAt": "2026-05-30T01:14:52.953Z"
    },
    {
      "_id": "2c22caa8a5b95732957dccc3",
      "userId": "45b9fd4b3e3fa73e2340b323",
      "currency": "ETH",
      "amount": 250,
      "status": "confirmed",
      "confirmedAt": "2026-05-30T01:41:27.502Z"
    },
    {
      "_id": "81daee1a4b464b02779cb5fb",
      "userId": "45b9fd4b3e3fa73e2340b323",
      "currency": "BNB",
      "amount": 100,
      "status": "cancelled",
      "rejectionReason": "Insufficient documentation provided"
    }
  ],
  "total": 3
}
```

---

### 10. Admin Dashboard Stats
```bash
curl -X GET http://localhost:5000/api/admin/stats/dashboard \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN"
```

**Response (200)**:
```json
{
  "totalDeposits": 2,
  "totalDepositAmount": 750,
  "pendingDeposits": 0
}
```

---

## Authentication

All endpoints (except `/api/auth/register` and `/api/auth/login`) require:

**Header**:
```
Authorization: Bearer <JWT_TOKEN>
```

**JWT Token Structure**:
```json
{
  "userId": "45b9fd4b3e3fa73e2340b323",
  "iat": 1780104231,
  "exp": 1780709031
}
```

### Admin-Only Endpoints
These endpoints also check that the user's email is exactly `admin@tradex.com`:
- `GET /api/admin/deposits/pending`
- `GET /api/admin/deposits`
- `GET /api/admin/stats/dashboard`
- `PUT /api/admin/deposits/:id/approve`
- `PUT /api/admin/deposits/:id/reject`

---

## Error Responses

### 401 Unauthorized
```json
{
  "error": "No token provided"
}
```

### 403 Forbidden
```json
{
  "error": "Admin access required"
}
```

### 404 Not Found
```json
{
  "error": "Deposit not found"
}
```

### 400 Bad Request
```json
{
  "error": "Missing required fields"
}
```

### 500 Server Error
```json
{
  "error": "Internal server error message"
}
```

---

## Deposit Status States

| Status | Description | Wallet Updated |
|--------|-------------|-----------------|
| `pending` | Awaiting admin review | ❌ No |
| `confirmed` | Approved and credited | ✅ Yes |
| `cancelled` | Rejected by admin | ❌ No |

---

## Complete Workflow Example

```bash
# 1. Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"pass123","firstName":"John","lastName":"Doe"}'

# 2. Login user
RESPONSE=$(curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"pass123"}')
USER_TOKEN=$(echo $RESPONSE | jq -r '.token')

# 3. Create deposit
curl -X POST http://localhost:5000/api/deposits \
  -H "Authorization: Bearer $USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"currency":"BTC","amount":1,"method":"bank_transfer"}'

# 4. Login as admin
ADMIN_RESPONSE=$(curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@tradex.com","password":"admin123"}')
ADMIN_TOKEN=$(echo $ADMIN_RESPONSE | jq -r '.token')

# 5. Get pending deposits
curl -X GET http://localhost:5000/api/admin/deposits/pending \
  -H "Authorization: Bearer $ADMIN_TOKEN"

# 6. Approve deposit (use actual ID from step 5)
curl -X PUT http://localhost:5000/api/admin/deposits/DEPOSIT_ID/approve \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{}'

# 7. Verify wallet updated
curl -X GET http://localhost:5000/api/wallets \
  -H "Authorization: Bearer $USER_TOKEN"
```

---

## Testing with PowerShell

```powershell
# Register
$body = @{email="test@example.com"; password="test123"; firstName="Test"; lastName="User"} | ConvertTo-Json
$response = Invoke-WebRequest -Uri "http://localhost:5000/api/auth/register" `
    -Method POST -ContentType "application/json" -Body $body
$token = ($response.Content | ConvertFrom-Json).token

# Create deposit
$depBody = @{currency="ETH"; amount=100; method="bank_transfer"} | ConvertTo-Json
Invoke-WebRequest -Uri "http://localhost:5000/api/deposits" `
    -Method POST -ContentType "application/json" `
    -Headers @{Authorization = "Bearer $token"} `
    -Body $depBody

# Admin login
$adminBody = @{email="admin@tradex.com"; password="admin123"} | ConvertTo-Json
$adminResponse = Invoke-WebRequest -Uri "http://localhost:5000/api/auth/login" `
    -Method POST -ContentType "application/json" -Body $adminBody
$adminToken = ($adminResponse.Content | ConvertFrom-Json).token

# Get pending
Invoke-WebRequest -Uri "http://localhost:5000/api/admin/deposits/pending" `
    -Method GET -Headers @{Authorization = "Bearer $adminToken"}
```

---

## Implementation Notes

### File Database
- Deposits stored in: `server/data/deposits.json`
- Wallets stored in: `server/data/wallets.json`
- Users stored in: `server/data/users.json`
- All changes persist to disk automatically

### ID Generation
- Uses `crypto.randomBytes` for unique IDs
- Format: 24-character hex string
- Example: `2c22caa8a5b95732957dccc3`

### Timestamps
- ISO 8601 format: `2026-05-30T01:37:29.460Z`
- UTC timezone always
- Tracked for: created, confirmed, rejected

### Balance Updates
1. When deposit approved, wallet balance increases by deposit amount
2. User's total balance recalculated from all wallets
3. `totalDeposited` counter incremented
4. All changes written to JSON files

---

**API Reference Complete ✅**
Last Updated: 2026-05-30
Status: All endpoints tested and verified
