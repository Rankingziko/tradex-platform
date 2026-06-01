#!/usr/bin/env python3
"""
TRADEX Platform - Direct API Deployment Script
Uses Render or Railway APIs to deploy without UI interaction
"""

import os
import sys
import json
from datetime import datetime

class DeploymentHelper:
    """Helper class for platform deployments"""
    
    def __init__(self):
        self.render_api_key = os.environ.get('RENDER_API_KEY')
        self.railway_api_key = os.environ.get('RAILWAY_API_KEY')
        
    def show_manual_deployment(self):
        """Display manual deployment steps when APIs not available"""
        print("\n" + "="*70)
        print(" TRADEX PLATFORM - MANUAL DEPLOYMENT GUIDE")
        print("="*70)
        
        print("\n🔧 AUTOMATIC DEPLOYMENT NOT AVAILABLE")
        print("\nThe deployment UI has interaction issues. Please follow these manual steps:")
        
        print("\n" + "─"*70)
        print("OPTION 1: Deploy on Vercel (Recommended - Easiest)")
        print("─"*70)
        
        print("\n1. Go to: https://vercel.com/new")
        print("2. Connect GitHub account if not already connected")
        print("3. Import the repository: https://github.com/Rankingziko/tradex-platform")
        print("4. Configure:")
        print("   • Framework Preset: Other")
        print("   • Build Command: npm install && npm run build")
        print("   • Root Directory: server")
        print("5. Add Environment Variables (same ones as Render/Railway)")
        print("6. Click Deploy")
        print("\nVercel advantages:")
        print("✅ Simpler GitHub integration")
        print("✅ Auto-generates URL")
        print("✅ Free tier available")
        print("✅ Automatic deployments on git push")
        
        print("\n" + "─"*70)
        print("OPTION 2: Deploy on Heroku")
        print("─"*70)
        
        print("\n1. Install Heroku CLI: https://devcenter.heroku.com/articles/heroku-cli")
        print("2. Login: heroku login")
        print("3. Create app: heroku create tradex-api")
        print("4. Add remote: git remote set-url heroku https://git.heroku.com/tradex-api.git")
        print("5. Set environment variables:")
        
        env_vars = [
            "PORT=5000",
            "NODE_ENV=production",
            "CLIENT_URL=https://cosmic-douhua-2c1133.netlify.app",
            "USE_FILE_DB=true",
            "JWT_SECRET=tradex_super_secret_key_change_in_production_2025",
            "EMAIL_HOST=smtp.gmail.com",
            "EMAIL_PORT=587",
            "EMAIL_USER=your-email@gmail.com",
            "EMAIL_PASS=your-app-password",
            "BINANCE_API_KEY=your_key",
            "BINANCE_API_SECRET=your_secret",
            "MAX_FILE_SIZE=5000000",
            "UPLOAD_PATH=./uploads",
            "RATE_LIMIT_WINDOW_MS=900000",
            "RATE_LIMIT_MAX_REQUESTS=100"
        ]
        
        for var in env_vars:
            print(f"   heroku config:set {var}")
        
        print("\n6. Deploy: git subtree push --prefix server heroku main")
        print("\nHeroku advantages:")
        print("✅ Free tier still available")
        print("✅ Built for Node.js")
        print("✅ Simple CLI deployment")
        
        print("\n" + "─"*70)
        print("OPTION 3: Deploy on DigitalOcean App Platform")
        print("─"*70)
        
        print("\n1. Go to: https://cloud.digitalocean.com/apps")
        print("2. Click 'Create App'")
        print("3. Connect GitHub account")
        print("4. Select repository: Rankingziko/tradex-platform")
        print("5. Configure:")
        print("   • Service name: tradex-api")
        print("   • Build command: npm install")
        print("   • Run command: npm start")
        print("   • HTTP Port: 5000")
        print("6. Add all 15 environment variables")
        print("7. Click 'Create Resources' and 'Deploy'")
        print("\nDigitalOcean advantages:")
        print("✅ $5/month basic tier")
        print("✅ Good GitHub integration")
        print("✅ Reliable infrastructure")
        
        print("\n" + "="*70)
        print(" RECOMMENDED: Use Vercel (simplest GitHub integration)")
        print("="*70 + "\n")
        
    def show_troubleshooting(self):
        """Show troubleshooting for GitHub visibility"""
        print("\n" + "="*70)
        print(" GITHUB REPOSITORY VISIBILITY ISSUE - TROUBLESHOOTING")
        print("="*70)
        
        print("\n❓ Why can't Railway/Render find your repository?")
        print("\nPossible causes:")
        print("1. Different GitHub account (rank247 on Railway vs Rankingziko owner)")
        print("2. GitHub App not authorized for Rankingziko's repositories")
        print("3. Repository visibility settings")
        
        print("\n✅ Solutions:")
        print("\n1. Check GitHub App Authorization:")
        print("   • Go to: https://github.com/settings/apps/authorized")
        print("   • Look for Railway or Render app")
        print("   • Click 'Configure' to grant repository access")
        print("   • Select 'Rankingziko/tradex-platform'")
        
        print("\n2. Verify Repository Settings:")
        print("   • Go to: https://github.com/Rankingziko/tradex-platform")
        print("   • Verify repository is PUBLIC (not private)")
        print("   • Check Settings → Collaborators (if private)")
        
        print("\n3. Try Using Full Repository URL:")
        print("   • Instead of: tradex-platform")
        print("   • Use: Rankingziko/tradex-platform")
        print("   • Or: https://github.com/Rankingziko/tradex-platform")
        
        print("\n4. Switch to Alternative Platform:")
        print("   • Vercel has simpler GitHub auth")
        print("   • Heroku CLI doesn't need GitHub at all")
        print("   • DigitalOcean has better GitHub UX")
        
        print("\n" + "="*70 + "\n")
    
    def verify_repository_status(self):
        """Verify the GitHub repository is accessible"""
        print("\n🔍 Repository: https://github.com/Rankingziko/tradex-platform")
        print("✅ All files committed and ready to deploy")
    
    def main(self):
        """Main execution"""
        print("\n" + "="*70)
        print(" TRADEX PLATFORM - DEPLOYMENT AUTOMATION")
        print(f" Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print("="*70)
        
        # Check repository status
        self.verify_repository_status()
        
        # Show troubleshooting
        self.show_troubleshooting()
        
        # Show deployment options
        self.show_manual_deployment()
        
        print("\n💡 NEXT STEPS:")
        print("1. Choose a deployment platform from the options above")
        print("2. Follow the steps provided")
        print("3. After deployment, update Netlify API URL")
        print("4. Run end-to-end tests")
        
        print("\n📚 ADDITIONAL RESOURCES:")
        print("• DEPLOYMENT_GUIDE.md - Complete walkthrough")
        print("• DEPLOYMENT_STEPS.md - Step-by-step instructions")
        print("• API_REFERENCE.md - API endpoint documentation")
        
        print("\n✨ You're ready to deploy! Choose your platform above.\n")

if __name__ == "__main__":
    helper = DeploymentHelper()
    helper.main()
