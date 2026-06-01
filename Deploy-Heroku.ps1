# TRADEX Heroku Deployment Script (PowerShell)
# This script automatically deploys your backend to Heroku

param(
    [string]$AppName = "tradex-api-$(Get-Random)"
)

Write-Host "🚀 TRADEX Backend Heroku Deployment" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

# Check if Heroku CLI is installed
try {
    $herokuVersion = heroku --version 2>&1
    Write-Host "✅ Heroku CLI found: $herokuVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Heroku CLI is not installed." -ForegroundColor Red
    Write-Host "Install with: npm install -g heroku" -ForegroundColor Yellow
    exit 1
}

# Check if git is available
try {
    $gitVersion = git --version
    Write-Host "✅ Git found: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Git is not installed." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📦 App name: $AppName" -ForegroundColor Yellow
Write-Host ""

# Create Procfile
$procfilePath = "Procfile"
if (-not (Test-Path $procfilePath)) {
    Write-Host "📝 Creating Procfile..." -ForegroundColor Cyan
    Set-Content -Path $procfilePath -Value "web: cd server && npm install && node index.js"
    git add $procfilePath
    try { git commit -m "Add Procfile for Heroku deployment" } catch { }
}

# Create .env.production
$envPath = ".env.production"
if (-not (Test-Path $envPath)) {
    Write-Host "📝 Creating .env.production..." -ForegroundColor Cyan
    $envContent = @"
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
"@
    Set-Content -Path $envPath -Value $envContent
}

Write-Host ""
Write-Host "📋 Deployment Steps:" -ForegroundColor Cyan
Write-Host ""

# Step 1: Create Heroku app
Write-Host "1️⃣  Creating Heroku app..." -ForegroundColor Yellow
try {
    $createOutput = heroku create $AppName 2>&1
    Write-Host "✅ App created: $AppName" -ForegroundColor Green
} catch {
    Write-Host "⚠️  App may already exist, continuing..." -ForegroundColor Yellow
}

Write-Host ""

# Step 2: Add git remote
Write-Host "2️⃣  Configuring git remote..." -ForegroundColor Yellow
try {
    heroku git:remote -a $AppName 2>&1 | Out-Null
} catch {
    try {
        git remote add heroku "https://git.heroku.com/$AppName.git" 2>&1 | Out-Null
    } catch { }
}
Write-Host "✅ Git remote configured" -ForegroundColor Green

Write-Host ""

# Step 3: Set environment variables
Write-Host "3️⃣  Setting environment variables..." -ForegroundColor Yellow
$envVars = @(
    "PORT=5000",
    "NODE_ENV=production",
    "CLIENT_URL=https://cosmic-douhua-2c1133.netlify.app",
    "USE_FILE_DB=true",
    "JWT_SECRET=tradex_super_secret_key_change_in_production_2025",
    "EMAIL_HOST=smtp.gmail.com",
    "EMAIL_PORT=587",
    "EMAIL_USER=your-email@gmail.com",
    "EMAIL_PASS=your-app-password",
    "BINANCE_API_KEY=your_binance_api_key",
    "BINANCE_API_SECRET=your_binance_api_secret",
    "MAX_FILE_SIZE=5000000",
    "UPLOAD_PATH=./uploads",
    "RATE_LIMIT_WINDOW_MS=900000",
    "RATE_LIMIT_MAX_REQUESTS=100"
)

foreach ($var in $envVars) {
    try {
        heroku config:set $var -a $AppName 2>&1 | Out-Null
    } catch {
        Write-Host "⚠️  Warning setting $var" -ForegroundColor Yellow
    }
}
Write-Host "✅ Environment variables set" -ForegroundColor Green

Write-Host ""

# Step 4: Push to Heroku
Write-Host "4️⃣  Pushing code to Heroku..." -ForegroundColor Yellow
try {
    git push heroku main
    Write-Host "✅ Code pushed successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Error pushing to Heroku" -ForegroundColor Red
    Write-Host $_.Exception.Message
    exit 1
}

Write-Host ""
Write-Host "╔════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║   ✅ DEPLOYMENT COMPLETE! ✅          ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""

$backendUrl = "https://$AppName.herokuapp.com"
Write-Host "Your backend is now live at:" -ForegroundColor Yellow
Write-Host "🌐 $backendUrl" -ForegroundColor Cyan
Write-Host ""

Write-Host "Test your backend:" -ForegroundColor Yellow
Write-Host "curl $backendUrl/api/health" -ForegroundColor Gray
Write-Host ""

Write-Host "📋 NEXT STEPS:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Copy your backend URL:" -ForegroundColor White
Write-Host "   $backendUrl" -ForegroundColor Yellow
Write-Host ""
Write-Host "2. Go to Netlify Dashboard:" -ForegroundColor White
Write-Host "   https://app.netlify.com" -ForegroundColor Yellow
Write-Host ""
Write-Host "3. Select site: cosmic-douhua-2c1133" -ForegroundColor White
Write-Host ""
Write-Host "4. Go to: Settings → Build & deploy → Environment" -ForegroundColor White
Write-Host ""
Write-Host "5. Add environment variable:" -ForegroundColor White
Write-Host "   REACT_APP_API_URL=$backendUrl" -ForegroundColor Yellow
Write-Host ""
Write-Host "6. Trigger a redeploy" -ForegroundColor White
Write-Host ""
Write-Host "7. Test the full flow:" -ForegroundColor White
Write-Host "   Visit https://cosmic-douhua-2c1133.netlify.app" -ForegroundColor Yellow
Write-Host ""
Write-Host "View deployment logs:" -ForegroundColor Gray
Write-Host "heroku logs --tail -a $AppName" -ForegroundColor Gray
Write-Host ""
