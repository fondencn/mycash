#!/bin/bash

# MyCash GitHub Repository Setup Script
# Run this script after creating the GitHub repository

echo "🚀 Setting up GitHub repository for MyCash..."

# Check if we're in the right directory
if [ ! -f "mycash/package.json" ]; then
    echo "❌ Error: Please run this script from the /home/cf/git/mycash directory"
    exit 1
fi

# Get the GitHub repository URL from user
echo ""
echo "📝 Please enter your GitHub repository URL (e.g., https://github.com/yourusername/mycash.git):"
read -p "Repository URL: " REPO_URL

if [ -z "$REPO_URL" ]; then
    echo "❌ Error: Repository URL cannot be empty"
    exit 1
fi

echo ""
echo "🔗 Adding remote repository..."
git remote add origin "$REPO_URL"

echo "📤 Pushing to GitHub..."
echo "  - Pushing master branch..."
git push -u origin master

echo "  - Pushing initialDraft branch..."
git push -u origin initialDraft

echo ""
echo "✅ Successfully pushed MyCash to GitHub!"
echo "🌟 Repository URL: $REPO_URL"
echo ""
echo "📋 Repository contains:"
echo "  ✓ Complete MyCash application source code"
echo "  ✓ Comprehensive documentation (README, DEVELOPMENT, DEPLOYMENT guides)"
echo "  ✓ Production-ready build configuration"
echo "  ✓ Cross-platform support setup (Android, iOS, Web, Desktop)"
echo "  ✓ Material Design UI components"
echo "  ✓ SQLite database integration"
echo ""
echo "🎯 Next steps:"
echo "  1. Visit your GitHub repository to verify the upload"
echo "  2. Set up GitHub Actions for CI/CD (optional)"
echo "  3. Configure branch protection rules (optional)"
echo "  4. Share the repository or invite collaborators"
echo ""
echo "🚀 Happy coding!"