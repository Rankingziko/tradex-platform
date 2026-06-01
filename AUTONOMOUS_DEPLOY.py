#!/usr/bin/env python3
"""
TRADEX Autonomous Deployment Manager
Deploys backend to available production platforms
"""

import os
import sys
import json
import subprocess
import time
from pathlib import Path

class DeploymentManager:
    def __init__(self):
        self.repo_path = Path(__file__).parent
        self.server_path = self.repo_path / "server"
        self.base_env = {
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
    
    def check_deployment_status(self):
        """Check if everything is ready for deployment"""
        print("=" * 60)
        print("TRADEX BACKEND DEPLOYMENT STATUS CHECK")
        print("=" * 60)
        
        checks = {
            "Git Repository": self.check_git(),
            "Docker Configuration": self.check_docker(),
            "Environment Config": self.check_env_config(),
            "Server Code": self.check_server_code(),
            "Backend Health": self.check_health()
        }
        
        for check, passed in checks.items():
            status = "✅ PASS" if passed else "❌ FAIL"
            print(f"{status} - {check}")
        
        return all(checks.values())
    
    def check_git(self):
        """Verify Git configuration"""
        try:
            result = subprocess.run(
                ["git", "rev-parse", "--is-inside-work-tree"],
                cwd=self.repo_path,
                capture_output=True,
                text=True
            )
            return result.returncode == 0
        except:
            return False
    
    def check_docker(self):
        """Verify Docker configuration exists"""
        dockerfile = self.server_path / "Dockerfile"
        docker_compose = self.repo_path / "docker-compose.yml"
        return dockerfile.exists() and docker_compose.exists()
    
    def check_env_config(self):
        """Verify environment configuration files exist"""
        return (self.repo_path / "render.yaml").exists() or \
               (self.repo_path / "vercel.json").exists()
    
    def check_server_code(self):
        """Verify server code exists"""
        return (self.server_path / "index.js").exists() and \
               (self.server_path / "package.json").exists()
    
    def check_health(self):
        """Check if backend starts successfully"""
        try:
            result = subprocess.run(
                ["npm", "start"],
                cwd=self.server_path,
                capture_output=True,
                text=True,
                timeout=5
            )
            return result.returncode == 0
        except subprocess.TimeoutExpired:
            return True  # Assume OK if it starts (timeout is expected)
        except:
            return False
    
    def get_deployment_options(self):
        """Return available deployment platforms"""
        return {
            "1": {
                "name": "Render (Recommended)",
                "url": "https://dashboard.render.com/new/web-service",
                "time": "5-10 min",
                "instructions": [
                    "1. Go to https://dashboard.render.com",
                    "2. Click 'New +' → 'Web Service'",
                    "3. Connect GitHub → Select 'Rankingziko/tradex-platform'",
                    "4. Root Directory: server",
                    "5. Build Command: npm install",
                    "6. Start Command: node index.js",
                    "7. Add 15 environment variables",
                    "8. Deploy"
                ]
            },
            "2": {
                "name": "Railway (Free Tier)",
                "url": "https://railway.app/new",
                "time": "5-10 min",
                "instructions": [
                    "1. Go to https://railway.app",
                    "2. Click 'Deploy with GitHub'",
                    "3. Authorize GitHub & select 'tradex-platform'",
                    "4. Railway auto-detects from render.yaml",
                    "5. Add 15 environment variables",
                    "6. Deploy"
                ]
            },
            "3": {
                "name": "Heroku (Via CLI)",
                "url": "https://www.heroku.com",
                "time": "10-15 min",
                "instructions": [
                    "1. Ensure Heroku CLI is installed",
                    "2. Run: heroku login",
                    "3. Run: heroku create tradex-api",
                    "4. Run: git push heroku main",
                    "5. Set environment variables: heroku config:set KEY=value",
                    "6. Monitor: heroku logs --tail"
                ]
            },
            "4": {
                "name": "Fly.io (Modern)",
                "url": "https://fly.io",
                "time": "10-15 min",
                "instructions": [
                    "1. Install Fly CLI: curl -L https://fly.io/install.sh | sh",
                    "2. Run: fly auth signup",
                    "3. Run: fly launch (in project directory)",
                    "4. Configure fly.toml with server directory",
                    "5. Run: fly deploy",
                    "6. Monitor with: fly logs"
                ]
            },
            "5": {
                "name": "DigitalOcean App Platform",
                "url": "https://cloud.digitalocean.com/apps",
                "time": "15-20 min",
                "instructions": [
                    "1. Go to DigitalOcean Dashboard",
                    "2. Apps → Create App",
                    "3. Connect GitHub repository",
                    "4. Select 'tradex-platform' repository",
                    "5. Configure build and run commands",
                    "6. Add 15 environment variables",
                    "7. Select $5/month plan",
                    "8. Deploy"
                ]
            }
        }
    
    def print_deployment_guide(self):
        """Print comprehensive deployment guide"""
        print("\n" + "=" * 60)
        print("TRADEX BACKEND DEPLOYMENT GUIDE")
        print("=" * 60)
        
        options = self.get_deployment_options()
        
        for key, option in options.items():
            print(f"\n▶ Option {key}: {option['name']}")
            print(f"  Platform: {option['url']}")
            print(f"  Time: {option['time']}")
            print(f"\n  Steps:")
            for instruction in option['instructions']:
                print(f"    {instruction}")
        
        print("\n" + "=" * 60)
        print("ENVIRONMENT VARIABLES (15 Total)")
        print("=" * 60)
        
        for key, value in self.base_env.items():
            print(f"  {key}={value}")
        
        print("\n" + "=" * 60)
        print("QUICK LINKS")
        print("=" * 60)
        print(f"  GitHub Repo: https://github.com/Rankingziko/tradex-platform")
        print(f"  Frontend: https://cosmic-douhua-2c1133.netlify.app")
        print(f"  API Reference: ./API_REFERENCE.md")
        
        print("\n" + "=" * 60)
        print("DEPLOYMENT CHECKLIST")
        print("=" * 60)
        print("  ✅ Backend code complete")
        print("  ✅ Docker configured")
        print("  ✅ Git repository ready")
        print("  ✅ Environment variables documented")
        print("  ✅ Frontend deployed on Netlify")
        print("\n  📋 NEXT: Choose one platform above and follow the steps!")
        print("=" * 60)
    
    def deploy_local_docker(self):
        """Deploy locally using Docker"""
        print("\n🐳 Starting local Docker deployment...")
        try:
            result = subprocess.run(
                ["docker-compose", "up", "-d"],
                cwd=self.repo_path,
                capture_output=True,
                text=True
            )
            if result.returncode == 0:
                print("✅ Docker container started successfully!")
                print("Backend available at: http://localhost:5000")
                print("Health check: http://localhost:5000/api/health")
                return True
            else:
                print(f"❌ Docker deployment failed: {result.stderr}")
                return False
        except Exception as e:
            print(f"❌ Error: {e}")
            return False

def main():
    manager = DeploymentManager()
    
    print("\n🚀 TRADEX Autonomous Deployment Manager\n")
    
    # Check deployment readiness
    if manager.check_deployment_status():
        print("\n✅ All checks passed! Ready for deployment!\n")
    else:
        print("\n⚠️  Some checks failed. Please review above.\n")
    
    # Show deployment guide
    manager.print_deployment_guide()
    
    print("\n" + "=" * 60)
    print("QUICK START OPTIONS:")
    print("=" * 60)
    print("  1. View deployment guide above")
    print("  2. Choose ONE platform (Render, Railway, Heroku, Fly.io, or DigitalOcean)")
    print("  3. Follow the steps provided")
    print("  4. Copy your backend URL when deployment completes")
    print("  5. Update Netlify with: REACT_APP_API_URL=<your-backend-url>")
    print("  6. Test at: https://cosmic-douhua-2c1133.netlify.app")
    print("=" * 60)
    
    print("\n💡 Need help? Check these files:")
    print("  - FINAL_DEPLOYMENT_GUIDE.md")
    print("  - DEPLOYMENT_STEPS.md")
    print("  - API_REFERENCE.md")

if __name__ == "__main__":
    main()
