#!/usr/bin/env python3
"""
TRADEX Platform - Heroku CLI Deployment Script
Deploy backend without UI interaction using Heroku CLI
"""

import os
import subprocess
import sys
from datetime import datetime

def run_command(cmd, description):
    """Run a command and print results"""
    print(f"\n► {description}")
    print(f"  Command: {cmd}")
    try:
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
        if result.returncode == 0:
            print(f"  ✅ Success")
            if result.stdout:
                print(f"  Output: {result.stdout.strip()[:100]}")
            return True
        else:
            print(f"  ❌ Failed (exit code {result.returncode})")
            if result.stderr:
                print(f"  Error: {result.stderr.strip()[:200]}")
            return False
    except Exception as e:
        print(f"  ❌ Exception: {e}")
        return False

def main():
    """Main deployment flow"""
    print("\n" + "="*70)
    print(" TRADEX PLATFORM - HEROKU CLI DEPLOYMENT")
    print(f" Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("="*70)
    
    print("\n📋 PRE-DEPLOYMENT CHECKLIST")
    print("─"*70)
    
    # Check if Heroku CLI is installed
    print("\n1. Checking Heroku CLI installation...")
    heroku_installed = run_command("heroku --version", "Check Heroku CLI")
    
    if not heroku_installed:
        print("\n❌ Heroku CLI is not installed!")
        print("\n📥 INSTALL HEROKU CLI:")
        print("   Windows (using npm):")
        print("   $ npm install -g heroku")
        print("\n   Or download from:")
        print("   https://devcenter.heroku.com/articles/heroku-cli")
        return 1
    
    # Check Git
    print("\n2. Checking Git installation...")
    git_installed = run_command("git --version", "Check Git")
    
    if not git_installed:
        print("\n❌ Git is not installed!")
        print("   Download from: https://git-scm.com/download")
        return 1
    
    print("\n" + "="*70)
    print(" DEPLOYMENT STEPS")
    print("="*70)
    
    print("\n📝 Step 1: Login to Heroku")
    print("─"*70)
    print("""
    If you don't have a Heroku account:
    1. Go to: https://signup.heroku.com/
    2. Create a free account
    3. Verify your email
    
    Then run in terminal:
    $ heroku login
    
    A browser window will open. Log in with your Heroku credentials.
    """)
    
    # Check Heroku login
    print("Checking Heroku login...")
    login_check = run_command("heroku auth:whoami", "Check Heroku login")
    
    if not login_check:
        print("\n⚠️  You must log in to Heroku first!")
        print("   Run: heroku login")
        print("   Then run this script again")
        return 1
    
    print("\n✅ Heroku authentication successful!")
    
    print("\n📝 Step 2: Create Heroku App")
    print("─"*70)
    
    app_name = "tradex-api"
    print(f"\nCreating app: {app_name}")
    create_app = run_command(f"heroku create {app_name}", "Create Heroku app")
    
    if not create_app:
        print(f"\n💡 App '{app_name}' might already exist")
        print("   Continuing with existing app...")
    
    print("\n📝 Step 3: Configure Environment Variables")
    print("─"*70)
    
    env_vars = {
        "PORT": "5000",
        "NODE_ENV": "production",
        "CLIENT_URL": "https://cosmic-douhua-2c1133.netlify.app",
        "USE_FILE_DB": "true",
        "JWT_SECRET": "tradex_super_secret_key_change_in_production_2025",
        "EMAIL_HOST": "smtp.gmail.com",
        "EMAIL_PORT": "587",
        "EMAIL_USER": "your-email@gmail.com",
        "EMAIL_PASS": "your-app-password",
        "BINANCE_API_KEY": "your_binance_api_key",
        "BINANCE_API_SECRET": "your_binance_api_secret",
        "MAX_FILE_SIZE": "5000000",
        "UPLOAD_PATH": "./uploads",
        "RATE_LIMIT_WINDOW_MS": "900000",
        "RATE_LIMIT_MAX_REQUESTS": "100"
    }
    
    print(f"\nSetting {len(env_vars)} environment variables...")
    
    # Prepare env vars command
    env_cmd_parts = []
    for key, value in env_vars.items():
        env_cmd_parts.append(f"{key}={value}")
    
    env_cmd = f"heroku config:set {' '.join(env_cmd_parts)} -a {app_name}"
    
    print("""
    Running command:
    heroku config:set [all 15 env vars] -a tradex-api
    
    This may take a moment...
    """)
    
    env_set = run_command(env_cmd, "Set environment variables")
    
    if env_set:
        print("✅ All environment variables configured!")
    else:
        print("⚠️  Some environment variables may not have been set")
    
    print("\n📝 Step 4: Deploy from Git")
    print("─"*70)
    
    print("""
    Now deploy the 'server' directory as the main application:
    
    $ git subtree push --prefix server heroku main
    
    This will:
    - Build the Node.js application
    - Install dependencies
    - Start the server
    - Take approximately 2-5 minutes
    """)
    
    print("\n🚀 DEPLOYMENT READY")
    print("="*70)
    
    print("""
    NEXT STEPS:
    
    1. Make sure you're logged in to Heroku:
       $ heroku login
    
    2. Deploy the server directory:
       $ git subtree push --prefix server heroku main
    
    3. Watch the deployment logs:
       $ heroku logs -t -a tradex-api
    
    4. Once deployed, get your app URL:
       $ heroku info -a tradex-api
    
    5. Update Netlify frontend with the new URL:
       - Go to: https://app.netlify.com
       - Select: cosmic-douhua-2c1133
       - Site settings → Build & deploy → Environment
       - Update REACT_APP_API_URL to your Heroku URL
       - Trigger redeploy
    
    6. Test end-to-end:
       - Visit: https://cosmic-douhua-2c1133.netlify.app
       - Try Sign Up and Log In
       - Monitor Network tab in DevTools
    """)
    
    print("\n💡 HELPFUL COMMANDS:")
    print("─"*70)
    print("""
    # Check app status:
    heroku ps -a tradex-api
    
    # View logs:
    heroku logs -t -a tradex-api
    
    # Open app in browser:
    heroku open -a tradex-api
    
    # Get app URL:
    heroku info -a tradex-api
    
    # Scale dynos:
    heroku ps:scale web=1 -a tradex-api
    
    # Update environment variable:
    heroku config:set KEY=value -a tradex-api
    
    # Redeploy:
    git push heroku main
    """)
    
    print("\n📚 DOCUMENTATION:")
    print("─"*70)
    print("""
    • Heroku Node.js Guide:
      https://devcenter.heroku.com/articles/getting-started-with-nodejs
    
    • Heroku CLI Reference:
      https://devcenter.heroku.com/articles/heroku-cli-reference
    
    • DEPLOYMENT_GUIDE.md - Complete walkthrough
    • API_REFERENCE.md - API endpoints
    • DEPLOYMENT_STEPS.md - Step-by-step instructions
    """)
    
    print("\n✨ You're ready to deploy!")
    print("   Follow the steps above to get your TRADEX platform live!\n")
    
    return 0

if __name__ == "__main__":
    sys.exit(main())
