#!/bin/bash
# TRADEX Heroku Deployment Script
# This script automatically deploys your backend to Heroku

set -e

echo "🚀 TRADEX Backend Heroku Deployment"
echo "===================================="
echo ""

# Check if Heroku CLI is installed
if ! command -v heroku &> /dev/null; then
    echo "❌ Heroku CLI is not installed."
    echo "Install with: npm install -g heroku"
    exit 1
fi

# Check if git is available
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed."
    exit 1
fi

echo "✅ Prerequisites checked"
echo ""

# Get app name
APP_NAME="${1:-tradex-api-$(date +%s)}"
echo "📦 App name: $APP_NAME"
echo ""

# Create Procfile if it doesn't exist
if [ ! -f "Procfile" ]; then
    echo "web: cd server && node index.js" > Procfile
    git add Procfile
    git commit -m "Add Procfile for Heroku deployment" || true
fi

# Create .env.production if it doesn't exist
if [ ! -f ".env.production" ]; then
    cat > .env.production << 'EOF'
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
EOF
    echo "✅ Created .env.production"
fi

echo ""
echo "📋 Deployment Steps:"
echo "1. Creating Heroku app..."

# Create Heroku app
heroku create "$APP_NAME" --no-remote || true

echo "✅ App created: $APP_NAME"
echo ""

echo "2. Adding git remote..."
heroku git:remote -a "$APP_NAME" || git remote add heroku "https://git.heroku.com/$APP_NAME.git" || true

echo "✅ Git remote configured"
echo ""

echo "3. Setting environment variables..."
heroku config:set \
  PORT=5000 \
  NODE_ENV=production \
  CLIENT_URL=https://cosmic-douhua-2c1133.netlify.app \
  USE_FILE_DB=true \
  JWT_SECRET=tradex_super_secret_key_change_in_production_2025 \
  EMAIL_HOST=smtp.gmail.com \
  EMAIL_PORT=587 \
  EMAIL_USER=your-email@gmail.com \
  EMAIL_PASS=your-app-password \
  BINANCE_API_KEY=your_binance_api_key \
  BINANCE_API_SECRET=your_binance_api_secret \
  MAX_FILE_SIZE=5000000 \
  UPLOAD_PATH=./uploads \
  RATE_LIMIT_WINDOW_MS=900000 \
  RATE_LIMIT_MAX_REQUESTS=100 \
  -a "$APP_NAME"

echo "✅ Environment variables set"
echo ""

echo "4. Pushing code to Heroku..."
git push heroku main

echo ""
echo "✅ Deployment Complete!"
echo ""
echo "Your backend is now live at:"
echo "🌐 https://$APP_NAME.herokuapp.com"
echo ""
echo "Test with:"
echo "curl https://$APP_NAME.herokuapp.com/api/health"
echo ""
echo "Next steps:"
echo "1. Copy the URL above"
echo "2. Go to https://app.netlify.com"
echo "3. Select: cosmic-douhua-2c1133"
echo "4. Settings → Build & deploy → Environment"
echo "5. Add: REACT_APP_API_URL=https://$APP_NAME.herokuapp.com"
echo "6. Trigger redeploy"
echo ""
echo "View logs:"
echo "heroku logs --tail -a $APP_NAME"
