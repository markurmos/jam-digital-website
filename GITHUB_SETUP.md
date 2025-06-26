# GitHub Repository Setup Commands

## After GitHub CLI Authentication

Once you've completed `gh auth login`, run these commands:

```bash
# Navigate to project directory
cd "/Users/markurmos/Projects/JAM Digital/jam-digital-website"

# Create GitHub repository
gh repo create jam-digital-website --public --description "Modern JAM Digital website built with Next.js, React Native, and AI capabilities"

# Add remote and push
git remote add origin https://github.com/$(gh api user --jq .login)/jam-digital-website.git
git push -u origin main
```

## Alternative: Manual GitHub Setup

1. Go to https://github.com/new
2. Repository name: `jam-digital-website`
3. Description: `Modern JAM Digital website built with Next.js, React Native, and AI capabilities`
4. Set to Public
5. Don't initialize with README
6. Create repository
7. Run these commands:

```bash
cd "/Users/markurmos/Projects/JAM Digital/jam-digital-website"
git remote add origin https://github.com/YOUR_USERNAME/jam-digital-website.git
git push -u origin main
```

## Verify Setup

After pushing, verify with:
```bash
git remote -v
git log --oneline
```

Your repository should be available at: https://github.com/YOUR_USERNAME/jam-digital-website